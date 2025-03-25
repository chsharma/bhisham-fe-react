// import { useState } from 'react';
// import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { FiMenu, FiX, FiHome, FiUser, FiPackage, FiChevronDown, FiLogOut } from 'react-icons/fi';

// const Layout = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [bhishamDropdownOpen, setBhishamDropdownOpen] = useState(false);

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   const toggleBhishamDropdown = () => {
//     setBhishamDropdownOpen(!bhishamDropdownOpen);
//   };

//   // If no user, redirect to login
//   if (!user) {
//     navigate('/login');
//     return null;
//   }

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar for desktop */}
//       <aside 
//         className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:h-screen ${
//           sidebarOpen ? 'translate-x-0' : '-translate-x-full'
//         }`}
//       >
//         <div className="flex items-center justify-between p-4 border-b">
//           <h2 className="text-xl font-bold text-primary">Bhisham App</h2>
//           <button 
//             onClick={toggleSidebar} 
//             className="p-1 rounded-md lg:hidden hover:bg-gray-200"
//           >
//             <FiX className="w-6 h-6" />
//           </button>
//         </div>
        
//         <nav className="p-4 space-y-2">
//           <NavLink to="/" className={({ isActive }) => 
//             isActive ? 'sidebar-link-active' : 'sidebar-link'
//           }>
//             <FiHome className="w-5 h-5 mr-3" />
//             Dashboard
//           </NavLink>
          
//           <NavLink to="/create-user" className={({ isActive }) => 
//             isActive ? 'sidebar-link-active' : 'sidebar-link'
//           }>
//             <FiUser className="w-5 h-5 mr-3" />
//             Create User
//           </NavLink>
          
//           <div>
//             <button 
//               onClick={toggleBhishamDropdown}
//               className="w-full sidebar-link"
//             >
//               <FiPackage className="w-5 h-5 mr-3" />
//               <span className="flex-1 text-left">Bhisham</span>
//               <FiChevronDown className=""/>
//             </button>
            
//             {bhishamDropdownOpen && (
//               <div className="ml-8 mt-2 space-y-2">
//                 <NavLink to="/view-bhisham" className={({ isActive }) => 
//                   isActive ? 'sidebar-link-active' : 'sidebar-link'
//                 }>
//                   View Bhisham
//                 </NavLink>
//                 <NavLink to="/create-bhisham" className={({ isActive }) => 
//                   isActive ? 'sidebar-link-active' : 'sidebar-link'
//                 }>
//                   Create Bhisham
//                 </NavLink>
//               </div>
//             )}
//           </div>
//         </nav>
        
//         <div className="absolute bottom-0 w-full p-4 border-t">
//           <div className="flex items-center mb-4">
//             <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
//               {user.name.charAt(0)}
//             </div>
//             <div className="ml-3">
//               <p className="font-medium">{user.name}</p>
//               <p className="text-sm text-gray-500">{user.role}</p>
//             </div>
//           </div>
//           <button 
//             onClick={handleLogout}
//             className="w-full flex items-center px-4 py-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
//           >
//             <FiLogOut className="w-5 h-5 mr-3" />
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* Main content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Header */}
//         <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 lg:px-6">
//           <button 
//             onClick={toggleSidebar} 
//             className="p-1 rounded-md lg:hidden"
//           >
//             <FiMenu className="w-6 h-6" />
//           </button>
          
//           <h1 className="text-xl font-bold text-gray-800">
//             {location.pathname === '/' && 'Dashboard'}
//             {location.pathname === '/create-user' && 'Create User'}
//             {location.pathname === '/view-bhisham' && 'View Bhisham'}
//             {location.pathname === '/create-bhisham' && 'Create Bhisham'}
//             {location.pathname.startsWith('/bhisham/') && 'Bhisham Details'}
//           </h1>
          
//           <div></div> {/* Placeholder for right side content */}
//         </header>
        
//         {/* Page content */}
//         <main className="flex-1 overflow-y-auto p-4 lg:p-6">
//           <Outlet />
//         </main>
//       </div>
      
//       {/* Overlay to close sidebar on mobile */}
//       {sidebarOpen && (
//         <div 
//           onClick={toggleSidebar}
//           className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
//         ></div>
//       )}
//     </div>
//   );
// };

// export default Layout;

// import { useState } from 'react';
// import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { FiMenu, FiX, FiHome, FiUser, FiPackage, FiChevronDown, FiLogOut } from 'react-icons/fi';

// const Layout = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [bhishamDropdownOpen, setBhishamDropdownOpen] = useState(false);

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   const toggleBhishamDropdown = () => {
//     setBhishamDropdownOpen(!bhishamDropdownOpen);
//   };

//   if (!user) {
//     navigate('/login');
//     return null;
//   }

//   return (
//     <div className="flex h-screen bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800">
      
//       {/* Sidebar */}
//       <aside 
//         className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-blue-700 to-blue-900 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen ${
//           sidebarOpen ? 'translate-x-0' : '-translate-x-full'
//         }`}
//       >
//         {/* Sidebar Header */}
//         <div className="flex items-center justify-between p-6 border-b border-blue-600">
//           <h2 className="text-3xl font-extrabold text-white">Bhisham App</h2>
//           <button 
//             onClick={toggleSidebar} 
//             className="p-2 rounded-md lg:hidden hover:bg-blue-800"
//           >
//             <FiX className="w-6 h-6 text-white" />
//           </button>
//         </div>

//         {/* Navigation Links */}
//         <nav className="p-6 space-y-4">
//           <NavLink 
//             to="/" 
//             className={({ isActive }) => 
//               `flex items-center px-5 py-3 rounded-lg transition duration-300 ${
//                 isActive ? 'bg-blue-600 text-white' : 'text-blue-200 hover:bg-blue-500'
//               }`
//             }
//           >
//             <FiHome className="w-5 h-5 mr-3" />
//             Dashboard
//           </NavLink>

//           <NavLink 
//             to="/create-user" 
//             className={({ isActive }) => 
//               `flex items-center px-5 py-3 rounded-lg transition duration-300 ${
//                 isActive ? 'bg-blue-600 text-white' : 'text-blue-200 hover:bg-blue-500'
//               }`
//             }
//           >
//             <FiUser className="w-5 h-5 mr-3" />
//             Create User
//           </NavLink>

//           <div>
//             <button 
//               onClick={toggleBhishamDropdown}
//               className="flex items-center justify-between w-full px-5 py-3 text-blue-200 rounded-lg transition hover:bg-blue-500"
//             >
//               <div className="flex items-center">
//                 <FiPackage className="w-5 h-5 mr-3" />
//                 <span>Bhisham</span>
//               </div>
//               <FiChevronDown 
//                 className={`transition-transform ${bhishamDropdownOpen ? 'rotate-180' : ''}`} 
//               />
//             </button>
            
//             {bhishamDropdownOpen && (
//               <div className="ml-8 mt-2 space-y-2">
//                 <NavLink 
//                   to="/view-bhisham" 
//                   className={({ isActive }) => 
//                     `block px-4 py-2 rounded-md transition ${
//                       isActive ? 'bg-blue-600 text-white' : 'text-blue-200 hover:bg-blue-500'
//                     }`
//                   }
//                 >
//                   View Bhisham
//                 </NavLink>
//                 <NavLink 
//                   to="/create-bhisham" 
//                   className={({ isActive }) => 
//                     `block px-4 py-2 rounded-md transition ${
//                       isActive ? 'bg-blue-600 text-white' : 'text-blue-200 hover:bg-blue-500'
//                     }`
//                   }
//                 >
//                   Create Bhisham
//                 </NavLink>
//               </div>
//             )}
//           </div>
//         </nav>

//         {/* Profile & Logout */}
//         <div className="absolute bottom-0 w-full p-6 bg-blue-800">
//           <div className="flex items-center mb-4">
//             <div className="w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
//               {user.name.charAt(0).toUpperCase()}
//             </div>
//             <div className="ml-4">
//               <p className="text-lg font-bold text-white">{user.name}</p>
//               <p className="text-sm text-blue-300">{user.role}</p>
//             </div>
//           </div>
//           <button 
//             onClick={handleLogout}
//             className="w-full flex items-center px-4 py-3 text-red-400 hover:text-red-600 transition"
//           >
//             <FiLogOut className="w-5 h-5 mr-3" />
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
        
//         {/* Header */}
//         <header className="bg-white shadow-md h-20 flex items-center justify-between px-8 lg:px-12 border-b border-gray-300">
//           <button 
//             onClick={toggleSidebar} 
//             className="p-2 rounded-md lg:hidden hover:bg-gray-200 transition"
//           >
//             <FiMenu className="w-6 h-6 text-gray-700" />
//           </button>
          
//           <h1 className="text-3xl font-bold text-gray-700">
//             {location.pathname === '/' && 'Dashboard'}
//             {location.pathname === '/create-user' && 'Create User'}
//             {location.pathname === '/view-bhisham' && 'View Bhisham'}
//             {location.pathname === '/create-bhisham' && 'Create Bhisham'}
//             {location.pathname.startsWith('/bhisham/') && 'Bhisham Details'}
//           </h1>

//           <div></div> {/* Placeholder for right-side content */}
//         </header>

//         {/* Page content */}
//         <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
//           <Outlet />
//         </main>
//       </div>

//       {/* Sidebar Overlay on Mobile */}
//       {sidebarOpen && (
//         <div 
//           onClick={toggleSidebar}
//           className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
//         />
//       )}
//     </div>
//   );
// };

// export default Layout;


import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiHome, FiUser, FiPackage, FiChevronDown, FiLogOut } from 'react-icons/fi';
import { getAllUser } from '../services/api';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bhishamDropdownOpen, setBhishamDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

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

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  }

  const getAllUsers = async() => {
    const data = await getAllUser(user)
    console.log('data here is ',data)
    navigate('/get-user', {state: {data: data}})
  }

  const navigateToUpdatePassword = () => {
    console.log('inside this')
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
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-700">
          <h2 className="text-3xl font-extrabold text-white tracking-wide">Bhisham App</h2>
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

          {/* <NavLink
            to="/create-user"
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-4 rounded-xl transition duration-300 shadow-md ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-blue-500 hover:text-white'
              }`
            }
          >
            <FiUser className="w-6 h-6" />
            <span className="text-lg font-medium">Create User</span>
          </NavLink> */}
          <div>
            <button
              onClick={toggleUserDropdown}
              className="flex items-center justify-between w-full px-6 py-4 text-gray-300 bg-gray-800 rounded-xl shadow-md transition hover:bg-blue-500 hover:text-white"
            >
              <div className="flex items-center gap-4">
                <FiPackage className="w-6 h-6" />
                <span className="text-lg font-medium">Create User</span>
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
                <NavLink
                  to="/update-user"
                  className="block px-5 py-3 text-gray-300 transition hover:bg-blue-500 hover:text-white"
                >
                  Update Users
                </NavLink>
                <NavLink
                  className="block px-5 py-3 text-gray-300 transition hover:bg-blue-500 hover:text-white"
                  onClick={navigateToUpdatePassword}
                >
                  Update Password
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
                <span className="text-lg font-medium">Bhisham</span>
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
                  View Bhisham
                </NavLink>
                <NavLink
                  to="/create-bhisham"
                  className="block px-5 py-3 text-gray-300 transition hover:bg-blue-500 hover:text-white"
                >
                  Create Bhisham
                </NavLink>
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
        <header className="bg-white h-24 flex items-center justify-between px-12 border-b shadow-lg">
          <button
            onClick={toggleSidebar}
            className="p-3 rounded-md lg:hidden hover:bg-gray-200 transition"
          >
            <FiMenu className="w-7 h-7 text-gray-600" />
          </button>
          <h1 className="text-4xl font-bold text-gray-800">
            {location.pathname === '/' && 'Dashboard'}
            {location.pathname === '/create-user' && 'Create User'}
            {location.pathname === '/view-bhisham' && 'View Bhisham'}
            {location.pathname === '/create-bhisham' && 'Create Bhisham'}
          </h1>
          <div></div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-12 bg-gray-100 rounded-tl-3xl shadow-inner">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
        />
      )}
    </div>
  );
};

export default Layout;

