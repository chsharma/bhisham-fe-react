// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { getAllBhisham, completeBhisham } from '../services/api';
// import { FiSearch, FiRefreshCw, FiCheck, FiEye } from 'react-icons/fi';

// const ViewBhisham = () => {
//   console.log('test bhisham')
//   const [bhishamList, setBhishamList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [processingIds, setProcessingIds] = useState([]);
//   const fetchBhishamList = async () => {
//     console.log(' inside fetch bhisham')
//     setLoading(true);
//     try {
//       const response = await getAllBhisham();
//       // console.log('response from bhisham', response)
//       if (response && response.data && Array.isArray(response.data)) {
//         setBhishamList(response.data);
//       } else if (Array.isArray(response)) {
//         // If response is directly an array
//         setBhishamList(response);
//       } else {
//         console.error('Unexpected API response format:', response);
//         setBhishamList([]);
//         toast.error('Received invalid data format from server');
//       }
//     } catch (error) {
//       toast.error('Failed to fetch Bhisham data');
//       console.error('Error fetching Bhisham:', error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     console.log('fetch test bhisham')
//     fetchBhishamList();
//   }, []);

//   const handleComplete = async (id) => {
//     // Add the ID to processing state
//     console.log('inside handle complete')
//     setProcessingIds((prev) => [...prev, id]);
    
//     try {
//       const response = await completeBhisham(id);
      
//       // Update the bhisham list with the updated bhisham
//       setBhishamList((prevList) =>
//         prevList.map((item) =>
//           item.id === id
//             ? {
//                 ...item,
//                 status: response.data.status,
//                 complete_time: response.data.complete_time,
//               }
//             : item
//         )
//       );
      
//       toast.success('Bhisham marked as complete');
//     } catch (error) {
//       toast.error('Failed to complete Bhisham');
//       console.error('Error completing Bhisham:', error);
//     } finally {
//       // Remove the ID from processing state
//       setProcessingIds((prev) => prev.filter((item) => item !== id));
//     }
//   };
//   console.log('hii')

//   const filteredBhisham = bhishamList.filter((bhisham) =>
//     bhisham.bhisham_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     bhisham.serial_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     bhisham.created_by.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   console.log('hii view bhisham', filteredBhisham)

//   return (
//     <div>
//       {/* <h1>test</h1> */}
//       <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
//         <div className="relative w-full md:w-64">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <FiSearch className="text-gray-400" />
//           </div>
//           <input
//             type="text"
//             className="input pl-10"
//             placeholder="Search Bhisham..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
        
//         <div className="flex gap-2 w-full md:w-auto">
//           <Link to="/create-bhisham" className="btn btn-primary flex-grow md:flex-grow-0">
//             Create New Bhisham
//           </Link>
//           <button
//             onClick={fetchBhishamList}
//             className="btn btn-secondary p-2"
//             title="Refresh"
//           >
//             <FiRefreshCw />
//           </button>
//         </div>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
//         </div>
//       ) : (
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Serial No
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Created By
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Complete Time
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredBhisham.length > 0 ? (
//                   filteredBhisham.map((bhisham) => (
//                     <tr key={bhisham?.id}>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">
//                           {bhisham?.bhisham_name ? bhisham.bhisham_name : '-'}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-500">
//                           {bhisham?.serial_no}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-500">
//                           {bhisham?.created_by}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                           bhisham.is_complete === 1
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-yellow-100 text-yellow-800'
//                         }`}>
//                           {bhisham.is_complete ? 'Complete' : 'Incomplete'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-500">
//                           {bhisham.complete_time || '-'}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex space-x-2">
//                           {bhisham.is_complete ? (
//                             <button
//                               onClick={() => handleComplete(bhisham.id)}
//                               disabled={processingIds.includes(bhisham.id)}
//                               className="p-1 rounded-md text-green-600 hover:bg-green-100"
//                               title="Mark as Complete"
//                             >
//                               {processingIds.includes(bhisham.id) ? (
//                                 <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                 </svg>
//                               ) : (
//                                 <FiCheck className="h-5 w-5" />
//                               )}
//                             </button>
//                           ) : (
//                             <Link
//                               to={`/bhisham/${bhisham.id}`}
//                               className="p-1 rounded-md text-blue-600 hover:bg-blue-100"
//                               title="View Details"
//                             >
//                               <FiEye className="h-5 w-5" />
//                             </Link>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
//                       {searchTerm
//                         ? 'No matching Bhisham found'
//                         : 'No Bhisham records available'}
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   // return (
//   //   <div>
//   //     <h1>Bhisham List</h1>
//   //     {loading ? (
//   //       <p>Loading...</p>
//   //     ) : (
//   //       <div>
//   //         {bhishamList && bhishamList.length > 0 ? (
//   //           <ul>
//   //             {bhishamList.map((bhisham) => (
//   //               <li key={bhisham.id}>
//   //                 <strong>Name:</strong> {bhisham.bhisham_name} <br />
//   //                 <strong>Serial No:</strong> {bhisham.serial_no} <br />
//   //                 <strong>Completed By:</strong> {bhisham.complete_by} <br />
//   //                 <strong>Complete Time:</strong> {new Date(bhisham.complete_time).toLocaleString()} <br />
//   //                 <strong>Created By:</strong> {bhisham.created_by} <br />
//   //                 <strong>Created At:</strong> {new Date(bhisham.created_at).toLocaleString()} <br />
//   //                 <strong>Status:</strong> {bhisham.is_complete ? 'Complete' : 'Incomplete'}
//   //               </li>
//   //             ))}
//   //           </ul>
//   //         ) : (
//   //           <p>No data available</p>
//   //         )}
//   //       </div>
//   //     )}
//   //   </div>
//   // );

// };

// export default ViewBhisham;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllBhisham, completeBhisham } from '../services/api';
import { FiSearch, FiRefreshCw, FiCheck, FiEye } from 'react-icons/fi';

const ViewBhisham = () => {
  const [bhishamList, setBhishamList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingIds, setProcessingIds] = useState([]);

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
      toast.error('Failed to fetch Bhisham data');
      console.error('Error fetching Bhisham:', error);
      setBhishamList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBhishamList();
  }, []);

  const handleComplete = async (id) => {
    setProcessingIds((prev) => [...prev, id]);
    
    try {
      const response = await completeBhisham(id);
      const updatedBhisham = response.data || response;
      
      setBhishamList((prevList) =>
        prevList.map((item) =>
          item.id === id
            ? {
                ...item,
                is_complete: true,
                status: updatedBhisham.status,
                complete_time: updatedBhisham.complete_time,
              }
            : item
        )
      );
      
      toast.success('Bhishm marked as complete');
    } catch (error) {
      toast.error('Failed to complete Bhisham');
      console.error('Error completing Bhisham:', error);
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

    return (
    <div>
      {/* <h1>test</h1> */}
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
          <Link to="/create-bhishm" className="btn btn-primary flex-grow md:flex-grow-0">
            Create New Bhisham
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
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Serial No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mark as complete
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBhisham.length > 0 ? (
                  filteredBhisham.map((bhisham) => (
                    <tr key={bhisham?.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {bhisham?.bhisham_name ? bhisham.bhisham_name : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {bhisham?.serial_no}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {bhisham?.created_by}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          bhisham.is_complete === 1
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {bhisham.is_complete ? 'Complete' : 'Incomplete'}
                        </span>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {bhisham.complete_time || '-'}
                        </div>
                      </td> */}
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
                          {/* {!bhisham.is_complete ? (
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
                            <Link
                              to={`/bhisham/${bhisham.id}`}
                              className="p-1 rounded-md text-blue-600 hover:bg-blue-100"
                              title="View Details"
                            >
                              <FiEye className="h-5 w-5" />
                            </Link>
                          )} */}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      {searchTerm
                        ? 'No matching Bhisham found'
                        : 'No Bhisham records available'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  // return (
  //   <div className="container mx-auto p-4">
  //     <div className="flex justify-between items-center mb-6">
  //       <h1 className="text-2xl font-bold">Bhisham List</h1>
  //       <div className="flex space-x-2">
  //         <div className="relative">
  //           <input
  //             type="text"
  //             placeholder="Search Bhisham..."
  //             className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
  //             value={searchTerm}
  //             onChange={(e) => setSearchTerm(e.target.value)}
  //           />
  //           <FiSearch className="absolute left-3 top-3 text-gray-400" />
  //         </div>
  //         <button
  //           onClick={fetchBhishamList}
  //           className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
  //         >
  //           <FiRefreshCw />
  //         </button>
  //       </div>
  //     </div>

  //     {loading ? (
  //       <div className="flex justify-center items-center h-64">
  //         <p className="text-lg">Loading...</p>
  //       </div>
  //     ) : (
  //       <div>
  //         {filteredBhisham.length > 0 ? (
  //           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  //             {filteredBhisham.map((bhisham) => (
  //               <div key={bhisham.id} className="border rounded-lg p-4 shadow-sm">
  //                 <h2 className="text-xl font-semibold mb-2">{bhisham.bhisham_name}</h2>
  //                 <div className="space-y-1">
  //                   <p><strong>Serial No:</strong> {bhisham.serial_no || 'N/A'}</p>
  //                   <p><strong>Created By:</strong> {bhisham.created_by || 'N/A'}</p>
  //                   <p><strong>Created At:</strong> {bhisham.created_at ? new Date(bhisham.created_at).toLocaleString() : 'N/A'}</p>
  //                   <p><strong>Status:</strong> {bhisham.is_complete ? 'Complete' : 'Incomplete'}</p>
                    
  //                   {bhisham.is_complete && (
  //                     <>
  //                       <p><strong>Completed By:</strong> {bhisham.complete_by || 'N/A'}</p>
  //                       <p><strong>Complete Time:</strong> {bhisham.complete_time ? new Date(bhisham.complete_time).toLocaleString() : 'N/A'}</p>
  //                     </>
  //                   )}
  //                 </div>
                  
  //                 {!bhisham.is_complete && (
  //                   <button
  //                     onClick={() => handleComplete(bhisham.id)}
  //                     disabled={processingIds.includes(bhisham.id)}
  //                     className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 flex items-center"
  //                   >
  //                     {processingIds.includes(bhisham.id) ? 'Processing...' : (
  //                       <>
  //                         <FiCheck className="mr-2" />
  //                         Mark Complete
  //                       </>
  //                     )}
  //                   </button>
  //                 )}
  //               </div>
  //             ))}
  //           </div>
  //         ) : (
  //           <div className="text-center py-10">
  //             <p className="text-lg text-gray-600">No bhisham records found</p>
  //           </div>
  //         )}
  //       </div>
  //     )}
  //   </div>
  // );


};

export default ViewBhisham;