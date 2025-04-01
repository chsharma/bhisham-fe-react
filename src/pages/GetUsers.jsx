import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FiUser, FiCheckCircle, FiXCircle, FiClock, FiEdit } from 'react-icons/fi';
import { Dialog, Transition } from '@headlessui/react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { activeDeactiveUser, updateUser } from '../services/api';
import { BsFillPassFill } from 'react-icons/bs';

const roles = ['Administrator', 'Manager', 'User'];

const GetUsers = () => {
  const location = useLocation();
  const { state } = location;
  const users = state?.data || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [formData, setFormData] = useState({});

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
      console.log(formData)

      selectedUser.name = formData.name;
      selectedUser.password = formData.password
      selectedUser.login_id = formData.login_id
      selectedUser.role_name = formData.role_name

      const response = await updateUser(selectedUser);

      // await axios.post(`https://api.gryfontech.com/v1/api/user/update-user`, formData);
      toast.success('User updated successfully!');
      setSelectedUser({});
      closeModal();
    } catch (error) {
      toast.error('Failed to update user.');
    }
  };

  const handleStatusUpdate = async () => {
    try {
      selectedUser.active = !selectedUser?.active

      let apiData = { "user_id": selectedUser.user_id, active: !selectedUser?.active }

      const response = await activeDeactiveUser(apiData);

      // await axios.post(`https://api.gryfontech.com/v1/api/user/update-user`, { active: !selectedUser.active });
      toast.success(`User ${selectedUser.active ? 'deactivated' : 'activated'} successfully!`);
      setSelectedUser({});

      closeConfirmModal();
    } catch (error) {
      toast.error('Failed to update user status.');
    }
  };


  return (
    <div className=" bg-gray-50 p-8">
      <div className="mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <FiUser className="mr-2 text-primary" /> User List
        </h1>



        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg shadow-sm">
              <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <tr>
                  {/* <th className="py-4 px-6">User ID</th> */}
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Login ID</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Created At</th>
                  <th className="py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    {/* <td className="py-4 px-6">{user.user_id}</td> */}
                    <td className="py-4 px-6">{user.name}</td>
                    <td className="py-4 px-6">{user.login_id}</td>
                    <td className="py-4 px-6">{user.role_name}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`cursor-pointer flex items-center ${user.active ? 'text-green-600' : 'text-red-600'}`}
                        onClick={() => openConfirmModal(user)}
                      >
                        {user.active ? <FiCheckCircle /> : <FiXCircle />} {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    {/* <td className="py-4 px-6">
                      {user.active ? (
                        <span className="text-green-600 flex items-center"><FiCheckCircle /> Active</span>
                      ) : (
                        <span className="text-red-600 flex items-center"><FiXCircle /> Inactive</span>
                      )}
                    </td> */}
                    <td className="py-4 px-6">{new Date(user.created_at).toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <button onClick={() => openModal(user)} className="text-blue-500 mr-5">
                        <FiEdit /> Edit
                      </button>
                      <button onClick={() => openPasswordModal(user)} className="text-blue-500">
                        <BsFillPassFill /> Password
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                  {/* <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password (optional)" className="w-full border p-2 rounded" /> */}
                  <select name="role_name" value={formData.role_name} onChange={handleChange} className="w-full border p-2 rounded">
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
                  <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password (optional)" className="w-full border p-2 rounded" />
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