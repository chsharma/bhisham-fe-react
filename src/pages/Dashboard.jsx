import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getDashboardCounts, getExpiryCounts,
  getExpireByType
 } from '../services/api';
import { FiPackage, FiBox, FiLayers, FiGrid } from 'react-icons/fi';

const DashboardCard = ({ title, count, icon, color }) => (
  <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 p-6 border border-gray-100">
    <div className="flex items-center space-x-6">
      <div className={`p-3 rounded-lg ${color || 'bg-blue-50'} flex items-center justify-center w-20 h-20`}>
        <img 
          src={icon}
          alt={title}
          className="object-contain max-w-full max-h-full"
        />
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-600 mb-1">{title}</h3>
        <p className="text-4xl font-bold text-gray-900">{count.toLocaleString()}</p>
      </div>
    </div>
  </div>
);

const ExpiryCard = ({ title, count, icon, color, onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 p-6 border border-gray-100"
  >
    <div className="flex items-center space-x-6">
      <div className={`p-3 rounded-lg ${color || 'bg-blue-50'} flex items-center justify-center w-20 h-20`}>
        <img src={icon} alt={title} className="object-contain max-w-full max-h-full" />
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-600 mb-1">{title}</h3>
        <p className="text-4xl font-bold text-gray-900">{count.toLocaleString()}</p>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [counts, setCounts] = useState({
    bhisham: 0,
    cc: 0,
    kits: 0,
    mc: 0
  });

  const [expiryModalOpen, setExpiryModalOpen] = useState(false);
  const [expiryModalTitle, setExpiryModalTitle] = useState('');
  const [expiryKits, setExpiryKits] = useState([]);

  const [ExpiryCounts, setExpiryCounts] = useState({
    already_expired: 0,
    expiring_in_15_days: 0,
    expiring_in_1_month: 0
  });

  const [loading, setLoading] = useState(true);

  const handleExpiryCardClick = async (type) => {
      setExpiryKits([]);
      setExpiryModalOpen(true);
      setLoading(false);
      try {
        let kits = [];
        if (type === 'expired') {
          kits = await getExpireByType(0, 1);
          setExpiryModalTitle('Expired Kits');
        } else if (type === '15days') {
          kits = await getExpireByType(0, 2);
          setExpiryModalTitle('Kits Expiring in 15 Days');
        } else if (type === '1month') {
          kits = await getExpireByType(0, 3);
          setExpiryModalTitle('Kits Expiring in 1 Month');
        }
        setExpiryKits(kits || []);
      } catch (error) {
        toast.error('Error fetching kits');
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('api call');
        const response = await getDashboardCounts();
        console.log('data', response);
        setCounts(response);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchExpiredCount = async () => {
      try {
        console.log('api call');
        const response = await getExpiryCounts(0);
        console.log('data', response);
        setExpiryCounts(response);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchExpiredCount();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-8 text-center">Dashboard Overview</h1>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Bhishm"
            count={counts.bhisham}
            icon="bhishm.jpeg"
            color="bg-blue-500"
          />
          <DashboardCard
            title="Mother Cube"
            count={counts.mc}
            icon="mother_cube.jpeg"
            color="bg-red-500"
          />
          <DashboardCard
            title="Child Cube"
            count={counts.cc}
            icon="child_cube.jpeg"
            color="bg-green-500"
          />

          <DashboardCard
            title="Kits"
            count={counts.kits}
            icon="kit.jpeg"
            color="bg-purple-500"
          />
          
          <ExpiryCard
          title="Nearby Expiry 1 Month"
          count={ExpiryCounts.expiring_in_1_month}
          icon="../kit.jpeg"
          color="bg-lime-500"
          onClick={() => handleExpiryCardClick('1month')}
        />

        <ExpiryCard
          title="Nearby Expiry 15 Days"
          count={ExpiryCounts.expiring_in_15_days}
          icon="../kit.jpeg"
          color="bg-yellow-500"
          onClick={() => handleExpiryCardClick('15days')}
        />

        <ExpiryCard
          title="Expired Kits"
          count={ExpiryCounts.already_expired}
          icon="../kit.jpeg"
          color="bg-red-500"
          onClick={() => handleExpiryCardClick('expired')}
        />
        </div>

        {/* Quick Actions Section */}
        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Quick Actions</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <Link to="create-bhisham" className="bg-primary text-white py-3 px-6 rounded-lg text-center shadow-md hover:bg-primary-dark transition">
                Create New Bhishm
              </Link>
              <Link to="view-bhisham" className="bg-secondary text-white py-3 px-6 rounded-lg text-center shadow-md hover:bg-secondary-dark transition">
                View All Bhishm
              </Link>
              <Link to="create-user" className="bg-accent text-dark py-3 px-6 rounded-lg text-center shadow-md hover:bg-accent-dark transition">
                Create New User
              </Link>

            </div>
          </div>
        </div>
      </div>
      
{expiryModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 overflow-y-auto max-h-[80vh]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{expiryModalTitle}</h2>
        <button onClick={() => setExpiryModalOpen(false)} className="text-gray-600 hover:text-black text-xl">×</button>
      </div>
      <div className="space-y-4">
        {expiryKits.map((kit, index) => (
          <div key={index} className="border p-4 rounded shadow-sm">
          <p><strong>Serial No:</strong> {kit.serial_no}</p>
            <p><strong>Bhisham:</strong> {kit.bhisham_name}</p>
            <p><strong>Kit Name:</strong> {kit.kitname}</p>
            <p><strong>Kit No:</strong> {kit.kit_no}</p>
            <p><strong>Expiry Date:</strong> {kit.kit_expiry_date}</p>
            <p><strong>Kit EPC:</strong> {kit.kit_epc}</p>
            <p><strong>CC:</strong> {kit.cc_name} ({kit.cc_no})</p>
          </div>
        ))}
        {expiryKits.length === 0 && <p className="text-gray-500 text-center">No kits found.</p>}
      </div>
    </div>
  </div>
)}
    </div>
    
  );
};


export default Dashboard;