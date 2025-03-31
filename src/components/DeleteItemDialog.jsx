import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';
import { FiX, FiEdit } from 'react-icons/fi';
import {
  deleteItems,
  getUpdateDataType,
  updateItems
} from '../services/api';

const ItemDetailModal = ({ isOpen, onClose, item, bhisham, completed }) => {
  console.log(item)
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    batch_no_sr_no: item?.batch_no_sr_no || '',
    mfd: item?.mfd || '',
    exp: item?.exp || '',
    update_typeid: '',
  });

  const [updateOptions, setupdateOptions] = useState([]);

  useEffect(() => {
    if (item) {
      setFormData({
        batch_no_sr_no: item?.batch_no_sr_no || '',
        mfd: item?.mfd || '',
        exp: item?.exp || '',
        update_typeid: '',
      });
    }
  }, [item]);


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
    console.log(name, value)
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  console.log(formData)

  const handleSubmit = async () => {
    try {

      let data = {};
      console.log(item)

      data.id = item;
      data.delete_type_id = formData.update_typeid ? parseInt(formData.update_typeid, 10) : 0;
      await deleteItems(data, completed);
      toast.success('Item updated successfully!');
      setFormData({});
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

                {item ? <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">Update Action</label>
                    <select
                      name="update_typeid"
                      value={formData.update_typeid}
                      onChange={handleChange}
                      className="w-full border rounded p-2"
                    >
                      <option value="">Select an action</option>
                      {updateOptions.map((option) => (
                        <option key={option.update_typeid} value={option.update_typeid}>{option.name}</option>
                      ))}
                    </select>
                  </div>
                </div> :
                  <p>Loading item details...</p>}

                <div className="flex justify-end space-x-4 mt-4">
                  <>
                    <button className="btn btn-secondary"onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
                  </>
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
