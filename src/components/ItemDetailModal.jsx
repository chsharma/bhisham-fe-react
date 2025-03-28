import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';
import { FiX, FiEdit, FiInfo } from 'react-icons/fi';

const ItemDetailModal = ({ isOpen, onClose, item, onUpdate }) => {
  console.log("itemekskds", item)
  const [showUpdateOptions, setShowUpdateOptions] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const updateOptions = [
    { id: 1, name: 'Replace Component' },
    { id: 2, name: 'Upgrade Firmware' },
    { id: 3, name: 'Recalibrate' }
  ];

  const handleUpdateClick = () => {
    setShowUpdateOptions(true);
  };

  const handleSelectOption = async (option) => {
    setSelectedOption(option);
    setIsUpdating(true);
    
    try {
      // This would be your API call to update the item
      await onUpdate(item.id, option.id);
      toast.success(`Item updated successfully with action: ${option.name}`);
      setShowUpdateOptions(false);
      setIsUpdating(false);
      onClose();
    } catch (error) {
      toast.error('Failed to update item');
      console.error('Error updating item:', error);
      setIsUpdating(false);
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
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Item Details
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>

                {/* Item Details */}
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Item Name</p>
                      <p className="font-medium">{item?.sku_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Kit Name</p>
                      <p className="font-medium">{item?.kit_name || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Expiration</p>
                      <p className="font-medium">{item?.exp || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item?.status || 'Unknown'}
                      </span>
                    </div>
                  </div>
                  
                  {item?.description && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-500">Description</p>
                      <p className="text-sm mt-1">{item.description}</p>
                    </div>
                  )}
                </div>

                {/* Update Options */}
                {showUpdateOptions ? (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Select Update Action</h4>
                    <div className="space-y-2">
                      {updateOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleSelectOption(option)}
                          disabled={isUpdating}
                          className="w-full p-2 text-left rounded-md flex items-center hover:bg-gray-100"
                        >
                          <FiInfo className="mr-2 text-primary" />
                          {option.name}
                        </button>
                      ))}
                    </div>
                    
                    {isUpdating && (
                      <div className="flex justify-center items-center mt-4">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
                        <span className="ml-2 text-sm text-gray-600">Updating...</span>
                      </div>
                    )}
                    
                    <button
                      type="button"
                      className="mt-4 btn btn-secondary w-full"
                      onClick={() => setShowUpdateOptions(false)}
                      disabled={isUpdating}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      className="btn btn-primary flex items-center"
                      onClick={handleUpdateClick}
                    >
                      <FiEdit className="mr-2" />
                      Update Item
                    </button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ItemDetailModal;