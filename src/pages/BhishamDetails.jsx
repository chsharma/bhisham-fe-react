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
import { FiArrowLeft, FiBox, FiPackage, FiGrid, FiInfo, FiCheckCircle, FiAlertCircle, FiCircle, FiXCircle, FiPlusCircle } from 'react-icons/fi';
import ItemDetailModal from '../components/ItemDetailModal';
import AddItemDialog from '../components/AddItemModal';
import MarkAsUpdateItemDialog from '../components/MarkAsUpdateItemDialog';
import DeleteItemDialog from '../components/DeleteItemDialog';

import { FiMoreHorizontal } from 'react-icons/fi';
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
  const [iAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [markAsUpdateModalOpen, setMarkAsUpdateModalOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [loadingItemDetails, setLoadingItemDetails] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermItems, setSearchTermItems] = useState('');
  const [filteredCubes, setFilteredCubes] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };


  useEffect(() => {
    const filtered = cubes.filter((cube) =>
      cube.cc_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cube.cc_no.toLowerCase().includes(searchTerm.toLowerCase())
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
          toast.warning('Cannot view details of incomplete Bhishm');
          navigate('/view-bhisham');
        }
      } else {
        toast.error('Bhishm not found');
        navigate('/view-bhisham');
      }
    } catch (error) {
      toast.error('Failed to fetch Bhishm details');
      console.error('Error fetching Bhishm details:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {

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

    try {
    } catch (error) {
      console.error('Error fetching item details:', error);
    } finally {
      setIsModalOpen(true);
      setLoadingItemDetails(false);
    }
  };

  const handleAddItem = async () => {
    setIsAddModalOpen(true);
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
        <p className="text-gray-500">Bhishm not found</p>
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
    const commonStyles = "w-4 h-4 min-w-[1rem] min-h-[1rem] rounded-full";

    if (cube.total_update_item === cube.total_item) {
      return {
        icon: <div className={`${commonStyles} bg-green-500`} />,
        bgColor: 'bg-green-100',
      };
    } else if (cube.total_update_item === 0) {
      return {
        icon: <div className={`${commonStyles}`} style={{ backgroundColor: 'rgb(249 117 117)' }} />,
        bgColor: 'bg-red-100',
      };
    } else {
      return {
        icon: <div className={`${commonStyles} bg-yellow-500`} />,
        bgColor: 'bg-yellow-100',
      };
    }
  };

  const getKitStatus = (kit) => {
    const commonStyles = "w-4 h-4 min-w-[1rem] min-h-[1rem] rounded-full";

    if (kit.total_update_item === kit.total_item) {
      return {
        icon: <div className={`${commonStyles} bg-green-500`} />,
        bgColor: 'bg-green-100',
      };
    } else if (kit.total_update_item === 0) {
      return {
        icon: <div className={`${commonStyles}`} style={{ backgroundColor: 'rgb(249 117 117)' }} />,
        bgColor: 'bg-red-100',
      };
    } else {
      return {
        icon: <div className={`${commonStyles} bg-yellow-500`} />,
        bgColor: 'bg-yellow-100',
      };
    }
  };

  const getItemStatus = (item) => {
    const commonStyles = "w-4 h-4 min-w-[1rem] min-h-[1rem] rounded-full";

    if (item.is_update) {
      return {
        icon: <div className={`${commonStyles} bg-green-500`} />,
        bgColor: 'bg-green-100',
      };
    } else {
      return {
        icon: <div className={`${commonStyles}`} style={{ backgroundColor: 'rgb(249 117 117)' }} />,
        bgColor: 'bg-red-100',
      };
    }
  };

  const handleDelete = (item) => {
    console.log('Deleting item:', item);
    setSelectedItem(item);
    setLoadingItemDetails(true);

    try {
    } catch (error) {
      console.error('Error fetching item details:', error);
    } finally {
      setIsDeleteModalOpen(true);
      setLoadingItemDetails(false);
    }
  };

  const handleMarkAsUpdate = (item) => {
    console.log('Marking item as update:', item);
    setSelectedItem(item);
    setLoadingItemDetails(true);

    try {
    } catch (error) {
      console.error('Error fetching item details:', error);
    } finally {
      setMarkAsUpdateModalOpen(true);
      setLoadingItemDetails(false);
    }
    // Implement your mark as update logic here
  };

  const handleDeleteItemClose = () => {
    setIsDeleteModalOpen(false);
    setSelectedItem("");
    setDropdownOpen("");
    fetchBhishamDetails()


  }

  const handleUpdateModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem("");
    setDropdownOpen("");
    fetchBhishamDetails()


  }

  const handleMarkAsUpdateModalClose = () => {
    setMarkAsUpdateModalOpen(false);
    setSelectedItem("");
    setDropdownOpen("");
    fetchBhishamDetails()
  }

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
    setDropdownOpen("");
    fetchBhishamDetails()
  }





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
          <p className="text-3xl text-black">Serial: {bhisham.serial_no}</p>
        </div>
      </div>

      {/* Bhishm info card */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-medium text-gray-700">Bhishm Information</h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bhisham.is_complete ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
            {bhisham.is_complete ? 'Complete' : 'Incomplete'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2 text-sm">
          <div className="flex flex-col">
            <span className="text-gray-500">Created By</span>
            <span className="truncate font-bold text-xl">{bhisham.created_by}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500">Serial No.</span>
            <span className="truncate font-bold text-xl">{bhisham.serial_no}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500">Completed At</span>
            <span className="truncate font-bold text-xl">{bhisham.complete_time || '—'}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500">HH Synch Count</span>
            <span className="truncate font-bold text-xl">{bhisham.hh_synch_count || '—'}</span>
          </div>
          <div>
            <p className="text-sm text-gray-500">HH_SYNCH_COUNT</p>
            <p className="font-medium">{bhisham.hh_synch_count || 'Empty'}</p>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500">Bhishm Close</span>
            <span className="truncate font-bold text-xl">{bhisham.is_bhisham_close || '—'}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500">Close By</span>
            <span className="truncate font-bold text-xl">{bhisham.close_by || '—'}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500">Close Time</span>
            <span className="truncate font-bold text-xl">{bhisham.close_time || '—'}</span>
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
                        {cube.cc_no ? `${cube.cc_no} - ${cube.cc_name}` : cube.cc_name}
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
                  {kits.map((kit, index) => {
                    const { icon, bgColor } = getKitStatus(kit);

                    return (
                      <button
                        key={index}
                        onClick={() => handleKitSelect(index, kit.kit_slug)}

                        className={`w-full p-3 text-left rounded-md flex items-center justify-between ${selectedKit === index
                          ? 'bg-primary text-white'
                          : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                      >



                        <div className="flex  flex-col">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {kit.kitname}
                          </p>
                          <p className="text-xs text-gray-500">
                            <b>Total Kits: </b>{kit.no_of_kit} • <b>Exp:</b> {kit.kit_expiry || 'N/A'}
                          </p>
                        </div>
                        {icon}


                      </button>
                    )
                  })}
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
              <div className="flex justify-between items-center gap-5">
                {bhisham && !bhisham.is_bhisham_close && <FiPlusCircle className="h-5 w-5" onClick={() => handleAddItem()} />}
                <input
                  type="text"
                  placeholder="Search Items..."
                  value={searchTermItems}
                  onChange={(e) => setSearchTermItems(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  style={{ width: '13rem' }}
                />
              </div>
            </div>

            {selectedKit !== null && selectedKit !== undefined ? (
              loadingItems ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : filteredItems.length > 0 ? (
                <ul
                  className="p-6 overflow-y-auto divide-y divide-gray-200"
                  style={{
                    height: 'calc(100% - 7rem)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.7rem',
                  }}
                >
                  {filteredItems.map((item) => {
                    const { icon, bgColor } = getItemStatus(item);
                    return (
                      <li
                        key={item.id}
                        className="hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                        // onClick={() => handleItemClick(item)}
                        style={{ padding: '1rem' }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">{item.sku_name}</p>
                            <p className="text-xs text-gray-500">
                              <b>Batch No: </b>{item.batch_no_sr_no} • <b>Exp:</b> {item.exp || 'N/A'}
                            </p>
                          </div>
                          {icon}

                          {bhisham && !bhisham.is_bhisham_close && <div className="relative">
                            <FiMoreHorizontal
                              className="ml-2 text-gray-600 cursor-pointer"
                              onClick={() => toggleDropdown(item.id)}
                            />
                            {dropdownOpen === item.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-md">
                                <ul className="text-sm text-gray-700">
                                  <li
                                    className="hover:bg-gray-100 cursor-pointer px-4 py-2"
                                    onClick={() => handleItemClick(item)}
                                  >
                                    Update
                                  </li>
                                  <li
                                    className="hover:bg-gray-100 cursor-pointer px-4 py-2"
                                    onClick={() => handleMarkAsUpdate(item)}
                                  >
                                    Mark as Update
                                  </li>
                                  <li
                                    className="hover:bg-gray-100 cursor-pointer px-4 py-2"
                                    onClick={() => handleDelete(item.id)}
                                  >
                                    Delete
                                  </li>
                                </ul>
                              </div>
                            )}
                          </div>}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-4">No items available for this kit</p>
              )
            ) : (
              <p className="text-gray-500 text-center py-4">Select a kit first</p>
            )}
          </div>
        </div>
      )
      }

      {/* Item Detail Modal */}
      <ItemDetailModal
        isOpen={isModalOpen}
        onClose={handleUpdateModalClose}
        item={selectedItem}
        bhisham={bhisham}
        completed={bhisham.is_complete}
      />

      <AddItemDialog
        isOpen={iAddModalOpen}
        onClose={handleAddModalClose}
        // onUpdate={handleItemUpdate}
        selectedKitName={selectedKitName}
        selectedCube={selectedCube}
        kits={kits}
        cube={cubes}
        completed={bhisham.is_complete}
      />

      <DeleteItemDialog
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteItemClose}
        item={selectedItem}
        bhisham={bhisham}
        completed={bhisham.is_complete}
      />

      <MarkAsUpdateItemDialog
        isOpen={markAsUpdateModalOpen}
        onClose={handleMarkAsUpdateModalClose}
        item={selectedItem}
        bhisham={bhisham}
        completed={bhisham.is_complete}
      />
    </div >
  );
};

export default BhishamDetails;