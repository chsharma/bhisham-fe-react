// import './index.css'
// function App() {

//   return (
//     <div className='bg-red-300 text-2xl text-center flex items-center justify-center'>
//       <h1 className='text-3xl'>Manav</h1>
//     </div>
//   )
// }

// export default App





import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateUser from './pages/CreateUser';
import ViewBhisham from './pages/ViewBhisham';
import CreateBhisham from './pages/CreateBhisham';
import BhishamDetails from './pages/BhishamDetails';
import ViewExpiry from './pages/ViewExpiry';
import ManufacturePage from './pages/stock/master/CreateManufacure';

// Layout
import Layout from './components/Layout';

// Context
import { AuthProvider } from './context/AuthContext';
import GetUsers from './pages/GetUsers';
import UpdatePassword from './pages/UpdatePassword';
import Updateuser from './pages/UpdateUser';
import CreateSupplier from './pages/stock/master/CreateSupplier';


function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="create-user" element={<CreateUser />} />
            <Route path="update-user" element={<Updateuser />} />
            <Route path="get-user" element={<GetUsers />} />
            <Route path="update-password" element={<UpdatePassword />} />
            <Route path="view-bhisham" element={<ViewBhisham />} />
            <Route path="view-kits-expiry-and-shorts" element={<ViewExpiry/>} />
            <Route path="create-bhisham" element={<CreateBhisham />} />
            <Route path="bhisham/:id" element={<BhishamDetails />} />
            <Route path="stock/master/create-manufacture" element={<ManufacturePage />} />
            <Route path="stock/master/create-supplier" element={<CreateSupplier />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;