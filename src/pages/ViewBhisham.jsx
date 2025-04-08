


import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllBhisham, completeBhisham, getBhishamRawData, getBhishamFullData } from '../services/api';
import { FiSearch, FiRefreshCw, FiCheck, FiEye, FiChevronLeft, FiChevronRight, FiDownload } from 'react-icons/fi';

const ViewBhisham = () => {
  const [bhishamList, setBhishamList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingIds, setProcessingIds] = useState([]);
  const [downloadingIds, setDownloadingIds] = useState({});

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchBhishamList = async () => {
    setLoading(true);
    try {
      const response = await getAllBhisham();
      console.log('response from bhisham', response);

      // Check if response has data property and it's an array
      if (response && response.data && Array.isArray(response.data)) {
        setBhishamList(response.data);
      } else if (Array.isArray(response)) {
        // If response is directly an array
        setBhishamList(response);
      } else {
        console.error('Unexpected API response format:', response);
        setBhishamList([]);
        toast.error('Received invalid data format from server');
      }
    } catch (error) {
      toast.error('Failed to fetch Bhishm data');
      console.error('Error fetching Bhishm:', error);
      setBhishamList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBhishamList();
  }, []);

  useEffect(() => {
    // Reset to first page when search term changes
    setCurrentPage(1);
  }, [searchTerm]);

  const handleComplete = async (id) => {
    setProcessingIds((prev) => [...prev, id]);

    try {
      const response = await completeBhisham(id);
      fetchBhishamList();

      toast.success('Bhishm marked as complete');
    } catch (error) {
      toast.error('Failed to complete Bhishm');
    } finally {
      setProcessingIds((prev) => prev.filter((item) => item !== id));
    }
  };

  // Safely filter the bhisham list
  const filteredBhisham = bhishamList.filter((bhisham) =>
    (bhisham.bhisham_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (bhisham.serial_no?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (bhisham.created_by?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBhisham.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages
  const totalPages = Math.ceil(filteredBhisham.length / itemsPerPage);

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Handle downloading raw data CSV
  const handleDownloadRaw = async (id) => {
    // Update downloading state
    setDownloadingIds(prev => ({
      ...prev,
      [id]: { ...prev[id], raw: true }
    }));

    try {
      const response = await getBhishamRawData(id);

      if (response && Array.isArray(response.data)) {
        // Convert data to CSV and download
        const fileName = "bhisham_raw_" + id + formatDate(new Date());
        downloadCSV(response.data, fileName);
        toast.success('Raw data downloaded successfully');
      } else {
        toast.error('Failed to get download data');
      }
    } catch (error) {
      console.error('Error downloading raw data:', error);
      toast.error('Failed to download raw data');
    } finally {
      // Reset downloading state
      setDownloadingIds(prev => ({
        ...prev,
        [id]: { ...prev[id], raw: false }
      }));
    }
  };

  // Handle downloading full data CSV
  const handleDownloadFull = async (id) => {
    // Update downloading state
    setDownloadingIds(prev => ({
      ...prev,
      [id]: { ...prev[id], full: true }
    }));

    try {
      const response = await getBhishamFullData(id);

      if (response && Array.isArray(response.data)) {
        // Convert data to CSV and download
        const fileName = "bhisham_full_" + id + formatDate(new Date());
        downloadCSV(response.data, fileName);
        toast.success('Full data downloaded successfully');
      } else {
        toast.error('Failed to get download data');
      }
    } catch (error) {
      console.error('Error downloading full data:', error);
      toast.error('Failed to download full data');
    } finally {
      // Reset downloading state
      setDownloadingIds(prev => ({
        ...prev,
        [id]: { ...prev[id], full: false }
      }));
    }
  };

  // Helper function to convert data to CSV and trigger download
const downloadCSV = (data, filename) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    toast.error('No data to download');
    return;
  }

  // Get headers from the first object
  const headers = Object.keys(data[0]);

  // Create CSV rows
  const csvRows = [];

  // Add header row
  csvRows.push(headers.join(','));

  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      if (value === null || value === undefined) return '';

      const strValue = String(value);
      // Wrap in double quotes if value contains special characters
      return /[,"\n\r]/.test(strValue) ? `"${strValue}"` : strValue;
    });
    csvRows.push(values.join(','));
  }

  // Create a CSV string
  const csvString = csvRows.join('\n');

  // Create blob and download link
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';

  // Append to the body, trigger download, and clean up
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


  // Helper function to format date for filename
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="input pl-10"
            placeholder="Search Bhishm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Link to="/create-bhisham" className="btn btn-primary flex-grow md:flex-grow-0">
            Create New Bhishm
          </Link>
          <button
            onClick={fetchBhishamList}
            className="btn btn-secondary p-2"
            title="Refresh"
          >
            <FiRefreshCw />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg shadow-sm">
              <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <tr>
                  <th className="py-4 px-6">                    Name
                  </th>
                  <th className="py-4 px-6">                    Serial No
                  </th>
                  <th className="py-4 px-6">                    Created By
                  </th>
                  <th className="py-4 px-6">                    Status
                  </th>
                  <th className="py-4 px-6">                    Mark as complete
                  </th>
                  <th className="py-4 px-6">                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((bhisham, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-4 px-6">                      
                          {/* <div className="text-sm font-medium text-gray-900"> */}
                        {bhisham?.bhisham_name ? bhisham.bhisham_name : '-'}
                      {/* </div> */}
                      </td>
                      <td className="py-4 px-6">              
                                  {/* <div className="text-sm text-gray-500"> */}
                          {bhisham?.serial_no}
                        {/* </div> */}
                      </td>
                      <td className="py-4 px-6">                      
                          {/* <div className="text-sm text-gray-500"> */}
                          {bhisham?.created_by}
                        {/* </div> */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bhisham.is_complete === 1
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {bhisham.is_complete ? 'Complete' : 'Incomplete'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          {!bhisham.is_complete ? (
                            <button
                              onClick={() => handleComplete(bhisham.id)}
                              disabled={processingIds.includes(bhisham.id)}
                              className="p-1 rounded-md text-green-600 hover:bg-green-100"
                              title="Mark as Complete"
                            >
                              {processingIds.includes(bhisham.id) ? (
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                <FiCheck className="h-5 w-5" />
                              )}
                            </button>
                          ) : (
                            <div>Already completed</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <Link
                            to={`/bhisham/${bhisham.id}`}
                            className="p-1 rounded-md text-blue-600 hover:bg-blue-100"
                            title="View Details"
                          >
                            <FiEye className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDownloadRaw(bhisham.id)}
                            disabled={downloadingIds[bhisham.id]?.raw}
                            className="p-1 rounded-md text-green-600 hover:bg-green-100"
                            title="Download Raw Data"
                          >
                            {downloadingIds[bhisham.id]?.raw ? (
                              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <div className="flex items-center">
                                <FiDownload className="h-5 w-5" />
                                <span className="ml-1 text-xs">Raw</span>
                              </div>
                            )}
                          </button>
                          <button
                            onClick={() => handleDownloadFull(bhisham.id)}
                            disabled={downloadingIds[bhisham.id]?.full}
                            className="p-1 rounded-md text-indigo-600 hover:bg-indigo-100"
                            title="Download Full Data"
                          >
                            {downloadingIds[bhisham.id]?.full ? (
                              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <div className="flex items-center">
                                <FiDownload className="h-5 w-5" />
                                <span className="ml-1 text-xs">Full</span>
                              </div>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      {searchTerm
                        ? 'No matching Bhishm found'
                        : 'No Bhishm records available'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {filteredBhisham.length > 0 && (
            <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-center border-t border-gray-200">
              <div className="flex items-center mb-4 sm:mb-0">
                <span className="text-sm text-gray-700">
                  Showing
                  <span className="font-medium mx-1">
                    {filteredBhisham.length > 0 ? indexOfFirstItem + 1 : 0}
                  </span>
                  to
                  <span className="font-medium mx-1">
                    {Math.min(indexOfLastItem, filteredBhisham.length)}
                  </span>
                  of
                  <span className="font-medium mx-1">
                    {filteredBhisham.length}
                  </span>
                  entries
                </span>

                <div className="ml-4">
                  <select
                    className="form-select rounded-md border-gray-300 shadow-sm text-sm"
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <FiChevronLeft className="h-5 w-5" />
                </button>

                {/* Page Numbers */}
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
                    // Show limited page numbers with ellipsis for large page counts
                    if (
                      totalPages <= 7 ||
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-3 py-1 rounded-md ${currentPage === pageNumber
                            ? 'bg-primary text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      (pageNumber === 2 && currentPage > 3) ||
                      (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                    ) {
                      return <span key={pageNumber} className="px-1">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`p-2 rounded-md ${currentPage === totalPages || totalPages === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <FiChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewBhisham;