import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiHome, FiUser, FiPackage, FiChevronDown, FiLogOut, FiBox } from 'react-icons/fi';
import { getAllUser } from '../services/api';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bhishamDropdownOpen, setBhishamDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [stockDropdownOpen, setStockDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleBhishamDropdown = () => {
    setBhishamDropdownOpen(!bhishamDropdownOpen);
  };

  const toggleStockDropdown = () => {
    setStockDropdownOpen(!stockDropdownOpen);
  };

  const toggleProfileDropdown = () => setProfileDropdownOpen(!profileDropdownOpen);

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  }

  const getAllUsers = async() => {
    const data = await getAllUser(user)
    console.log('data here is ',data)
    navigate('/get-user', {state: {data: data}})
  }

  const navigateToUpdateUser = () => {
    navigate('/update-user', {state:{data:user}})
  }

  const navigateToUpdatePassword = () => {
    console.log('inside this')
    console.log('user', user)
    navigate('/update-password', {state: {data: user}})
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 to-gray-300 text-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-gradient-to-b from-[#1a1a2e] to-[#16213e] shadow-2xl transition-transform duration-300 lg:translate-x-0 lg:static ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-700">
          <h2 className="text-3xl font-extrabold text-white tracking-wide">BHISHM CUBE</h2>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md lg:hidden hover:bg-gray-700 transition"
          >
            <FiX className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-6 py-8 space-y-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-4 rounded-xl transition duration-300 shadow-md ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-blue-500 hover:text-white'
              }`
            }
          >
            <FiHome className="w-6 h-6" />
            <span className="text-lg font-medium">Dashboard</span>
          </NavLink>

          <div>
            <button
              onClick={toggleUserDropdown}
              className="flex items-center justify-between w-full px-6 py-4 text-gray-300 bg-gray-800 rounded-xl shadow-md transition hover:bg-blue-500 hover:text-white"
            >
              <div className="flex items-center gap-4">
                <FiUser className="w-6 h-6" />
                <span className="text-lg font-medium">User Management</span>
              </div>
              <FiChevronDown
                className={`transition-transform duration-300 ${
                  userDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {userDropdownOpen && (
              <div className="ml-8 mt-2 space-y-4">
                <NavLink
                  to="/get-user"
                  className="block px-5 py-3 text-gray-300 transition hover:bg-blue-500 hover:text-white"
                  onClick={getAllUsers}
                >
                  Get Users
                </NavLink>
                <NavLink
                  to="/create-user"
                  className="block px-5 py-3 text-gray-300 transition hover:bg-blue-500 hover:text-white"
                >
                  Create Users
                </NavLink>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={toggleBhishamDropdown}
              className="flex items-center justify-between w-full px-6 py-4 text-gray-300 bg-gray-800 rounded-xl shadow-md transition hover:bg-blue-500 hover:text-white"
            >
              <div className="flex items-center gap-4">
                <FiPackage className="w-6 h-6" />
                <span className="text-lg font-medium">Bhishm</span>
              </div>
              <FiChevronDown
                className={`transition-transform duration-300 ${
                  bhishamDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {bhishamDropdownOpen && (
              <div className="ml-8 mt-2 space-y-4">
                <NavLink
                  to="/view-bhisham"
                  className="block px-5 py-3 text-gray-300 transition hover:bg-blue-500 hover:text-white"
                >
                  View Bhishm
                </NavLink>
                <NavLink
                  to="/create-bhisham"
                  className="block px-5 py-3 text-gray-300 transition hover:bg-blue-500 hover:text-white"
                >
                  Create Bhishm
                </NavLink>
                <NavLink
                  to="/view-kits-expiry-and-shorts"
                  className="block px-5 py-3 text-gray-300 transition hover:bg-blue-500 hover:text-white"
                >
                  View Kits Expiry & Shorts
                </NavLink>
              </div>
            )}
          </div>

          {/* New Stock Menu */}
          <div>
            <button
              onClick={toggleStockDropdown}
              className="flex items-center justify-between w-full px-6 py-4 text-gray-300 bg-gray-800 rounded-xl shadow-md transition hover:bg-blue-500 hover:text-white"
            >
              <div className="flex items-center gap-4">
                <FiBox className="w-6 h-6" />
                <span className="text-lg font-medium">Stock</span>
              </div>
              <FiChevronDown
                className={`transition-transform duration-300 ${
                  stockDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {stockDropdownOpen && (
              <div className="ml-8 mt-2 space-y-4">
                <NavLink
                  to="stock/master/create-manufacture"
                  className="block px-5 py-3 text-gray-300 transition hover:bg-blue-500 hover:text-white"
                >
                  Create Manufacturer
                </NavLink>
                {/* Add more stock-related links here as needed */}
              </div>
            )}
          </div>
        </nav>

        {/* User Profile & Logout */}
        <div className="absolute bottom-0 w-full p-6 bg-gray-900">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center text-xl font-bold shadow-lg rounded-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-md font-bold text-white">{user.name}</p>
              <p className="text-sm text-gray-400">{user.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 text-red-400 bg-gray-800 shadow-md hover:text-red-600 transition"
          >
            <FiLogOut className="w-6 h-6" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white flex items-center justify-between px-12 border-b shadow-lg" style={{ height: '5rem' }}>
          <button onClick={toggleSidebar} className="p-3 rounded-md lg:hidden hover:bg-gray-200 transition">
            <FiMenu className="w-7 h-7 text-gray-600" />
          </button>

          <h1 className="text-4xl font-bold text-gray-800">
            {location.pathname === '/' && 'Dashboard'}
            {location.pathname === '/create-user' && 'Create User'}
            {location.pathname === '/view-bhisham' && 'View Bhishm'}
            {location.pathname === '/create-bhisham' && 'Create Bhishm'}
            {location.pathname === '/create-manufacturer' && 'Create Manufacturer'}
          </h1>

          <img 
            src="/image.jpeg"
            alt="Bhishm App Logo" 
            className="h-auto w-auto" 
            style ={{height  : "4rem"}}
          />

          {/* User Profile Section */}
          <div className="relative">
            <button onClick={toggleProfileDropdown} className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center text-lg font-bold rounded-full">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-lg font-medium text-gray-700">{user.name}</span>
              <FiChevronDown className={`transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white border rounded-lg shadow-xl">
                <div className="p-4 border-b">
                  <p className="text-lg font-bold">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 text-red-400 hover:bg-gray-100">
                  <FiLogOut className="w-6 h-6" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-12 bg-gray-100 rounded-tl-3xl shadow-inner">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;