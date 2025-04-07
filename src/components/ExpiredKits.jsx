import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';
import { FiX } from 'react-icons/fi';
import {
  getExpiredKits,
  getKitsExpiringIn15Days,
  getKitsExpiringIn1Month
} from '../services/api';

const ExpiredKitsModal = ({ isOpen, onClose, typeid, bishamid }) => {
  const [expiryKits, setExpiryKits] = useState([]);
  const [loadingKits, setLoadingKits] = useState(false);

  const getExpiryKits = async () => {
    setLoadingKits(true);
    try {
      let response;

      switch (typeid) {
        case 1:
          response = await getKitsExpiringIn1Month(bishamid);
          break;
        case 2:
          response = await getKitsExpiringIn15Days(bishamid);
          break;
        default:
          response = await getExpiredKits(bishamid);
          break;
      }

      if (response?.data) {
        setExpiryKits(response.data);
      } else {
        toast.warn('No kits data found');
      }

    } catch (error) {
      toast.error('Failed to fetch kits');
      console.error('Error fetching kits:', error);
    } finally {
      setLoadingKits(false);
    }
  };

  const isExpired = (dateStr) => {
    if (!dateStr || dateStr === 'N/A') return false;
    const [day, month, year] = dateStr.split('/');
    const date = new Date(`${year}-${month}-${day}`);
    return date < new Date();
  };

  useEffect(() => {
    if (isOpen && typeid !== undefined) {
      getExpiryKits();
    }
  }, [isOpen, typeid]);

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
              <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
                    {typeid === 1
                      ? 'Kits Expiring in 1 Month'
                      : typeid === 2
                      ? 'Kits Expiring in 15 Days'
                      : 'Expired Kits'}
                  </Dialog.Title>
                  <button className="text-gray-400 hover:text-gray-500" onClick={onClose}>
                    <FiX className="h-5 w-5" />
                  </button>
                </div>

                {loadingKits ? (
                  <div className="text-center text-gray-500">Loading kits...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {expiryKits.map((kit, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg border transition text-sm ${
                          isExpired(kit.kit_expiry_date)
                            ? 'bg-red-100 border-red-300'
                            : 'bg-white'
                        }`}
                      >
                        <h3 className="text-base font-semibold mb-1">{kit.kitname}</h3>
                        <p><b>Kit No:</b> {kit.kit_no}</p>
                        <p><b>Kit EPC:</b> {kit.kit_epc}</p>
                        <p><b>Expiry:</b> {kit.kit_expiry_date}</p>
                        <p><b>Serial No:</b> {kit.serial_no}</p>
                        <p><b>BHISHM Name:</b> {kit.bhisham_name}</p>
                        <p><b>Control Set:</b> {kit.cc_name}</p>
                        <p><b>MC No:</b> {kit.mc_no}</p>
                      </div>
                    ))}
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

export default ExpiredKitsModal;
