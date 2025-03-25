import React, { useState } from "react";
import axios from "axios";
import { FiLock, FiUser, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { updatePasswordPageApi } from "../services/api";
import { useLocation } from 'react-router-dom';

const UpdatePassword = () => {
  const location = useLocation();
  const { state } = location;
  const users = state?.data || [];
  console.log('users here', users)
  const [loginId, setLoginId] = useState(users.user_id);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginId || !newPassword) {
      setError("Both fields are required.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
        console.log('insnde password')
        const data = await updatePasswordPageApi(loginId, newPassword)
        console.log('data here is', data)
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Update Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Login ID */}
          <div className="relative">
            <FiUser className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Login ID"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* New Password */}
          <div className="relative">
            <FiLock className="absolute left-3 top-3 text-gray-500" />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        {/* Success / Error Messages */}
        {message && (
          <div className="flex items-center mt-4 text-green-600">
            <FiCheckCircle className="mr-2" />
            {message}
          </div>
        )}
        {error && (
          <div className="flex items-center mt-4 text-red-600">
            <FiXCircle className="mr-2" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdatePassword;
