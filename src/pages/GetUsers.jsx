import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FiUser, FiCheckCircle, FiXCircle, FiClock, FiEdit, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Dialog, Transition } from '@headlessui/react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { activeDeactiveUser, getAllUser, getRoleList, getUserList, updateUsePassword, updateUser } from '../services/api';
import { BsFillPassFill } from 'react-icons/bs';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { FiEye, FiEyeOff } from "react-icons/fi";
const roles = ['Administrator', 'Manager', 'User'];

const GetUsers = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [users, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [formData, setFormData] = useState({});
  const [roleList, setRoleList] = useState([]);

  const fetchUserList = async () => {
    setLoading(true);
    try {
      const response = await getAllUser(user);
      console.log('response from bhisham', response);

      // Check if response has data property and it's an array
      if (response && response.data && Array.isArray(response.data)) {
        setUserList(response.data);
        setTotalPages(Math.ceil(response.data.length / usersPerPage));
      } else if (Array.isArray(response)) {
        // If response is directly an array
        setUserList(response);
        setTotalPages(Math.ceil(response.length / usersPerPage));
      } else {
        console.error('Unexpected API response format:', response);
        setUserList([]);
        setTotalPages(0);
        toast.error('Received invalid data format from server');
      }
    } catch (error) {
      toast.error('Failed to fetch Bhishm data');
      console.error('Error fetching Bhishm:', error);
      setUserList([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoleList = async () => {
    setLoading(true);
    try {
      const response = await getRoleList(user);
      console.log('response from role list', response);

      // Check if response has data property and it's an array
      if (response && response.data && Array.isArray(response.data)) {
        setRoleList(response.data);
      } else if (Array.isArray(response)) {
        // If response is directly an array
        setRoleList(response);
      } else {
        console.error('Unexpected API response format:', response);
        setRoleList([]);
        toast.error('Received invalid data format from server');
      }
    } catch (error) {
      toast.error('Failed to fetch roles');
      console.error('Error fetching roles:', error);
      setRoleList([]);
    } finally {
      setLoading(false);
    }
  };

  console.log(roleList)

  useEffect(() => {
    fetchUserList();
    fetchRoleList();
  }, []);

  // Calculate current users to display based on pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Page navigation functions
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Handle per page change
  const handlePerPageChange = (e) => {
    const newPerPage = parseInt(e.target.value);
    setUsersPerPage(newPerPage);
    setTotalPages(Math.ceil(users.length / newPerPage));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      login_id: user.login_id,
      password: '',
      role_id: user.role_id,
    });
    setIsModalOpen(true);
  };

  const openPasswordModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      login_id: user.login_id,
      password: '',
      role_id: user.role_id,
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
      console.log(formData)

      selectedUser.name = formData.name;
      selectedUser.password = formData.password
      selectedUser.login_id = formData.login_id
      selectedUser.role_id = formData.role_id ? parseInt(formData.role_id, 10) : 0;

      const response = await updateUser(selectedUser);

      // await axios.post(https://api.gryfontech.com/v1/api/user/update-user, formData);
      toast.success('User updated successfully!');
      setSelectedUser({});
      closeModal();
      closePasswordModal();
      fetchUserList();

    } catch (error) {
      toast.error('Failed to update user.');
    }
  };

  const handlePasswordUpdate = async () => {
    try {

      let data = {}

      data.password = formData.password
      console.log(user)
      data.login_id = user.user_id

      const response = await updateUsePassword(data);

      // await axios.post(`https://api.gryfontech.com/v1/api/user/update-user`, formData);
      toast.success('User Password updated successfully!');
      setSelectedUser({});
      closeModal();
      fetchUserList();

    } catch (error) {
      toast.error('Failed to update user.');
    }
  };


  const handleStatusUpdate = async () => {
    try {
      selectedUser.active = !selectedUser?.active

      let apiData = { "user_id": selectedUser.user_id, active: selectedUser?.active }

      const response = await activeDeactiveUser(apiData);

      // await axios.post(https://api.gryfontech.com/v1/api/user/update-user, { active: !selectedUser.active });
      toast.success(`User ${selectedUser.active ? 'activated' : 'deactivated'} successfully!`);
      setSelectedUser({});

      closeConfirmModal();
      fetchUserList();

    } catch (error) {
      toast.error('Failed to update user status.');
    }
  };

  const getRoleName = (roleId) => {
    if (roleList && roleList.length > 0) {
      let role = roleList.find((rl) => rl.id == roleId);
      if (role) {
        return role.name;
      } else {
        return "";
      }
    }
    return "";
  }

  // Generate pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];

    // Always show first page
    buttons.push(
      <button
        key="first"
        onClick={() => goToPage(1)}
        className={`px-3 py-1 mx-1 rounded ${currentPage === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
      >
        1
      </button>
    );

    // If there are many pages, add ellipsis and show a window around current page
    if (totalPages > 7) {
      if (currentPage > 3) {
        buttons.push(<span key="ellipsis1" className="px-2">...</span>);
      }

      // Show a window of pages around the current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => goToPage(i)}
            className={`px-3 py-1 mx-1 rounded ${currentPage === i ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {i}
          </button>
        );
      }

      if (currentPage < totalPages - 2) {
        buttons.push(<span key="ellipsis2" className="px-2">...</span>);
      }
    } else {
      // If not many pages, show all pages
      for (let i = 2; i < totalPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => goToPage(i)}
            className={`px-3 py-1 mx-1 rounded ${currentPage === i ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {i}
          </button>
        );
      }
    }

    // Always show last page if there's more than 1 page
    if (totalPages > 1) {
      buttons.push(
        <button
          key="last"
          onClick={() => goToPage(totalPages)}
          className={`px-3 py-1 mx-1 rounded ${currentPage === totalPages ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="bg-gray-50 p-8">
      <div className="mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <FiUser className="mr-2 text-primary" /> User List
        </h1>

        {users.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <span className="mr-2">Show</span>
                <select
                  className="border rounded px-2 py-1"
                  value={usersPerPage}
                  onChange={handlePerPageChange}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="ml-2">entries</span>
              </div>

              <div>
                <span className="text-gray-600">
                  Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, users.length)} of {users.length} entries
                </span>
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
                  {currentUsers.map((user, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-4 px-6">{user.name}</td>
                      <td className="py-4 px-6">{user.login_id}</td>
                      <td className="py-4 px-6">{getRoleName(user.role_id) || ""}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`cursor-pointer flex items-center ${user.active ? 'text-green-600' : 'text-red-600'}`}
                          onClick={() => openConfirmModal(user)}
                        >
                          {user.active ? <FiCheckCircle className="mr-1" /> : <FiXCircle className="mr-1" />}
                          {user.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-6">{new Date(user.created_at).toLocaleString()}</td>
                      <td className="py-4 px-6">
                        <button onClick={() => openModal(user)} className="text-blue-500 mr-5">
                          <FiEdit className="inline mr-1" /> Edit
                        </button>
                        <button onClick={() => openPasswordModal(user)} className="text-blue-500">
                          <BsFillPassFill className="inline mr-1" /> Password
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination controls */}
            <div className="mt-4 flex justify-between items-center">
              <div>
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded flex items-center ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  <FiChevronLeft className="mr-1" /> Previous
                </button>
              </div>

              <div className="flex">
                {renderPaginationButtons()}
              </div>

              <div>
                <button
                  onClick={goToNextPage}
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

        {/* Edit User Modal */}
        <Transition appear show={isModalOpen} as={React.Fragment}>
          <Dialog onClose={closeModal} className="fixed inset-0 z-10 overflow-y-auto">
            <div className="min-h-screen flex items-center justify-center">
              <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <Dialog.Title className="text-xl font-semibold">Edit User</Dialog.Title>

                <div className="mt-4 space-y-4">
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full border p-2 rounded" />
                  <input type="text" name="login_id" value={formData.login_id} onChange={handleChange} placeholder="Login ID" className="w-full border p-2 rounded" />
                  <select name="role_id" value={formData.role_id} onChange={handleChange} className="w-full border p-2 rounded">
                    {roleList.map((role) => (
                      <option key={role.id} value={role.id}>{role.name}</option>
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

                <div className="mt-4 space-y-4 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password (optional)"
                    className="w-full border p-2 rounded pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    style ={{paddingBottom: '1.8rem'}}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                  <button onClick={closePasswordModal} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                  <button onClick={handlePasswordUpdate} className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
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