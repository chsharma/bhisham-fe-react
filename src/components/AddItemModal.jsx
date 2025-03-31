import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';
import { FiX } from 'react-icons/fi';
import {
    getUpdateDataType,
    createItem
} from '../services/api';

const ItemDetailModal = ({ isOpen, onClose, selectedKitName, selectedCube, kits, cube, completed }) => {
    const [formData, setFormData] = useState({
        batch_no_sr_no: 'N/A',
        sku_name: 'N/A',
        sku_code: 'N/A',
        // sku_slug: '',
        mfd: 'N/A',
        exp: 'N/A',
        manufactured_by: 'N/A',
        sku_qty: 0,
        is_update: 'N/A',
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
            console.log(kits, cube)
            const selKit = kits.find((k) => k.kit_slug == selectedKitName);
            const selCube = cube.find((c) => c.cube_number == selectedCube);

            formData.mc_no = selCube.mc_no;
            formData.id = selCube.mc_no;
            formData.kit_code = selKit.kitcode;
            formData.cube_number = selCube.cube_number;
            formData.kit_name = selKit.kitname;
            formData.kit_slug = selKit.kit_slug;
            formData.kit_no = selKit.no_of_kit;
            formData.sku_slug = formData.sku_name;
            formData.is_update = formData.is_update ? parseInt(formData.is_update, 10) : 0;
            formData.sku_qty = formData.sku_qty ? parseInt(formData.sku_qty, 10) : 0;

              await createItem(formData, completed);
            toast.success('Item created successfully!');
            setFormData({});
            onClose();
        } catch (error) {
            toast.error('Failed to create item');
            console.error(error);
        }
    };

    const handleClose = () => {
        setFormData({});
        onClose();
    }

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
                                    <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">Create Item</Dialog.Title>
                                    <button className="text-gray-400 hover:text-gray-500" onClick={onClose}>
                                        <FiX className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-500">Batch Serial No</label>
                                        <input type="text" name="batch_no_sr_no" value={formData.batch_no_sr_no} onChange={handleChange} className="w-full border rounded p-2" />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500">SKU Name</label>
                                        <input type="text" name="sku_name" value={formData.sku_name} onChange={handleChange} className="w-full border rounded p-2" />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500">SKU Code</label>
                                        <input type="text" name="sku_code" value={formData.sku_code} onChange={handleChange} className="w-full border rounded p-2" />
                                    </div>
                                    {/* <div>
                    <label className="text-sm text-gray-500">SKU Slug</label>
                    <input type="text" name="sku_slug" value={formData.sku_slug} onChange={handleChange} className="w-full border rounded p-2" />
                  </div> */}
                                    <div>
                                        <label className="text-sm text-gray-500">Mfg Date</label>
                                        <input type="date" name="mfd" value={formData.mfd} onChange={handleChange} className="w-full border rounded p-2" />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500">Expiration Date</label>
                                        <input type="date" name="exp" value={formData.exp} onChange={handleChange} className="w-full border rounded p-2" />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500">Manufactured By</label>
                                        <input type="text" name="manufactured_by" value={formData.manufactured_by} onChange={handleChange} className="w-full border rounded p-2" />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500">SKU Quantity</label>
                                        <input type="number" name="sku_qty" value={formData.sku_qty} onChange={handleChange} className="w-full border rounded p-2" />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500">Update Action</label>
                                        <select
                                            name="is_update"
                                            value={formData.is_update}
                                            onChange={handleChange}
                                            className="w-full border rounded p-2"
                                        >
                                            <option value="">Select an action</option>
                                            {updateOptions.map((option) => (
                                                <option key={option.update_typeid} value={option.update_typeid}>{option.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-4 mt-4">
                                    <button className="btn btn-secondary" onClick={handleClose}>Cancel</button>
                                    <button className="btn btn-primary" onClick={handleSubmit}>Create Item</button>
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
