import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  FiLogOut, 
  FiSearch, 
  FiTrash2, 
  FiEye, 
  FiX,
  FiTrendingUp,
  FiUsers,
  FiChevronUp,
  FiChevronDown,
  FiFilter,
  FiCalendar,
  FiUser,
  FiDollarSign,
  FiPackage,
  FiBarChart2,
  FiRefreshCw,
  FiEdit,
  FiMoreVertical
} from "react-icons/fi";

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];
const token = localStorage.getItem("adminToken");

const AdminDashboard = () => {
  const [harvests, setHarvests] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [modalSearchTerm, setModalSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });
  const [activeFilters, setActiveFilters] = useState({
    harvests: {},
    farmers: {}
  });
  const [loading, setLoading] = useState({
    harvests: false,
    farmers: false
  });
  const [stats, setStats] = useState({
    totalValue: 0,
    avgHarvestsPerFarmer: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchHarvests();
    fetchFarmers();
  }, []);

  useEffect(() => {
    if (harvests.length && farmers.length) {
      calculateStats();
    }
  }, [harvests, farmers]);

  const calculateStats = () => {
    // Calculate total value of all harvests
    const totalValue = harvests.reduce((sum, harvest) => {
      return sum + (harvest.pricePerUnit * harvest.estimatedQuantity);
    }, 0);
    
    // Calculate average harvests per farmer
    const avgHarvestsPerFarmer = harvests.length / farmers.length;
    
    setStats({
      totalValue,
      avgHarvestsPerFarmer
    });
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortedItems = (items, sortKey, filterKey) => {
    let sortableItems = [...items];
    
    // Apply filtering first
    if (filterKey === 'harvests') {
      if (activeFilters.harvests.cropType) {
        sortableItems = sortableItems.filter(
          h => h.cropType === activeFilters.harvests.cropType
        );
      }
      if (activeFilters.harvests.plantingDate) {
        sortableItems = sortableItems.filter(
          h => new Date(h.plantingDate).toDateString() === new Date(activeFilters.harvests.plantingDate).toDateString()
        );
      }
    } else if (filterKey === 'farmers') {
      if (activeFilters.farmers.createdAt) {
        sortableItems = sortableItems.filter(
          f => new Date(f.createdAt).toDateString() === new Date(activeFilters.farmers.createdAt).toDateString()
        );
      }
    }
    
    // Then apply sorting
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        // Handle nested properties
        let aValue = a;
        let bValue = b;
        
        if (sortConfig.key.includes('.')) {
          const keys = sortConfig.key.split('.');
          aValue = keys.reduce((obj, key) => obj && obj[key], a);
          bValue = keys.reduce((obj, key) => obj && obj[key], b);
        } else {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        }
        
        // Handle date comparisons
        if (sortConfig.key === 'plantingDate' || sortConfig.key === 'createdAt' || sortConfig.key === 'farmerId.createdAt') {
          const dateA = new Date(aValue);
          const dateB = new Date(bValue);
          return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA;
        }
        
        // Handle regular string/number comparisons
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  };

  const filteredHarvests = harvests.filter(
    (h) =>
      h.cropName.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
      (h.cropType &&
        h.cropType.toLowerCase().includes(modalSearchTerm.toLowerCase())) ||
      (h.farmerId?.name &&
        h.farmerId.name.toLowerCase().includes(modalSearchTerm.toLowerCase()))
  );

  const filteredFarmers = farmers.filter(
    (f) =>
      f.name.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
      f.email.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
      (f.phone && f.phone.toLowerCase().includes(modalSearchTerm.toLowerCase()))
  );

  const sortedAndFilteredHarvests = getSortedItems(filteredHarvests, sortConfig.key, 'harvests');
  const sortedAndFilteredFarmers = getSortedItems(filteredFarmers, sortConfig.key, 'farmers');

  const handleFilterChange = (type, key, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: value === 'all' ? null : value
      }
    }));
  };

  const fetchHarvests = async () => {
    try {
      setLoading(prev => ({...prev, harvests: true}));
      const res = await axios.get(`${API_URL}/admin/harvests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHarvests(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch harvests");
    } finally {
      setLoading(prev => ({...prev, harvests: false}));
    }
  };

  const fetchFarmers = async () => {
    try {
      setLoading(prev => ({...prev, farmers: true}));
      const res = await axios.get(`${API_URL}/admin/farmers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFarmers(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch farmers");
    } finally {
      setLoading(prev => ({...prev, farmers: false}));
    }
  };

  const handleDeleteHarvest = async (harvestId) => {
    if (!window.confirm("Are you sure you want to delete this harvest?"))
      return;
    try {
      await axios.delete(
        `${API_URL}/admin/harvests/${harvestId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Harvest deleted successfully");
      fetchHarvests();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete harvest");
    }
  };

  const handleDeleteFarmer = async (farmerId) => {
    if (!window.confirm("Are you sure you want to delete this farmer?")) return;
    try {
      await axios.delete(`${API_URL}/admin/farmers/${farmerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Farmer deleted successfully");
      fetchFarmers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete farmer");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.replace("/admin/login");
  };

  const cropTypeData = Array.from(
    harvests.reduce((map, h) => {
      map.set(h.cropType, (map.get(h.cropType) || 0) + 1);
      return map;
    }, new Map()),
    ([name, value]) => ({ name, value })
  );

  // Get unique values for filters
  const uniqueCropTypes = [...new Set(harvests.map(h => h.cropType))];
  const uniqueHarvestDates = [...new Set(harvests.map(h => h.plantingDate))];
  const uniqueFarmerDates = [...new Set(farmers.map(f => f.createdAt))];

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400">Manage farmers and harvests</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 border border-gray-700"
        >
          <FiLogOut />
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div
          className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-xl shadow-lg border border-gray-700 cursor-pointer hover:border-indigo-500 transition-all duration-300 group"
          onClick={() => {
            setModalType("harvests");
            setIsModalOpen(true);
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Harvests</p>
              <h3 className="text-2xl font-bold text-white mt-1">{harvests.length}</h3>
              <p className="text-xs text-gray-500 mt-2">{sortedAndFilteredHarvests.length} filtered</p>
            </div>
            <div className="bg-indigo-500/20 p-3 rounded-lg group-hover:bg-indigo-500/30 transition-colors">
              <FiPackage className="text-indigo-400 text-xl" />
            </div>
          </div>
        </div>
        
        <div
          className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-xl shadow-lg border border-gray-700 cursor-pointer hover:border-green-500 transition-all duration-300 group"
          onClick={() => {
            setModalType("farmers");
            setIsModalOpen(true);
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Farmers</p>
              <h3 className="text-2xl font-bold text-white mt-1">{farmers.length}</h3>
              <p className="text-xs text-gray-500 mt-2">{sortedAndFilteredFarmers.length} filtered</p>
            </div>
            <div className="bg-green-500/20 p-3 rounded-lg group-hover:bg-green-500/30 transition-colors">
              <FiUsers className="text-green-400 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-xl shadow-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Value</p>
              <h3 className="text-2xl font-bold text-white mt-1">{formatCurrency(stats.totalValue)}</h3>
              <p className="text-xs text-gray-500 mt-2">All harvests</p>
            </div>
            <div className="bg-amber-500/20 p-3 rounded-lg">
              <FiDollarSign className="text-amber-400 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-xl shadow-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Avg/Farmer</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stats.avgHarvestsPerFarmer.toFixed(1)}</h3>
              <p className="text-xs text-gray-500 mt-2">Harvests per farmer</p>
            </div>
            <div className="bg-purple-500/20 p-3 rounded-lg">
              <FiBarChart2 className="text-purple-400 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-semibold text-white">Crop Distribution</h3>
            <FiBarChart2 className="text-indigo-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={cropTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {cropTypeData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1f2937',
                  borderColor: '#374151',
                  borderRadius: '0.5rem',
                  color: '#f3f4f6'
                }}
              />
              <Legend 
                wrapperStyle={{ color: '#f3f4f6', fontSize: '12px' }}
                layout="vertical"
                verticalAlign="middle"
                align="right"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-semibold text-white">Harvest Timeline</h3>
            <FiCalendar className="text-green-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={harvests.slice(0, 7).map(h => ({
                name: h.cropName,
                value: h.estimatedQuantity,
                date: new Date(h.plantingDate).toLocaleDateString()
              }))}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1f2937',
                  borderColor: '#374151',
                  borderRadius: '0.5rem',
                  color: '#f3f4f6'
                }}
              />
              <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => { setModalType("harvests"); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            <FiPackage size={16} />
            View Harvests
          </button>
          <button 
            onClick={() => { setModalType("farmers"); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <FiUsers size={16} />
            View Farmers
          </button>
          <button 
            onClick={fetchHarvests}
            disabled={loading.harvests}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <FiRefreshCw size={16} className={loading.harvests ? "animate-spin" : ""} />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-start p-4 overflow-y-auto z-50">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 p-6 rounded-xl shadow-lg w-full max-w-6xl relative border border-gray-700 mt-10">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                {modalType === "harvests" ? (
                  <>
                    <FiPackage className="text-indigo-400" />
                    Harvest Management
                  </>
                ) : (
                  <>
                    <FiUsers className="text-green-400" />
                    Farmer Management
                  </>
                )}
              </h2>
              <button
                className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                <FiX className="text-gray-400 hover:text-white text-lg" />
              </button>
            </div>

            <div className="mb-5 flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={`Search ${modalType}...`}
                  value={modalSearchTerm}
                  onChange={(e) => setModalSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-700 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
                />
              </div>

              {modalType === "harvests" && (
                <div className="flex gap-2 flex-wrap">
                  <div className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-lg border border-gray-600">
                    <FiFilter className="text-gray-400" />
                    <select
                      onChange={(e) => handleFilterChange('harvests', 'cropType', e.target.value)}
                      className="bg-gray-700 text-white text-sm focus:outline-none"
                    >
                      <option value="all">All Crops</option>
                      {uniqueCropTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-lg border border-gray-600">
                    <FiCalendar className="text-gray-400" />
                    <select
                      onChange={(e) => handleFilterChange('harvests', 'plantingDate', e.target.value)}
                      className="bg-gray-700 text-white text-sm focus:outline-none"
                    >
                      <option value="all">All Dates</option>
                      {uniqueHarvestDates.map(date => (
                        <option key={date} value={date}>
                          {new Date(date).toLocaleDateString()}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {modalType === "farmers" && (
                <div className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-lg border border-gray-600">
                  <FiCalendar className="text-gray-400" />
                  <select
                    onChange={(e) => handleFilterChange('farmers', 'createdAt', e.target.value)}
                    className="bg-gray-700 text-white text-sm focus:outline-none"
                  >
                    <option value="all">All Dates</option>
                    {uniqueFarmerDates.map(date => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-700">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-750">
                  <tr>
                    {modalType === "harvests" ? (
                      <>
                        <th 
                          className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700 transition-colors"
                          onClick={() => requestSort('cropName')}
                        >
                          <div className="flex items-center gap-1">
                            Crop Name
                            {sortConfig.key === 'cropName' && (
                              sortConfig.direction === 'ascending' ? 
                                <FiChevronUp className="text-indigo-400" /> : <FiChevronDown className="text-indigo-400" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700 transition-colors"
                          onClick={() => requestSort('cropType')}
                        >
                          <div className="flex items-center gap-1">
                            Type
                            {sortConfig.key === 'cropType' && (
                              sortConfig.direction === 'ascending' ? 
                                <FiChevronUp className="text-indigo-400" /> : <FiChevronDown className="text-indigo-400" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700 transition-colors"
                          onClick={() => requestSort('estimatedQuantity')}
                        >
                          <div className="flex items-center gap-1">
                            Quantity
                            {sortConfig.key === 'estimatedQuantity' && (
                              sortConfig.direction === 'ascending' ? 
                                <FiChevronUp className="text-indigo-400" /> : <FiChevronDown className="text-indigo-400" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700 transition-colors"
                          onClick={() => requestSort('plantingDate')}
                        >
                          <div className="flex items-center gap-1">
                            <FiCalendar className="text-gray-400" />
                            Date
                            {sortConfig.key === 'plantingDate' && (
                              sortConfig.direction === 'ascending' ? 
                                <FiChevronUp className="text-indigo-400" /> : <FiChevronDown className="text-indigo-400" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700 transition-colors"
                          onClick={() => requestSort('farmerId.name')}
                        >
                          <div className="flex items-center gap-1">
                            <FiUser className="text-gray-400" />
                            Farmer
                            {sortConfig.key === 'farmerId.name' && (
                              sortConfig.direction === 'ascending' ? 
                                <FiChevronUp className="text-indigo-400" /> : <FiChevronDown className="text-indigo-400" />
                            )}
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </>
                    ) : (
                      <>
                        <th 
                          className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700 transition-colors"
                          onClick={() => requestSort('name')}
                        >
                          <div className="flex items-center gap-1">
                            Name
                            {sortConfig.key === 'name' && (
                              sortConfig.direction === 'ascending' ? 
                                <FiChevronUp className="text-indigo-400" /> : <FiChevronDown className="text-indigo-400" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700 transition-colors"
                          onClick={() => requestSort('email')}
                        >
                          <div className="flex items-center gap-1">
                            Email
                            {sortConfig.key === 'email' && (
                              sortConfig.direction === 'ascending' ? 
                                <FiChevronUp className="text-indigo-400" /> : <FiChevronDown className="text-indigo-400" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700 transition-colors"
                          onClick={() => requestSort('createdAt')}
                        >
                          <div className="flex items-center gap-1">
                            <FiCalendar className="text-gray-400" />
                            Joined
                            {sortConfig.key === 'createdAt' && (
                              sortConfig.direction === 'ascending' ? 
                                <FiChevronUp className="text-indigo-400" /> : <FiChevronDown className="text-indigo-400" />
                            )}
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {modalType === "harvests" ? (
                    sortedAndFilteredHarvests.length > 0 ? (
                      sortedAndFilteredHarvests.map((h) => (
                        <tr key={h._id} className="hover:bg-gray-750 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">
                            {h.cropName}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                            <span className="bg-gray-700 px-2 py-1 rounded-md text-xs">{h.cropType}</span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                            {h.estimatedQuantity} {h.unit}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                            {new Date(h.plantingDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                            {h.farmerId ? (
                              <div className="flex items-center gap-2">
                                <div className="bg-green-400/10 p-1.5 rounded-lg">
                                  <FiUser className="text-green-400 text-xs" />
                                </div>
                                <div>
                                  <div className="text-green-400 font-medium">{h.farmerId.name}</div>
                                  <div className="text-xs text-gray-400">{h.farmerId.email}</div>
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-500">No farmer</span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                            <div className="flex gap-2">
                              <button
                                onClick={() => navigate(`/harvest/${h._id}`)}
                                className="text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-blue-400/10 hover:bg-blue-400/20 px-2 py-1.5 rounded-md transition-colors"
                                title="View details"
                              >
                                <FiEye size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteHarvest(h._id)}
                                className="text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-400/10 hover:bg-red-400/20 px-2 py-1.5 rounded-md transition-colors"
                                title="Delete harvest"
                              >
                                <FiTrash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-4 py-8 text-center text-gray-400">
                          <FiPackage className="inline-block text-3xl mb-2 opacity-50" />
                          <p>No harvests found matching your criteria</p>
                        </td>
                      </tr>
                    )
                  ) : sortedAndFilteredFarmers.length > 0 ? (
                    sortedAndFilteredFarmers.map((f) => (
                      <tr key={f._id} className="hover:bg-gray-750 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="bg-green-400/10 p-2 rounded-lg">
                              <FiUser className="text-green-400" />
                            </div>
                            <div>
                              <div className="font-medium text-white">{f.name}</div>
                              <div className="text-xs text-gray-400">{f.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                          {f.email}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                          {new Date(f.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate(`/farmer/${f._id}`)}
                              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-blue-400/10 hover:bg-blue-400/20 px-2 py-1.5 rounded-md transition-colors"
                              title="View profile"
                            >
                              <FiEye size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteFarmer(f._id)}
                              className="text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-400/10 hover:bg-red-400/20 px-2 py-1.5 rounded-md transition-colors"
                              title="Delete farmer"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-gray-400">
                        <FiUsers className="inline-block text-3xl mb-2 opacity-50" />
                        <p>No farmers found matching your criteria</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;