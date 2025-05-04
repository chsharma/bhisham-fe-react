"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getDashboardCounts, getExpiryCounts, getExpireByType } from '../services/api';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ExpiryCard = ({ title, count, icon, color, onClick, isActive }) => (
  <div
    onClick={onClick}
    className={`cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 p-6 border-2 ${isActive ? 'border-blue-500' : 'border-gray-100'}`}
  >
    <div className="flex items-center space-x-6">
      <div className={`p-3 rounded-lg ${color} flex items-center justify-center w-20 h-20`}>
        <img src={icon} alt={title} className="object-contain max-w-full max-h-full" />
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-600 mb-1">{title}</h3>
        <p className="text-4xl font-bold text-gray-900">{count.toLocaleString()}</p>
      </div>
    </div>
  </div>
);

const ExpiryKitsPage = () => {
  const [counts, setCounts] = useState({
    bhisham: 0,
    cc: 0,
    kits: 0,
    mc: 0
  });

  const [expiryKits, setExpiryKits] = useState([]);
  const [ExpiryCounts, setExpiryCounts] = useState({
    already_expired: 0,
    expiring_in_15_days: 0,
    expiring_in_1_month: 0,
    kit_shorts: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [activeCard, setActiveCard] = useState(null);

  const handleExpiryCardClick = async (type) => {
    setActiveCard(type);
    setExpiryKits([]);
    setLoading(true);
    setCurrentPage(1);
    try {
      let kits = [];
      if (type === 'expired') {
        kits = await getExpireByType(0, 1);
      } else if (type === '15days') {
        kits = await getExpireByType(0, 2);
      } else if (type === '1month') {
        kits = await getExpireByType(0, 3);
      } else if (type === 'Kit Shorts') {
        kits = await getExpireByType(0, 4);
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
        const response = await getDashboardCounts();
        setCounts(response);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchExpiredCount = async () => {
      try {
        const response = await getExpiryCounts(0);
        setExpiryCounts(response);
      } catch (error) {
        console.error('Error fetching expiry counts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchExpiredCount();
  }, []);

  // Filter kits based on search term
  const filteredKits = expiryKits.filter(
    (kit) =>
      kit.kitname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kit.cc_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kit.serial_no?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current kits for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentKits = filteredKits.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredKits.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading && !expiryKits.length) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ExpiryCard
            title="Nearby Expiry 1 Month"
            count={ExpiryCounts.expiring_in_1_month}
            icon="../kit.jpeg"
            color="bg-lime-500"
            onClick={() => handleExpiryCardClick('1month')}
            isActive={activeCard === '1month'}
          />
          <ExpiryCard
            title="Nearby Expiry 15 Days"
            count={ExpiryCounts.expiring_in_15_days}
            icon="../kit.jpeg"
            color="bg-yellow-500"
            onClick={() => handleExpiryCardClick('15days')}
            isActive={activeCard === '15days'}
          />
          <ExpiryCard
            title="Expired Kits"
            count={ExpiryCounts.already_expired}
            icon="../kit.jpeg"
            color="bg-red-500"
            onClick={() => handleExpiryCardClick('expired')}
            isActive={activeCard === 'expired'}
          />
          <ExpiryCard
            title="Kits Shorts"
            count={ExpiryCounts.kit_shorts}
            icon="../kit.jpeg"
            color="bg-red-500"
            onClick={() => handleExpiryCardClick('Kit Shorts')}
            isActive={activeCard === 'Kit Shorts'}
          />
        </div>

        {/* Search Section */}
        {expiryKits.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <input
                type="text"
                className="border border-gray-300 rounded-lg p-2 w-full md:w-96"
                placeholder="Search by Kit Name, CC Name or Serial No..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <div className="text-sm text-gray-600">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredKits.length)} of {filteredKits.length} kits
              </div>
            </div>

            {/* Kits Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentKits.length === 0 ? (
                    <div className="text-center col-span-full py-10 text-gray-500">
                      No kits found matching your search
                    </div>
                  ) : (
                    currentKits.map((kit, index) => (
                      <Link
                        key={index}
                        to={`/bhisham/${kit.bhisham_id}`}
                        className="cursor-pointer bg-white rounded-lg shadow hover:shadow-md transition duration-300 p-4 border border-gray-200 hover:border-blue-300"
                      >
                        <div className="space-y-2">
                          <div className="font-bold text-sm text-gray-500">
                            Serial No: {kit.serial_no || 'N/A'}
                          </div>
                          <div className="font-bold text-lg truncate">{kit.kitname || 'Unnamed Kit'}</div>
                          <div className="text-sm text-gray-500">
                            Expiry: {kit.kit_expiry_date || 'No expiry date'}
                          </div>
                          <div className="text-sm text-gray-500">
                            CC: {kit.cc_name || 'No CC assigned'}
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>

                {/* Pagination */}
                {filteredKits.length > itemsPerPage && (
                  <div className="flex justify-center mt-8">
                    <nav className="flex items-center gap-1" aria-label="Pagination">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        <FiChevronLeft className="h-5 w-5" />
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                        <button
                          key={number}
                          onClick={() => paginate(number)}
                          className={`px-4 py-2 rounded-md border ${currentPage === number ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 hover:bg-gray-50'}`}
                        >
                          {number}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        <FiChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {!activeCard && !loading && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-xl font-medium text-gray-600 mb-2">Select an expiry category above</h3>
            <p className="text-gray-500">Click on one of the cards to view kits in that category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpiryKitsPage;