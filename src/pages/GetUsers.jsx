import React, { useState, useEffect, useMemo } from 'react';
import { FiUser, FiCheckCircle, FiXCircle, FiEdit, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';
import { activeDeactiveUser, getUserList, updateUser } from '../services/api';
import { BsFillPassFill } from 'react-icons/bs';

const roles = ['Administrator', 'Manager', 'User'];

const GetUsers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [allUsers, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);

  // Calculate pagination values
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const totalPages = Math.ceil(allUsers.length / usersPerPage);
  
  // Calculate displayed users with useMemo to prevent unnecessary recalculations
  const displayedUsers = useMemo(() => {
    return allUsers.slice(indexOfFirstUser, indexOfLastUser);
  }, [allUsers, indexOfFirstUser, indexOfLastUser]);

  const fetchUserList = async () => {
    setLoading(true);
    try {
      const response = await getUserList();
      
      // Check if response has data property and it's an array
      if (response && response.data && Array.isArray(response.data)) {
        setUserList(response.data);
      } else if (Array.isArray(response)) {
        // If response is directly an array
        setUserList(response);
      } else {
        console.error('Unexpected API response format:', response);
        setUserList([]);
        toast.error('Received invalid data format from server');
      }
    } catch (error) {
      toast.error('Failed to fetch user data');
      console.error('Error fetching users:', error);
      setUserList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  const changePage = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleUsersPerPageChange = (e) => {
    setUsersPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Memoize pagination buttons to avoid recalculating on every render
  const renderPaginationButtons = useMemo(() => {
    const buttons = [];
    const maxButtons = 5; // Maximum number of buttons to show
    
    // Only render pagination if we have users and more than 1 page
    if (totalPages <= 1) {
      return buttons;
    }
    
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    // Add first page button if not included in the range
    if (startPage > 1) {
      buttons.push(
        <button 
          key="first" 
          onClick={() => changePage(1)}
          className="px-3 py-1 mx-1 rounded border hover:bg-gray-100"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(<span key="ellipsis1" className="px-2">...</span>);
      }
    }

    // Add page buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => changePage(i)}
          className={`px-3 py-1 mx-1 rounded border ${
            currentPage === i ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }

    // Add last page button if not included in the range
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<span key="ellipsis2" className="px-2">...</span>);
      }
      buttons.push(
        <button
          key="last"
          onClick={() => changePage(totalPages)}
          className="px-3 py-1 mx-1 rounded border hover:bg-gray-100"
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  }, [currentPage, totalPages]);

  const openModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      login_id: user.login_id,
      password: '',
      role_name: user.role_name,
    });
    setIsModalOpen(true);
  };

  const openPasswordModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      login_id: user.login_id,
      password: '',
      role_name: user.role_name,
    });
    setIsPasswordModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);
  const closePasswordModal = () => setIsPasswordModalOpen(false);

  const openConfirmModal = (user) => {
    setSelectedUser(user);
    setIsConfirmModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const closeConfirmModal = () => setIsConfirmModalOpen(false);

  const handleSubmit = async () => {
    try {
      if (!selectedUser) return;
      
      const updatedUser = {
        ...selectedUser,
        name: formData.name,
        password: formData.password,
        login_id: formData.login_id,
        role_name: formData.role_name
      };

      const response = await updateUser(updatedUser);
      
      // Update the user in the local state
      const updatedUsers = allUsers.map(user => {
        if (user.user_id === selectedUser.user_id) {
          return { ...user, ...updatedUser };
        }
        return user;
      });
      
      setUserList(updatedUsers);
      
      toast.success('User updated successfully!');
      setSelectedUser(null);
      closeModal();
      closePasswordModal();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user.');
    }
  };

  const handleStatusUpdate = async () => {
    try {
      if (!selectedUser) return;
      
      const newActiveStatus = !selectedUser.active;
      let apiData = { "user_id": selectedUser.user_id, active: newActiveStatus };

      const response = await activeDeactiveUser(apiData);
      
      // Update the user in the local state
      const updatedUsers = allUsers.map(user => {
        if (user.user_id === selectedUser.user_id) {
          return { ...user, active: newActiveStatus };
        }
        return user;
      });
      
      setUserList(updatedUsers);
      
      toast.success(`User ${newActiveStatus ? 'activated' : 'deactivated'} successfully!`);
      closeConfirmModal();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status.');
    }
  };

  return (
    <div className="bg-gray-50 p-8">
      <div className="mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <FiUser className="mr-2 text-primary" /> User List
        </h1>

        {loading ? (
          <p className="text-center py-10">Loading users...</p>
        ) : allUsers.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <span className="mr-2">Show</span>
                <select 
                  value={usersPerPage} 
                  onChange={handleUsersPerPageChange}
                  className="border rounded px-2 py-1"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="ml-2">entries</span>
              </div>
              <div>
                {allUsers.length > 0 ? 
                  `${indexOfFirstUser + 1}-${Math.min(indexOfLastUser, allUsers.length)} of ${allUsers.length} users` : 
                  "No users found"}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border rounded-lg shadow-sm">
                <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  <tr>
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Login ID</th>
                    <th className="py-4 px-6">Role</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Created At</th>
                    <th className="py-4 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedUsers.length > 0 ? (
                    displayedUsers.map((user, index) => (
                      <tr key={user.user_id || index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="py-4 px-6">{user.name}</td>
                        <td className="py-4 px-6">{user.login_id}</td>
                        <td className="py-4 px-6">{user.role_name}</td>
                        <td className="py-4 px-6">
                          <span
                            className={`cursor-pointer flex items-center ${user.active ? 'text-green-600' : 'text-red-600'}`}
                            onClick={() => openConfirmModal(user)}
                          >
                            {user.active ? <FiCheckCircle className="mr-1" /> : <FiXCircle className="mr-1" />} 
                            {user.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-4 px-6">{user.created_at ? new Date(user.created_at).toLocaleString() : 'N/A'}</td>
                        <td className="py-4 px-6">
                          <button onClick={() => openModal(user)} className="text-blue-500 mr-5">
                            <FiEdit className="inline mr-1" /> Edit
                          </button>
                          <button onClick={() => openPasswordModal(user)} className="text-blue-500">
                            <BsFillPassFill className="inline mr-1" /> Password
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-4 px-6 text-center text-gray-500">No users to display</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls - Only show if we have more than one page */}
            {totalPages > 1 && (
              <div className="mt-4 flex justify-between items-center">
                <button 
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center px-3 py-1 rounded border ${
                    currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                  }`}
                >
                  <FiChevronLeft className="mr-1" /> Previous
                </button>
                
                <div className="flex items-center">
                  {renderPaginationButtons}
                </div>
                
                <button 
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`flex items-center px-3 py-1 rounded border ${
                    currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                  }`}
                >
                  Next <FiChevronRight className="ml-1" />
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500 text-center py-10">No users found.</p>
        )}

        {/* Edit User Modal */}
        <Transition appear show={isModalOpen} as={React.Fragment}>
          <Dialog onClose={closeModal} className="fixed inset-0 z-10 overflow-y-auto">
            <div className="min-h-screen flex items-center justify-center">
              <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <Dialog.Title className="text-xl font-semibold">Edit User</Dialog.Title>

                <div className="mt-4 space-y-4">
                  <input type="text" name="name" value={formData.name || ''} onChange={handleChange} placeholder="Name" className="w-full border p-2 rounded" />
                  <input type="text" name="login_id" value={formData.login_id || ''} onChange={handleChange} placeholder="Login ID" className="w-full border p-2 rounded" />
                  <select name="role_name" value={formData.role_name || ''} onChange={handleChange} className="w-full border p-2 rounded">
                    {roles.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                  <button onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                  <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        </Transition>

        {/* Edit PASSWORD Modal */}
        <Transition appear show={isPasswordModalOpen} as={React.Fragment}>
          <Dialog onClose={closePasswordModal} className="fixed inset-0 z-10 overflow-y-auto">
            <div className="min-h-screen flex items-center justify-center">
              <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <Dialog.Title className="text-xl font-semibold">Edit Password</Dialog.Title>

                <div className="mt-4 space-y-4">
                  <input type="password" name="password" value={formData.password || ''} onChange={handleChange} placeholder="Password (optional)" className="w-full border p-2 rounded" />
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                  <button onClick={closePasswordModal} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                  <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        </Transition>

        {/* Confirm Modal for Status Change */}
        <Transition appear show={isConfirmModalOpen} as={React.Fragment}>
          <Dialog onClose={closeConfirmModal} className="fixed inset-0 z-10 overflow-y-auto">
            <div className="min-h-screen flex items-center justify-center">
              <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <Dialog.Title className="text-xl font-semibold">Confirm Action</Dialog.Title>
                <p className="mt-4">Are you sure you want to {selectedUser?.active ? 'deactivate' : 'activate'} this user?</p>
                <div className="mt-6 flex justify-end space-x-4">
                  <button onClick={closeConfirmModal} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                  <button onClick={handleStatusUpdate} className="px-4 py-2 bg-red-500 text-white rounded">Confirm</button>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
};

export default GetUsers;