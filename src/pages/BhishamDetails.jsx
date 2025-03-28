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

  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermItems, setSearchTermItems] = useState('');
  const [filteredCubes, setFilteredCubes] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);


  useEffect(() => {
    const filtered = cubes.filter((cube) =>
      cube.cc_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCubes(filtered);
  }, [searchTerm, cubes]);

  useEffect(() => {
    const filtered = items.filter((item) =>
      item.sku_name.toLowerCase().includes(searchTermItems.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTermItems, items]);

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
    console.log("kitIdc", kitId)
    setSelectedKit(kitId);
    setSelectedKitName(kitName)

    // Fetch items for the selected kit
    setLoadingItems(true);
    try {
      const response = await getItemsByKit(id, activeMotherBox, selectedCube, kitName, bhisham.is_complete);
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
    console.log(item)

    try {
      // Get detailed item information
      // const response = await getItemDetails(item.id);
      // console.log(response)
      // if (response.data) {
      //   setSelectedItem(response.data);
      // }
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
        console.log(response)
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

  const getCubeStatus = (cube) => {
    if (cube.total_update_item === cube.total_item) {
      return {
        icon: <div className="w-4 h-4 bg-green-500 rounded-full" />,
        bgColor: 'bg-green-100',
      };
    } else if (cube.total_update_item === 0) {
      return {
        icon: <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'rgb(249 117 117)' }} />,
        bgColor: 'bg-red-100',
      };
    } else {
      return {
        icon: <div className="w-4 h-4 bg-yellow-500 rounded-full" />,
        bgColor: 'bg-yellow-100',
      };
    }
  };

  console.log("itemsitemsitems", selectedItem)

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
            className={`p-4 border rounded-lg flex items-center ${activeMotherBox === 1
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
            className={`p-4 border rounded-lg flex items-center ${activeMotherBox === 2
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
          <div className="bg-white rounded-lg shadow-md" style={{ height: '30rem', overflow: 'hidden' }}>
            <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center" style={{ padding: '1rem' }}>
              <h3 className="text-lg font-medium text-gray-700">Select Cube</h3>
              <input
                type="text"
                placeholder="Search Cubes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded-md"
                style={{ width: '13rem' }}
              />
            </div>

            {loadingCubes ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredCubes.length > 0 ? (
              <div className="p-6 overflow-y-auto" style={{
                height: 'calc(100% - 7rem)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.7rem'
              }}>
                {filteredCubes.map((cube) => {
                  const { icon, bgColor } = getCubeStatus(cube);

                  return (
                    <button
                      key={cube.cube_number}
                      onClick={() => handleCubeSelect(cube.cube_number)}

                      className={`w-full p-3 text-left rounded-md flex items-center justify-between ${selectedCube === cube.cube_number
                        ? 'bg-primary text-white'
                        : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                    >
                      <div className="flex items-center">
                        {cube.cc_name}
                      </div>
                      {icon}


                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No cubes available for this Mother Box</p>
            )}
          </div>

          {/* Kits dropdown - show only if cube is selected */}

          <div className="bg-white rounded-lg shadow-md" style={{ height: '30rem', overflow: 'hidden' }}>
            <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center" style={{ padding: '1.4rem' }}>
              <h3 className="text-lg font-medium text-gray-700">Select Kit</h3>

            </div>
            {selectedCube ? (
              loadingKits ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : kits.length > 0 ? (
                // <div className="space-y-2">
                <div className="p-6 overflow-y-auto" style={{
                  height: 'calc(100% - 7rem)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.7rem'
                }}>
                  {kits.map((kit, index) => (
                    <button
                      key={index}
                      onClick={() => handleKitSelect(index, kit.kit_slug)}
                      className={`w-full p-3 text-left rounded-md flex items-center ${selectedKit === index
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
          <div className="bg-white rounded-lg shadow-md" style={{ height: '30rem', overflow: 'hidden' }}>
            <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center" style={{ padding: '1rem' }}>
              <h3 className="text-lg font-medium text-gray-700">Items</h3>
              <input
                type="text"
                placeholder="Search Items..."
                value={searchTermItems}
                onChange={(e) => setSearchTermItems(e.target.value)}
                className="w-full p-2 border rounded-md"
                style={{ width: '13rem' }}
              />
            </div>
            {/* <h3 className="text-lg font-medium text-gray-700 mb-4">Items</h3> */}
            {selectedKit !== null && selectedKit !== undefined ? (loadingItems ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredItems.length > 0 ? (
              <ul className="p-6 overflow-y-auto divide-y divide-gray-200" style={{
                height: 'calc(100% - 7rem)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.7rem'
              }} >
                {filteredItems.map((item) => (
                  <li
                    key={item.id}
                    className=" hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                    onClick={() => handleItemClick(item)}
                    style={{ padding: '1rem' }}
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