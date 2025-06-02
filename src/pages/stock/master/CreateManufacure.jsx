import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  getAllManufacturers, 
  createManufacturer, 
  updateManufacturer, 
  deleteManufacturer 
} from '../../../services/api';
import { 
  FiSearch, 
  FiRefreshCw, 
  FiEdit, 
  FiTrash2, 
  FiEye, 
  FiChevronLeft, 
  FiChevronRight,
  FiPlus,
  FiSave,
  FiX
} from 'react-icons/fi';

const ManufacturerPage = () => {
  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingIds, setProcessingIds] = useState([]);
  
  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentManufacturer, setCurrentManufacturer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact_number: '',
    email: ''
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Fetch all manufacturers
  const fetchManufacturers = async () => {
    setLoading(true);
    try {
      const response = await getAllManufacturers();
      if (response && response.data) {
        setManufacturers(response.data);
      } else {
        setManufacturers([]);
        toast.error('Failed to fetch manufacturers');
      }
    } catch (error) {
      toast.error('Error fetching manufacturers');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManufacturers();
  }, []);

  // Handle search and pagination
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredManufacturers = manufacturers.filter(manufacturer =>
    manufacturer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manufacturer.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manufacturer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredManufacturers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredManufacturers.length / itemsPerPage);

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      contact_number: '',
      email: ''
    });
    setCurrentManufacturer(null);
  };

  const handleFormOpen = (manufacturer = null) => {
    if (manufacturer) {
      setCurrentManufacturer(manufacturer);
      setFormData({
        name: manufacturer.name,
        address: manufacturer.address,
        contact_number: manufacturer.contact_number,
        email: manufacturer.email
      });
    } else {
      resetForm();
    }
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    resetForm();
  };

  // CRUD Operations
  const handleCreate = async () => {
    if (!formData.name || !formData.address) {
      toast.error('Name and Address are required');
      return;
    }

    setProcessingIds(prev => [...prev, 'create']);
    try {
      await createManufacturer(formData);
      toast.success('Manufacturer created successfully');
      fetchManufacturers();
      handleFormClose();
    } catch (error) {
      toast.error('Failed to create manufacturer');
      console.error('Error:', error);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== 'create'));
    }
  };

  const handleUpdate = async () => {
    if (!currentManufacturer) return;
    if (!formData.name || !formData.address) {
      toast.error('Name and Address are required');
      return;
    }

    setProcessingIds(prev => [...prev, currentManufacturer.id]);
    try {
      await updateManufacturer(currentManufacturer.id, formData);
      toast.success('Manufacturer updated successfully');
      fetchManufacturers();
      handleFormClose();
    } catch (error) {
      toast.error('Failed to update manufacturer');
      console.error('Error:', error);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== currentManufacturer.id));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this manufacturer?')) return;

    setProcessingIds(prev => [...prev, id]);
    try {
      await deleteManufacturer(id);
      toast.success('Manufacturer deleted successfully');
      fetchManufacturers();
    } catch (error) {
      toast.error('Failed to delete manufacturer');
      console.error('Error:', error);
    } finally {
      setProcessingIds(prev => prev.filter(item => item !== id));
    }
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="input pl-10 w-full"
            placeholder="Search manufacturers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => handleFormOpen()}
            className="btn btn-primary flex items-center gap-2"
          >
            <FiPlus /> Add Manufacturer
          </button>
          <button
            onClick={fetchManufacturers}
            className="btn btn-secondary p-2"
            title="Refresh"
          >
            <FiRefreshCw />
          </button>
        </div>
      </div>

      {/* Create/Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {currentManufacturer ? 'Edit Manufacturer' : 'Add New Manufacturer'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input w-full"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address*</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="input w-full"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input
                    type="text"
                    name="contact_number"
                    value={formData.contact_number}
                    onChange={handleInputChange}
                    className="input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input w-full"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
               <div className="mt-6 flex justify-end space-x-3">
  <button
    onClick={handleFormClose}
    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400"
  >
    <FiX className="mr-2" />
    Cancel
  </button>

  <button
    onClick={currentManufacturer ? handleUpdate : handleCreate}
    disabled={processingIds.includes(currentManufacturer?.id || 'create')}
    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white transition
      ${processingIds.includes(currentManufacturer?.id || 'create')
        ? 'bg-blue-300 cursor-not-allowed'
        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500'}`}
  >
    {processingIds.includes(currentManufacturer?.id || 'create') ? (
      <span className="flex items-center">
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Processing...
      </span>
    ) : (
      <span className="flex items-center">
        <FiSave className="mr-2" />
        {currentManufacturer ? 'Update' : 'Save'}
      </span>
    )}
  </button>
</div>

              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.length > 0 ? (
                  currentItems.map((manufacturer) => (
                    <tr key={manufacturer.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{manufacturer.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{manufacturer.address}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{manufacturer.contact_number || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{manufacturer.email || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleFormOpen(manufacturer)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit"
                          >
                            <FiEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(manufacturer.id)}
                            disabled={processingIds.includes(manufacturer.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            {processingIds.includes(manufacturer.id) ? (
                              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <FiTrash2 />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      {searchTerm ? 'No matching manufacturers found' : 'No manufacturers available'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        {/* Pagination */}
          {filteredManufacturers.length > 0 ? (
            <>
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded flex items-center ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    <FiChevronLeft className="mr-1" /> Previous
                  </button>
                </div>

                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <div>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded flex items-center ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    Next <FiChevronRight className="ml-1" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center py-10">No users found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ManufacturerPage;