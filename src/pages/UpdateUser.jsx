import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { createUser } from '../services/api';
import { FiUser, FiLock, FiMail, FiShield } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

const Updateuser = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
    const { state } = location;
    console.log('state', state)
    const users = state?.data || [];
    console.log('users', users)

  // Form validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    login_id: Yup.string().required('Login ID is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    role_id: Yup.string().required('Role is required'),
  });

  // Form handling with Formik
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
                type="password"
                className="input pl-10"
                placeholder="Enter password"
                {...formik.getFieldProps('password')}
              />
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
                <option value="1">Admin</option>
                <option value="2">Manager</option>
                <option value="3">User</option>
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

export default Updateuser;