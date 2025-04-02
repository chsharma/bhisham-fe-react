import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';
import { FiX, FiEdit } from 'react-icons/fi';
import {
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

      data.bhisham_id = bhisham.id;
      data.mc_no = item.mc_no;
      data.cube_number = item.cube_number;
      data.kit_code =item.kit_code;
      data.kit_slug =item.kit_slug;
      data.sku_code = item.sku_code;
      data.sku_slug = item.sku_slug;
      data.batch_code = formData.batch_no_sr_no;
      data.mfd = formData.mfd;
      data.exp = formData.exp;
      data.id = item.id;
      data.update_typeid = formData.update_typeid ? parseInt(formData.update_typeid, 10) : 0;
      await updateItems( data, completed);
      toast.success('Item updated successfully!');
      setFormData({});
      setIsEditing(false)
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
                    <label className="text-sm text-gray-500">Batch Serial No</label>
                    <input type="text" name="batch_no_sr_no" value={formData.batch_no_sr_no} onChange={handleChange} disabled={!isEditing} className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Mfg Date</label>
                    <input type="date" name="mfd" value={formData.mfd} onChange={handleChange} disabled={!isEditing} className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Expiration Date</label>
                    <input type="date" name="exp" value={formData.exp} onChange={handleChange} disabled={!isEditing} className="w-full border rounded p-2" />
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
                        <option key={option.update_typeid} value={option.update_typeid}>{option.name}</option>
                      ))}
                    </select>
                  </div>
                </div> :
                  <p>Loading item details...</p>}

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
