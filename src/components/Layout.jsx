import { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiMenu,
  FiX,
  FiHome,
  FiUser,
  FiPackage,
  FiChevronDown,
  FiLogOut,
  FiBox,
} from "react-icons/fi";
import { getAllUser } from "../services/api";

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [nestedDropdown, setNestedDropdown] = useState(null);

  const toggleDropdown = (key) => {
    setOpenDropdown(prev => (prev === key ? null : key));
    setNestedDropdown(null); // reset nested dropdown when parent toggled
  };

  const toggleNestedDropdown = (key) => {
    setNestedDropdown(prev => (prev === key ? null : key));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getAllUsers = async () => {
    const data = await getAllUser(user);
    navigate("/get-user", { state: { data } });
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  const renderDropdown = (items) => (
    <div className="ml-6 mt-2 bg-gray-900 border border-gray-700 p-2 rounded shadow-lg space-y-2">
      {items.map(({ to, label, onClick }, idx) => (
        <NavLink
          key={idx}
          to={to}
          onClick={onClick}
          className="block px-4 py-2 text-sm text-gray-300 hover:bg-blue-600 hover:text-white rounded transition"
        >
          {label}
        </NavLink>
      ))}
    </div>
  );

  return (
    <div className="container-fluid flex h-screen text-gray-900 px-0">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 shadow-lg transition-transform duration-300 lg:translate-x-0 lg:static ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">BHISHM CUBE</h2>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <FiX className="w-6 h-6 text-white" />
          </button>
        </div>

        <nav className="px-4 py-6 space-y-4 overflow-y-auto">
          <NavLink to="/" className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-md ${isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-blue-500 hover:text-white"}`
          }>
            <FiHome className="w-5 h-5" />
            <span>Dashboard</span>
          </NavLink>

          {/* User Management */}
          <div>
            <button onClick={() => toggleDropdown("user")} className="w-full flex justify-between items-center px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-blue-500 hover:text-white">
              <span className="flex items-center gap-2">
                <FiUser className="w-5 h-5" />
                User Management
              </span>
              <FiChevronDown className={`${openDropdown === "user" ? "rotate-180" : ""} transition`} />
            </button>
            {openDropdown === "user" && renderDropdown([
              { to: "/get-user", label: "Get Users", onClick: getAllUsers },
              { to: "/create-user", label: "Create Users" },
            ])}
          </div>

          {/* Bhishm */}
          <div>
            <button onClick={() => toggleDropdown("bhisham")} className="w-full flex justify-between items-center px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-blue-500 hover:text-white">
              <span className="flex items-center gap-2">
                <FiPackage className="w-5 h-5" />
                Bhishm
              </span>
              <FiChevronDown className={`${openDropdown === "bhisham" ? "rotate-180" : ""} transition`} />
            </button>
            {openDropdown === "bhisham" && renderDropdown([
              { to: "/view-bhisham", label: "View Bhishm" },
              { to: "/create-bhisham", label: "Create Bhishm" },
              { to: "/view-kits-expiry-and-shorts", label: "View Kits Expiry & Shorts" },
            ])}
          </div>

          {/* WMS with nested Master */}
          <div>
            <button onClick={() => toggleDropdown("wms")} className="w-full flex justify-between items-center px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-blue-500 hover:text-white">
              <span className="flex items-center gap-2">
                <FiBox className="w-5 h-5" />
                WMS
              </span>
              <FiChevronDown className={`${openDropdown === "wms" ? "rotate-180" : ""} transition`} />
            </button>

            {openDropdown === "wms" && (
              <div className="ml-6 mt-2">
                <button onClick={() => toggleNestedDropdown("master")} className="w-full flex justify-between items-center px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-blue-500 hover:text-white">
                  <span>Master</span>
                  <FiChevronDown className={`${nestedDropdown === "master" ? "rotate-180" : ""} transition`} />
                </button>
                {nestedDropdown === "master" && renderDropdown([
                  { to: "/stock/master/create-supplier", label: " Supplier" },
                  { to: "/stock/master/create-manufacture", label: " Manufacturer" },
                  { to: "/stock/master/create-item", label: "Item" },
                  { to: "/stock/master/create-batch", label: "Batch" },
                ])}
              </div>
            )}
          </div>

          <button
  onClick={() => toggleNestedDropdown("inward")}
  className="w-full flex justify-between items-center px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-blue-500 hover:text-white"
>
  <span>Create Inwards</span>
  <FiChevronDown
    className={`${nestedDropdown === "inward" ? "rotate-180" : ""} transition`}
  />
</button>
{nestedDropdown === "inward" &&
  renderDropdown([
    { to: "/stock/master/create-inward", label: "Inward Entry" },
  ])}

        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 w-full p-4 bg-gray-900 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-md font-bold text-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{user.name}</p>
              <p className="text-gray-400 text-xs">{user.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-red-400 bg-gray-800 hover:text-red-600 rounded shadow">
            <FiLogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white flex items-center justify-between px-6 h-20 border-b shadow">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <FiMenu className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">
            {location.pathname === "/" && "Dashboard"}
            {location.pathname === "/create-user" && "Create User"}
            {location.pathname === "/view-bhisham" && "View Bhishm"}
            {location.pathname === "/create-bhisham" && "Create Bhishm"}
            {location.pathname.includes("create-manufacture") && "Create Manufacturer"}
          </h1>
          <div className="flex items-center gap-4">
            <img src="/image.jpeg" alt="Logo" className="h-10 w-auto" />
            <div className="relative">
              <button onClick={() => toggleDropdown("profile")} className="flex items-center gap-2">
                <div className="w-9 h-9 bg-blue-500 text-white flex items-center justify-center rounded-full font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <FiChevronDown className={`${openDropdown === "profile" ? "rotate-180" : ""} transition`} />
              </button>
              {openDropdown === "profile" && (
                <div className="absolute right-0 mt-2 w-56 bg-white border rounded shadow">
                  <div className="p-4 border-b">
                    <p className="font-bold">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-gray-100">
                    <FiLogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-100 rounded-tl-xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
