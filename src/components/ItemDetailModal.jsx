import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';
import { FiX, FiEdit } from 'react-icons/fi';
import {
  getUpdateDataType,
  updateItems
} from '../services/api';

const ItemDetailModal = ({ isOpen, onClose, item, bhisham, completed }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    batch_no_sr_no: item?.batch_no_sr_no || '',
    mfd_month: '',
    mfd_year: '',
    exp_month: '',
    exp_year: '',
    update_typeid: '',
    manufactured_by: item?.manufactured_by || '',
    sku_qty: item?.sku_qty || '',
  });

  const [updateOptions, setupdateOptions] = useState([]);

  // Generate months and years for dropdowns with NA option
  const months = [
    { value: '', label: 'NA' },
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const currentYear = new Date().getFullYear();
  const years = [
    { value: '', label: 'NA' },
    ...Array.from({ length: 20 }, (_, i) => ({ 
      value: (currentYear - 10 + i).toString(), 
      label: (currentYear - 10 + i).toString() 
    }))
  ];

  useEffect(() => {
    if (item) {
      // Parse existing dates if they exist
      const mfdDate = item?.mfd ? new Date(item.mfd) : null;
      const expDate = item?.exp ? new Date(item.exp) : null;
      
      setFormData({
        batch_no_sr_no: item?.batch_no_sr_no || '',
        mfd_month: mfdDate ? (mfdDate.getMonth() + 1).toString().padStart(2, '0') : '',
        mfd_year: mfdDate ? mfdDate.getFullYear().toString() : '',
        exp_month: expDate ? (expDate.getMonth() + 1).toString().padStart(2, '0') : '',
        exp_year: expDate ? expDate.getFullYear().toString() : '',
        update_typeid: '',
        manufactured_by: item?.manufactured_by || '',
        sku_qty: item?.sku_qty || '',
      });
    }
  }, [item]);

  useEffect(() => {
    const fetchBhishamDetails = async () => {
      try {
        const response = await getUpdateDataType();
        setupdateOptions(response);
      } catch (error) {
        console.error('Error fetching Options details:', error);
      }
    };
    fetchBhishamDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Function to get last day of month
  const getLastDayOfMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

const handleSubmit = async () => {
  try {
    // Convert month/year to full date (last day of month for expiration)
    let mfd = '';
    if (formData.mfd_month && formData.mfd_year) {
      if (formData.mfd_month === 'NA') {
        mfd = 'NA';
      } else {
        mfd = `${formData.mfd_year}-${formData.mfd_month}-01`;
      }
    }
    
    let exp = '';
    if (formData.exp_month && formData.exp_year) {
      if (formData.exp_month === 'NA') {
        exp = 'NA';
      } else {
        const lastDay = getLastDayOfMonth(parseInt(formData.exp_year), parseInt(formData.exp_month));
        exp = `${formData.exp_year}-${formData.exp_month}-${lastDay}`;
      }
    }

    const data = {
      bhisham_id: bhisham.id,
      mc_no: item.mc_no,
      cube_number: item.cube_number,
      kit_code: item.kit_code,
      kit_slug: item.kit_slug,
      sku_code: item.sku_code,
      sku_slug: item.sku_slug,
      batch_code: formData.batch_no_sr_no,
      mfd: mfd || null, // Will be 'NA' if set, null if empty
      exp: exp || null, // Will be 'NA' if set, null if empty
      id: item.id,
      update_typeid: formData.update_typeid ? parseInt(formData.update_typeid, 10) : 0,
      manufactured_by: formData.manufactured_by,
      sku_qty: parseInt(formData.sku_qty, 10) || 0,
    };

    await updateItems(data, completed);
    toast.success('Item updated successfully!');
    setFormData({});
    setIsEditing(false);
    onClose();
  } catch (error) {
    toast.error('Failed to update item');
    console.error(error);
  }
};

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">Item Details</Dialog.Title>
                  <button className="text-gray-400 hover:text-gray-500" onClick={onClose}>
                    <FiX className="h-5 w-5" />
                  </button>
                </div>

                {item ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500">Batch Serial No</label>
                      <input
                        type="text"
                        name="batch_no_sr_no"
                        value={formData.batch_no_sr_no}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full border rounded p-2"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500">Mfg Month</label>
                        <select
                          name="mfd_month"
                          value={formData.mfd_month}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full border rounded p-2"
                        >
                          {months.map(month => (
                            <option key={month.value} value={month.value}>{month.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Mfg Year</label>
                        <select
                          name="mfd_year"
                          value={formData.mfd_year}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full border rounded p-2"
                        >
                          {years.map(year => (
                            <option key={year.value} value={year.value}>{year.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500">Exp Month</label>
                        <select
                          name="exp_month"
                          value={formData.exp_month}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full border rounded p-2"
                        >
                          {months.map(month => (
                            <option key={month.value} value={month.value}>{month.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Exp Year</label>
                        <select
                          name="exp_year"
                          value={formData.exp_year}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full border rounded p-2"
                        >
                          {years.map(year => (
                            <option key={year.value} value={year.value}>{year.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-500">Manufactured By</label>
                      <input
                        type="text"
                        name="manufactured_by"
                        value={formData.manufactured_by}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full border rounded p-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">SKU Quantity</label>
                      <input
                        type="number"
                        name="sku_qty"
                        value={formData.sku_qty}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full border rounded p-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Update Action</label>
                      <select
                        name="update_typeid"
                        value={formData.update_typeid}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full border rounded p-2"
                      >
                        <option value="">Select an action</option>
                        {updateOptions.map((option) => (
                          <option key={option.update_typeid} value={option.update_typeid}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <p>Loading item details...</p>
                )}

                <div className="flex justify-end space-x-4 mt-4">
                  {isEditing ? (
                    <>
                      <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                        Cancel
                      </button>
                      <button className="btn btn-primary" onClick={handleSubmit}>
                        Submit
                      </button>
                    </>
                  ) : (
                    <button className="btn btn-primary flex items-center" onClick={() => setIsEditing(true)}>
                      <FiEdit className="mr-2" />
                      Edit Item
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ItemDetailModal;