// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { 
//   getAllBhisham,
//   getCubesByMotherBox,
//   getKitsByCube,
//   getItemsByKit
// } from '../services/api';
// import { FiArrowLeft, FiBox, FiPackage, FiGrid } from 'react-icons/fi';

// const BhishamDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
  
//   const [bhisham, setBhisham] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeMotherBox, setActiveMotherBox] = useState(null);
  
//   const [selectedCube, setSelectedCube] = useState(null);
//   const [selectedKit, setSelectedKit] = useState(null);
  
//   const [cubes, setCubes] = useState([]);
//   const [kits, setKits] = useState([]);
//   const [items, setItems] = useState([]);
  
//   const [loadingCubes, setLoadingCubes] = useState(false);
//   const [loadingKits, setLoadingKits] = useState(false);
//   const [loadingItems, setLoadingItems] = useState(false);

//   // Fetch bhisham details
//   useEffect(() => {
//     const fetchBhishamDetails = async () => {
//       setLoading(true);
//       try {
//         const response = await getAllBhisham();
//         const foundBhisham = response.data.find(b => b.id === parseInt(id));
        
//         if (foundBhisham) {
//           setBhisham(foundBhisham);
          
//           // If bhisham is incomplete, redirect back to view bhisham page
//           if (foundBhisham.status === 'incomplete') {
//             toast.warning('Cannot view details of incomplete Bhisham');
//             navigate('/view-bhisham');
//           }
//         } else {
//           toast.error('Bhisham not found');
//           navigate('/view-bhisham');
//         }
//       } catch (error) {
//         toast.error('Failed to fetch Bhisham details');
//         console.error('Error fetching Bhisham details:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchBhishamDetails();
//   }, [id, navigate]);

//   // Function to handle mother box selection
//   const handleMotherBoxSelect = async (motherBoxId) => {
//     setActiveMotherBox(motherBoxId);
//     setSelectedCube(null);
//     setSelectedKit(null);
//     setKits([]);
//     setItems([]);
    
//     // Fetch cubes for the selected mother box
//     setLoadingCubes(true);
//     try {
//       const response = await getCubesByMotherBox(id, motherBoxId);
//       setCubes(response.data);
//     } catch (error) {
//       toast.error('Failed to fetch cubes');
//       console.error('Error fetching cubes:', error);
//     } finally {
//       setLoadingCubes(false);
//     }
//   };

//   // Function to handle cube selection
//   const handleCubeSelect = async (cubeId) => {
//     setSelectedCube(cubeId);
//     setSelectedKit(null);
//     setItems([]);
    
//     // Fetch kits for the selected cube
//     setLoadingKits(true);
//     try {
//       const response = await getKitsByCube(id, activeMotherBox, cubeId);
//       setKits(response.data);
//     } catch (error) {
//       toast.error('Failed to fetch kits');
//       console.error('Error fetching kits:', error);
//     } finally {
//       setLoadingKits(false);
//     }
//   };

//   // Function to handle kit selection
//   const handleKitSelect = async (kitId) => {
//     setSelectedKit(kitId);
    
//     // Fetch items for the selected kit
//     setLoadingItems(true);
//     try {
//       const response = await getItemsByKit(id, activeMotherBox, selectedCube, kitId);
//       setItems(response.data);
//     } catch (error) {
//       toast.error('Failed to fetch items');
//       console.error('Error fetching items:', error);
//     } finally {
//       setLoadingItems(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   if (!bhisham) {
//     return (
//       <div className="bg-white rounded-lg shadow-md p-6 text-center">
//         <p className="text-gray-500">Bhisham not found</p>
//         <button 
//           onClick={() => navigate('/view-bhisham')}
//           className="mt-4 btn btn-primary"
//         >
//           Go Back to List
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {/* Header with back button */}
//       <div className="flex items-center mb-6">
//         <button 
//           onClick={() => navigate('/view-bhisham')}
//           className="mr-4 p-2 rounded-md hover:bg-gray-200"
//         >
//           <FiArrowLeft className="h-5 w-5" />
//         </button>
//         <div>
//           <h2 className="text-xl font-semibold text-gray-800">{bhisham.name}</h2>
//           <p className="text-sm text-gray-500">Serial: {bhisham.serial_no}</p>
//         </div>
//       </div>
      
//       {/* Bhisham info card */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//         <h3 className="text-lg font-medium text-gray-700 mb-4">Bhisham Information</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <p className="text-sm text-gray-500">Created By</p>
//             <p className="font-medium">{bhisham.created_by}</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-500">Status</p>
//             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//               {bhisham.status}
//             </span>
//           </div>
//           <div>
//             <p className="text-sm text-gray-500">Serial Number</p>
//             <p className="font-medium">{bhisham.serial_no}</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-500">Completed At</p>
//             <p className="font-medium">{bhisham.complete_time}</p>
//           </div>
//         </div>
//       </div>
      
//       {/* Mother boxes selection */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//         <h3 className="text-lg font-medium text-gray-700 mb-4">Select Mother Box</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <button
//             onClick={() => handleMotherBoxSelect(1)}
//             className={`p-4 border rounded-lg flex items-center ${
//               activeMotherBox === 1
//                 ? 'border-primary bg-blue-50'
//                 : 'border-gray-200 hover:border-primary hover:bg-blue-50'
//             }`}
//           >
//             <div className="p-3 rounded-full bg-blue-500 text-white">
//               <FiBox className="h-6 w-6" />
//             </div>
//             <div className="ml-4">
//               <h4 className="font-medium">Mother Box 1</h4>
//               <p className="text-sm text-gray-500">Primary container</p>
//             </div>
//           </button>
          
//           <button
//             onClick={() => handleMotherBoxSelect(2)}
//             className={`p-4 border rounded-lg flex items-center ${
//               activeMotherBox === 2
//                 ? 'border-primary bg-blue-50'
//                 : 'border-gray-200 hover:border-primary hover:bg-blue-50'
//             }`}
//           >
//             <div className="p-3 rounded-full bg-green-500 text-white">
//               <FiBox className="h-6 w-6" />
//             </div>
//             <div className="ml-4">
//               <h4 className="font-medium">Mother Box 2</h4>
//               <p className="text-sm text-gray-500">Secondary container</p>
//             </div>
//           </button>
//         </div>
//       </div>
      
//       {/* Selection dropdowns - conditional rendering */}
//       {activeMotherBox && (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* Cubes dropdown */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h3 className="text-lg font-medium text-gray-700 mb-4">Select Cube</h3>
//             {loadingCubes ? (
//               <div className="flex justify-center py-4">
//                 <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
//               </div>
//             ) : cubes.length > 0 ? (
//               <div className="space-y-2">
//                 {cubes.map((cube) => (
//                   <button
//                     key={cube.id}
//                     onClick={() => handleCubeSelect(cube.id)}
//                     className={`w-full p-3 text-left rounded-md flex items-center ${
//                       selectedCube === cube.id
//                         ? 'bg-primary text-white'
//                         : 'bg-gray-50 hover:bg-gray-100'
//                     }`}
//                   >
//                     <FiPackage className="mr-2" />
//                     {cube.name}
//                   </button>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-500 text-center py-4">
//                 No cubes available for this Mother Box
//               </p>
//             )}
//           </div>
          
//           {/* Kits dropdown - show only if cube is selected */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h3 className="text-lg font-medium text-gray-700 mb-4">Select Kit</h3>
//             {selectedCube ? (
//               loadingKits ? (
//                 <div className="flex justify-center py-4">
//                   <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
//                 </div>
//               ) : kits.length > 0 ? (
//                 <div className="space-y-2">
//                   {kits.map((kit) => (
//                     <button
//                       key={kit.id}
//                       onClick={() => handleKitSelect(kit.id)}
//                       className={`w-full p-3 text-left rounded-md flex items-center ${
//                         selectedKit === kit.id
//                           ? 'bg-primary text-white'
//                           : 'bg-gray-50 hover:bg-gray-100'
//                       }`}
//                     >
//                       <FiGrid className="mr-2" />
//                       {kit.name}
//                     </button>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-500 text-center py-4">
//                   No kits available for this cube
//                 </p>
//               )
//             ) : (
//               <p className="text-gray-500 text-center py-4">
//                 Select a cube first
//               </p>
//             )}
//           </div>
          
//           {/* Items list - show only if kit is selected */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h3 className="text-lg font-medium text-gray-700 mb-4">Items</h3>
//             {selectedKit ? (
//               loadingItems ? (
//                 <div className="flex justify-center py-4">
//                   <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
//                 </div>
//               ) : items.length > 0 ? (
//                 <ul className="divide-y divide-gray-200">
//                   {items.map((item) => (
//                     <li key={item.id} className="py-3">
//                       <div className="flex items-center">
//                         <div className="min-w-0 flex-1">
//                           <p className="text-sm font-medium text-gray-900 truncate">
//                             {item.name}
//                           </p>
//                         </div>
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-gray-500 text-center py-4">
//                   No items available for this kit
//                 </p>
//               )
//             ) : (
//               <p className="text-gray-500 text-center py-4">
//                 Select a kit first
//               </p>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BhishamDetails;



import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  getAllBhisham,
  getCubesByMotherBox,
  getKitsByCube,
  getItemsByKit,
  getItemDetails,
  updateItem
} from '../services/api';
// import { FiArrowLeft, FiBox, FiPackage, FiGrid, FiInfo } from 'react-icons/fi';
import { FiArrowLeft, FiBox, FiPackage, FiGrid, FiInfo, FiCheckCircle, FiAlertCircle, FiCircle, FiXCircle } from 'react-icons/fi';
import ItemDetailModal from '../components/ItemDetailModal';

const BhishamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [bhisham, setBhisham] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMotherBox, setActiveMotherBox] = useState(null);
  
  const [selectedCube, setSelectedCube] = useState(null);
  const [selectedKit, setSelectedKit] = useState(null);
  const [selectedKitName, setSelectedKitName] = useState('')
  
  const [cubes, setCubes] = useState([]);
  const [kits, setKits] = useState([]);
  const [items, setItems] = useState([]);
  
  const [loadingCubes, setLoadingCubes] = useState(false);
  const [loadingKits, setLoadingKits] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loadingItemDetails, setLoadingItemDetails] = useState(false);

  // Fetch bhisham details
  useEffect(() => {
    const fetchBhishamDetails = async () => {
      setLoading(true);
      try {
        const response = await getAllBhisham();
        console.log('inside the response array', response)
        const foundBhisham = response.find(b => b.id === parseInt(id));
        
        if (foundBhisham) {
          setBhisham(foundBhisham);
          
          // If bhisham is incomplete, redirect back to view bhisham page
          if (foundBhisham.status === 'incomplete') {
            toast.warning('Cannot view details of incomplete Bhisham');
            navigate('/view-bhisham');
          }
        } else {
          toast.error('Bhisham not found');
          navigate('/view-bhisham');
        }
      } catch (error) {
        toast.error('Failed to fetch Bhisham details');
        console.error('Error fetching Bhisham details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBhishamDetails();
  }, [id, navigate]);

  // Function to handle mother box selection
  const handleMotherBoxSelect = async (motherBoxId) => {
    setActiveMotherBox(motherBoxId);
    setSelectedCube(null);
    setSelectedKit(null);
    setKits([]);
    setItems([]);
    
    // Fetch cubes for the selected mother box
    setLoadingCubes(true);
    try {
      const response = await getCubesByMotherBox(id, motherBoxId);
      console.log('cubes', response?.data)
      setCubes(response.data);
    } catch (error) {
      toast.error('Failed to fetch cubes');
      console.error('Error fetching cubes:', error);
    } finally {
      setLoadingCubes(false);
    }
  };

  // Function to handle cube selection
  const handleCubeSelect = async (cubeId) => {
    setSelectedCube(cubeId);
    setSelectedKit(null);
    setItems([]);
    
    // Fetch kits for the selected cube
    setLoadingKits(true);
    try {
      const response = await getKitsByCube(id, activeMotherBox, cubeId);
      setKits(response.data);
    } catch (error) {
      toast.error('Failed to fetch kits');
      console.error('Error fetching kits:', error);
    } finally {
      setLoadingKits(false);
    }
  };

  // Function to handle kit selection
  const handleKitSelect = async (kitId, kitName) => {
    setSelectedKit(kitId);
    setSelectedKitName(kitName)
    
    // Fetch items for the selected kit
    setLoadingItems(true);
    try {
      const response = await getItemsByKit(id, activeMotherBox, selectedCube, kitName,);
      console.log('here is the response', response)
      setItems(response.data);
    } catch (error) {
      toast.error('Failed to fetch items');
      console.error('Error fetching items:', error);
    } finally {
      setLoadingItems(false);
    }
  };
  
  // Function to handle item click and show modal
  const handleItemClick = async (item) => {
    setSelectedItem(item);
    setLoadingItemDetails(true);
    
    try {
      // Get detailed item information
      const response = await getItemDetails(item.id);
      if (response.data) {
        setSelectedItem(response.data);
      }
    } catch (error) {
      console.error('Error fetching item details:', error);
    } finally {
      setIsModalOpen(true);
      setLoadingItemDetails(false);
    }
  };
  
  // Function to handle item update
  const handleItemUpdate = async (itemId, actionId) => {
    try {
      await updateItem(itemId, actionId);
      // Refresh items list after update
      if (selectedKit) {
        const response = await getItemsByKit(id, activeMotherBox, selectedCube, selectedKit, bhisham.is_complete);
        setItems(response.data);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!bhisham) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">Bhisham not found</p>
        <button 
          onClick={() => navigate('/view-bhisham')}
          className="mt-4 btn btn-primary"
        >
          Go Back to List
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/view-bhisham')}
          className="mr-4 p-2 rounded-md hover:bg-gray-200"
        >
          <FiArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{bhisham.name}</h2>
          <p className="text-sm text-gray-500">Serial: {bhisham.serial_no}</p>
        </div>
      </div>
      
      {/* Bhisham info card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Bhisham Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Created By</p>
            <p className="font-medium">{bhisham.created_by}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {bhisham.is_complete ? 'Complete' : 'Incomplete'} 
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Serial Number</p>
            <p className="font-medium">{bhisham.serial_no}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Completed At</p>
            <p className="font-medium">{bhisham.complete_time}</p>
          </div>
        </div>
      </div>
      
      {/* Mother boxes selection */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Select Mother Box</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => handleMotherBoxSelect(1)}
            className={`p-4 border rounded-lg flex items-center ${
              activeMotherBox === 1
                ? 'border-primary bg-blue-50'
                : 'border-gray-200 hover:border-primary hover:bg-blue-50'
            }`}
          >
            <div className="p-3 rounded-full bg-blue-500 text-white">
              <FiBox className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h4 className="font-medium">Mother Box 1</h4>
              <p className="text-sm text-gray-500">Primary container</p>
            </div>
          </button>
          
          <button
            onClick={() => handleMotherBoxSelect(2)}
            className={`p-4 border rounded-lg flex items-center ${
              activeMotherBox === 2
                ? 'border-primary bg-blue-50'
                : 'border-gray-200 hover:border-primary hover:bg-blue-50'
            }`}
          >
            <div className="p-3 rounded-full bg-green-500 text-white">
              <FiBox className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h4 className="font-medium">Mother Box 2</h4>
              <p className="text-sm text-gray-500">Secondary container</p>
            </div>
          </button>
        </div>
      </div>
      
      {/* Selection dropdowns - conditional rendering */}
      {activeMotherBox && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cubes dropdown */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Select Cube</h3>
            {loadingCubes ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : cubes.length > 0 ? (
              <div className="space-y-2">
                {cubes.map((cube) => (
                  <button
                    key={cube.cube_number}
                    onClick={() => handleCubeSelect(cube.cube_number)}
                    className={`w-full p-3 text-left rounded-md flex items-center ${
                      selectedCube === cube.cube_number
                        ? 'bg-primary text-white'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    {/* <FiPackage className="mr-2" /> */}
                    {cube.cc_name}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No cubes available for this Mother Box
              </p>
            )}
          </div>

          {/* <div className="bg-white rounded-lg shadow-md p-6">
  <h3 className="text-lg font-medium text-gray-700 mb-4">Select Cube</h3>
  {loadingCubes ? (
    <div className="flex justify-center py-4">
      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
    </div>
  ) : cubes.length > 0 ? (
    <div className="space-y-2">
      {cubes.map((cube) => {
        let cubeStatusIcon, cubeStatusColor;

        if (cube.total_item === cube.total_update_item) {
          cubeStatusIcon = <FiCheckCircle className="text-green-500 h-5 w-5" />;
          cubeStatusColor = 'bg-green-50';
        } else if (cube.total_update_item === 0) {
          cubeStatusIcon = <FiCircle className="text-gray-400 h-5 w-5" />;
          cubeStatusColor = 'bg-gray-50';
        } else {
          cubeStatusIcon = <FiAlertCircle className="text-yellow-500 h-5 w-5" />;
          cubeStatusColor = 'bg-yellow-50';
        }

        return (
          <button
            key={cube.cube_number}
            onClick={() => handleCubeSelect(cube.cube_number)}
            className={`w-full p-3 text-left rounded-md flex items-center justify-between ${selectedCube === cube.cube_number ? 'bg-primary text-white' : cubeStatusColor}`}
          >
            <div className="flex items-center">
              <FiPackage className="mr-2" />
              {cube.cc_name}
            </div>
            {cubeStatusIcon}
          </button>
        );
      })}
    </div>
  ) : (
    <p className="text-gray-500 text-center py-4">
      No cubes available for this Mother Box
    </p>
  )}
</div> */}
          
          {/* Kits dropdown - show only if cube is selected */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Select Kit</h3>
            {selectedCube ? (
              loadingKits ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : kits.length > 0 ? (
                <div className="space-y-2">
                  {kits.map((kit, index) => (
                    <button
                      key={index}
                      onClick={() => handleKitSelect(index, kit.kitname)}
                      className={`w-full p-3 text-left rounded-md flex items-center ${
                        selectedKit === index
                          ? 'bg-primary text-white'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      {/* <FiGrid className="mr-2" /> */}
                      {kit.kitname}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No kits available for this cube
                </p>
              )
            ) : (
              <p className="text-gray-500 text-center py-4">
                Select a cube first
              </p>
            )}
          </div>
          
          {/* Items list - show only if kit is selected */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Items</h3>
            {selectedKit ? (
              loadingItems ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : items.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <li 
                      key={item.id} 
                      className="py-3 px-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                      onClick={() => handleItemClick(item)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.sku_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.kit_name} • Exp: {item.exp || 'N/A'}
                          </p>
                        </div>
                        {/* <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.status || 'Unknown'}
                        </span> */}
                        <FiInfo className="ml-2 text-primary" />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No items available for this kit
                </p>
              )
            ) : (
              <p className="text-gray-500 text-center py-4">
                Select a kit first
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Item Detail Modal */}
      <ItemDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedItem}
        onUpdate={handleItemUpdate}
      />
    </div>
  );
};

export default BhishamDetails;