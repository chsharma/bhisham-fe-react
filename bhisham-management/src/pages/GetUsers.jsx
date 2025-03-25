import React from 'react';
import { useLocation } from 'react-router-dom';
import { FiUser, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';

const GetUsers = () => {
  const location = useLocation();
  const { state } = location;

  const users = state?.data || [];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <FiUser className="mr-2 text-primary" /> User List
        </h1>

        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg shadow-sm">
              <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <tr>
                  <th className="py-4 px-6 text-left font-semibold">User ID</th>
                  <th className="py-4 px-6 text-left font-semibold">Name</th>
                  <th className="py-4 px-6 text-left font-semibold">Login ID</th>
                  <th className="py-4 px-6 text-left font-semibold">Role</th>
                  <th className="py-4 px-6 text-left font-semibold">Status</th>
                  <th className="py-4 px-6 text-left font-semibold">Created At</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={index}
                    className={`border-t ${
                      index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    } hover:bg-gray-100 transition`}
                  >
                    <td className="py-4 px-6 text-gray-700 font-medium">{user.user_id}</td>
                    <td className="py-4 px-6 text-gray-700">{user.name}</td>
                    <td className="py-4 px-6 text-gray-700">{user.login_id}</td>
                    <td className="py-4 px-6 text-gray-700">{user.role_name}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          user.active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {user.active ? (
                          <>
                            <FiCheckCircle className="mr-1" /> Active
                          </>
                        ) : (
                          <>
                            <FiXCircle className="mr-1" /> Inactive
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-700 flex items-center">
                      <FiClock className="mr-2 text-gray-500" />
                      {new Date(user.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-10 text-lg">
            No users found.
          </p>
        )}
      </div>
    </div>
  );
};

export default GetUsers;
