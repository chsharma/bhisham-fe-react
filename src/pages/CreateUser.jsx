import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { createUser, getRoleList } from '../services/api';
import { FiUser, FiLock, FiMail, FiShield, FiEye, FiEyeOff } from 'react-icons/fi';

const CreateUser = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [roleList, setRoleList] = useState([]);

  useEffect(() => {
    fetchRoleList();
  }, []);

  const fetchRoleList = async () => {
    setLoading(true);
    try {
      const response = await getRoleList(user);
      console.log('response from role list', response);

      if (response && response.data && Array.isArray(response.data)) {
        setRoleList(response.data);
      } else if (Array.isArray(response)) {
        setRoleList(response);
      } else {
        console.error('Unexpected API response format:', response);
        setRoleList([]);
        toast.error('Received invalid data format from server');
      }
    } catch (error) {
      toast.error('Failed to fetch roles');
      console.error('Error fetching roles:', error);
      setRoleList([]);
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    login_id: Yup.string().required('Login ID is required'),
    password: Yup.string().min(5, 'Password must be at least 5 characters').required('Password is required'),
    role_id: Yup.string().required('Role is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      login_id: '',
      password: '',
      role_id: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        values.role_id = values.role_id ? parseInt(values.role_id, 10) : 0;

        await createUser(values);
        toast.success('User created successfully');
        formik.resetForm();
      } catch (error) {
        toast.error('Failed to create user');
        console.error('Error creating user:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Create New User</h2>
        
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="label">
              Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                className="input pl-10"
                placeholder="Enter user name"
                {...formik.getFieldProps('name')}
              />
            </div>
            {formik.touched.name && formik.errors.name ? (
              <div className="text-sm text-red-600 mt-1">{formik.errors.name}</div>
            ) : null}
          </div>
          
          {/* Login ID Field */}
          <div>
            <label htmlFor="login_id" className="label">
              Login ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-400" />
              </div>
              <input
                id="login_id"
                name="login_id"
                type="text"
                className="input pl-10"
                placeholder="Enter login ID"
                {...formik.getFieldProps('login_id')}
              />
            </div>
            {formik.touched.login_id && formik.errors.login_id ? (
              <div className="text-sm text-red-600 mt-1">{formik.errors.login_id}</div>
            ) : null}
          </div>
          
          {/* Password Field */}
          <div>
            <label htmlFor="password" className="label">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="input pl-10 pr-10"
                placeholder="Enter password"
                {...formik.getFieldProps('password')}
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff className="text-gray-400" /> : <FiEye className="text-gray-400" />}
              </div>
            </div>
            {formik.touched.password && formik.errors.password ? (
              <div className="text-sm text-red-600 mt-1">{formik.errors.password}</div>
            ) : null}
          </div>
          
          {/* Role ID Field */}
          <div>
            <label htmlFor="role_id" className="label">
              Role
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiShield className="text-gray-400" />
              </div>
              <select
                id="role_id"
                name="role_id"
                className="input pl-10"
                {...formik.getFieldProps('role_id')}
              >
                <option value="">Select a role</option>
                {roleList.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            {formik.touched.role_id && formik.errors.role_id ? (
              <div className="text-sm text-red-600 mt-1">{formik.errors.role_id}</div>
            ) : null}
          </div>
          
          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating User...
                </>
              ) : (
                'Create User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
