import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { createBhisham } from '../services/api';
import { FiPackage, FiHash } from 'react-icons/fi';

const CreateBhisham = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Form validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required('Bhisham name is required'),
    serial_no: Yup.string().required('Serial number is required'),
  });

  // Form handling with Formik
  const formik = useFormik({
    initialValues: {
      name: '',
      serial_no: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        let data = {
          "bhisham_name" : values.name,
          "serial_no" : values.serial_no
        }
        await createBhisham(data);
        toast.success('Bhisham created successfully');
        // Navigate to view bhisham page after successful creation
        navigate('/view-bhisham');
      } catch (error) {
        toast.error('Failed to create Bhisham');
        console.error('Error creating Bhisham:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Create New Bhisham</h2>
        
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Bhisham Name Field */}
          <div>
            <label htmlFor="name" className="label">
              Bhisham Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiPackage className="text-gray-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                className="input pl-10"
                placeholder="Enter Bhisham name"
                {...formik.getFieldProps('name')}
              />
            </div>
            {formik.touched.name && formik.errors.name ? (
              <div className="text-sm text-red-600 mt-1">{formik.errors.name}</div>
            ) : null}
          </div>
          
          {/* Serial Number Field */}
          <div>
            <label htmlFor="serial_no" className="label">
              Serial Number
            </label>
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
            {formik.touched.serial_no && formik.errors.serial_no ? (
              <div className="text-sm text-red-600 mt-1">{formik.errors.serial_no}</div>
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
                  Creating Bhisham...
                </>
              ) : (
                'Create Bhisham'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBhisham;