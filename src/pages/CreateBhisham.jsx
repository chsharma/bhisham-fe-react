import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { createBhisham, getBhishmType } from '../services/api';
import { FiPackage, FiHash, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const CreateBhisham = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [bhishmType, setBhishmType] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBhishmTypeList();
  }, []);

  const fetchBhishmTypeList = async () => {
    setLoading(true);
    try {
      const response = await getBhishmType(user);
      console.log('response from bhisham type', response);
      if (response && response.data && Array.isArray(response.data)) {
        setBhishmType(response.data);
      } else if (Array.isArray(response)) {
        setBhishmType(response);
      } else {
        setBhishmType([]);
        toast.error('Invalid data format received from server');
      }
    } catch (error) {
      toast.error('Failed to fetch Bhishm types');
      console.error('Error fetching Bhishm types:', error);
      setBhishmType([]);
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Bhishm name is required'),
    serial_no: Yup.string().required('Serial number is required'),
    bhisham_id: Yup.number().typeError('Please select a valid Bhishm type').required('Please select a Bhishm type'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      serial_no: '',
      bhisham_id: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const data = {
          bhisham_name: values.name,
          serial_no: values.serial_no,
          id: parseInt(values.bhisham_id, 10),
        };
        await createBhisham(data);
        toast.success('Bhishm created successfully');
        navigate('/view-bhisham');
      } catch (error) {
        toast.error('Failed to create Bhishm');
        console.error('Error creating Bhishm:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Create New Bhishm</h2>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Bhishm Name */}
          <div>
            <label htmlFor="name" className="label">Bhishm Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiPackage className="text-gray-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                className="input pl-10"
                placeholder="Enter Bhishm name"
                {...formik.getFieldProps('name')}
              />
            </div>
            {formik.touched.name && formik.errors.name && (
              <div className="text-sm text-red-600 mt-1">{formik.errors.name}</div>
            )}
          </div>

          {/* Serial Number */}
          <div>
            <label htmlFor="serial_no" className="label">Serial Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiHash className="text-gray-400" />
              </div>
              <input
                id="serial_no"
                name="serial_no"
                type="text"
                className="input pl-10"
                placeholder="Enter serial number"
                {...formik.getFieldProps('serial_no')}
              />
            </div>
            {formik.touched.serial_no && formik.errors.serial_no && (
              <div className="text-sm text-red-600 mt-1">{formik.errors.serial_no}</div>
            )}
          </div>

          {/* Bhishm Type Dropdown */}
          <div>
            <label htmlFor="bhisham_id" className="label">Copy BHISHM</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiShield className="text-gray-400" />
              </div>
              <select
                id="bhisham_id"
                name="bhisham_id"
                className="input pl-10"
                {...formik.getFieldProps('bhisham_id')}
              >
                <option value="">Select a type</option>
                {bhishmType.map((item) => (
                  <option key={item.bhisham_id} value={item.bhisham_id}>
                    {item.serial_no}
                  </option>
                ))}
              </select>
            </div>
            {formik.touched.bhisham_id && formik.errors.bhisham_id && (
              <div className="text-sm text-red-600 mt-1">{formik.errors.bhisham_id}</div>
            )}
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
                  Creating Bhishm...
                </>
              ) : (
                'Create Bhishm'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBhisham;
