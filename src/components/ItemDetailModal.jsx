import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';
import { FiX, FiEdit } from 'react-icons/fi';
import {
  getUpdateDataType
} from '../services/api';

const ItemDetailModal = ({ isOpen, onClose, item, onUpdate }) => {
  console.log(item)
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    sku_name: item?.sku_name || '',
    kit_name: item?.kit_name || '',
    exp: item?.exp || '',
    update_typeid: '',
  });

  const [updateOptions, setupdateOptions] = useState([]);


  useEffect(() => {
    const fetchBhishamDetails = async () => {
      try {
        const response = await getUpdateDataType();
        console.log('inside the response array', response)
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

  const handleSubmit = async () => {
    try {
      await onUpdate(item.id, formData);
      toast.success('Item updated successfully!');
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

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">Item Name</label>
                    <input type="text" name="sku_name" value={formData.sku_name} onChange={handleChange} disabled={!isEditing} className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Kit Name</label>
                    <input type="text" name="kit_name" value={formData.kit_name} onChange={handleChange} disabled={!isEditing} className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Expiration Date</label>
                    <input type="date" name="exp" value={formData.exp} onChange={handleChange} disabled={!isEditing} className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Update Action</label>
                    <select name="updateAction" value={formData.update_typeid} onChange={handleChange} disabled={!isEditing} className="w-full border rounded p-2">
                      <option value="">Select an action</option>
                      {updateOptions.map((option) => (
                        <option key={option.update_typeid} value={option.update_typeid}>{option.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-4">
                  {isEditing ? (
                    <>
                      <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                      <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
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
