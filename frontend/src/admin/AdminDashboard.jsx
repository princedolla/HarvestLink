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
  FiUser
} from "react-icons/fi";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F"];
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
  const navigate = useNavigate();

  useEffect(() => {
    fetchHarvests();
    fetchFarmers();
  }, []);

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
        // Handle date comparisons
        if (sortConfig.key === 'plantingDate' || sortConfig.key === 'createdAt') {
          const dateA = new Date(a[sortConfig.key]);
          const dateB = new Date(b[sortConfig.key]);
          return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA;
        }
        
        // Handle regular string/number comparisons
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
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
      const res = await axios.get(`${API_URL}/admin/harvests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHarvests(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch harvests");
    }
  };

  const fetchFarmers = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/farmers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFarmers(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch farmers");
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

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="bg-blue-600 p-2 rounded-lg">
            <FiTrendingUp className="text-white" />
          </span>
          Admin Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2"
        >
          <FiLogOut />
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div
          className="bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-700 transition-colors duration-200 group"
          onClick={() => {
            setModalType("harvests");
            setIsModalOpen(true);
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm text-gray-400">Total Harvests</h4>
              <p className="text-2xl font-bold text-white">{harvests.length}</p>
            </div>
            <div className="bg-blue-600 p-3 rounded-lg group-hover:bg-blue-500 transition-colors">
              <FiTrendingUp className="text-white text-xl" />
            </div>
          </div>
        </div>
        
        <div
          className="bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-700 transition-colors duration-200 group"
          onClick={() => {
            setModalType("farmers");
            setIsModalOpen(true);
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm text-gray-400">Total Farmers</h4>
              <p className="text-2xl font-bold text-white">{farmers.length}</p>
            </div>
            <div className="bg-green-600 p-3 rounded-lg group-hover:bg-green-500 transition-colors">
              <FiUsers className="text-white text-xl" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="bg-purple-600 p-2 rounded-lg">
            <FiTrendingUp className="text-white" />
          </span>
          Crop Type Distribution
        </h4>
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
              wrapperStyle={{ color: '#f3f4f6' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-start p-8 overflow-y-auto z-50">
          <div className="bg-gray-800 text-gray-100 p-6 rounded-lg shadow-lg w-full max-w-4xl relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                {modalType === "harvests" ? (
                  <>
                    <FiTrendingUp className="text-blue-400" />
                    Harvests List
                  </>
                ) : (
                  <>
                    <FiUsers className="text-green-400" />
                    Farmers List
                  </>
                )}
              </h2>
              <button
                className="p-1 rounded-full hover:bg-gray-700 transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                <FiX className="text-gray-400 hover:text-white text-xl" />
              </button>
            </div>

            <div className="mb-4 flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={`Search ${
                    modalType === "harvests" ? "harvests" : "farmers"
                  }...`}
                  value={modalSearchTerm}
                  onChange={(e) => setModalSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {modalType === "harvests" && (
                <div className="flex gap-2 flex-wrap">
                  <div className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-lg">
                    <FiFilter className="text-gray-400" />
                    <select
                      onChange={(e) => handleFilterChange('harvests', 'cropType', e.target.value)}
                      className="bg-gray-700 text-white text-sm focus:outline-none"
                    >
                      <option value="all">All Crop Types</option>
                      {uniqueCropTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-lg">
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
                <div className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-lg">
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

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    {modalType === "harvests" ? (
                      <>
                        <th 
                          className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort('cropName')}
                        >
                          <div className="flex items-center gap-1">
                            Crop Name
                            {sortConfig.key === 'cropName' && (
                              sortConfig.direction === 'ascending' ? 
                                <FiChevronUp /> : <FiChevronDown />
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort('cropType')}
                        >
                          <div className="flex items-center gap-1">
                            Crop Type
                            {sortConfig.key === 'cropType' && (
                              sortConfig.direction === 'ascending' ? 
                                <FiChevronUp /> : <FiChevronDown />
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort('estimatedQuantity')}
                        >
                          <div className="flex items-center gap-1">
                            Quantity
                            {sortConfig.key === 'estimatedQuantity' && (
                              sortConfig.direction === 'ascending' ? 
                                <FiChevronUp /> : <FiChevronDown />
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort('plantingDate')}
                        >
                          <div className="flex items-center gap-1">
                            <FiCalendar />
                            Planting Date
                            {sortConfig.key === 'plantingDate' && (
                              sortConfig.direction === 'ascending' ? 
                                <FiChevronUp /> : <FiChevronDown />
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort('farmerId.name')}
                        >
                          <div className="flex items-center gap-1">
                            <FiUser />
                            Farmer
                            {sortConfig.key === 'farmerId.name' && (
                              sortConfig.direction === 'ascending' ? 
                                <FiChevronUp /> : <FiChevronDown />
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
                          className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort('name')}
                        >
                          <div className="flex items-center gap-1">
                            Name
                            {sortConfig.key === 'name' && (
                              sortConfig.direction === 'ascending' ? 
                                <FiChevronUp /> : <FiChevronDown />
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort('email')}
                        >
                          <div className="flex items-center gap-1">
                            Email
                            {sortConfig.key === 'email' && (
                              sortConfig.direction === 'ascending' ? 
                                <FiChevronUp /> : <FiChevronDown />
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort('createdAt')}
                        >
                          <div className="flex items-center gap-1">
                            <FiCalendar />
                            Joined Date
                            {sortConfig.key === 'createdAt' && (
                              sortConfig.direction === 'ascending' ? 
                                <FiChevronUp /> : <FiChevronDown />
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
                        <tr key={h._id} className="hover:bg-gray-700">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-400">
                            {h.cropName}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                            {h.cropType}
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
                                <FiUser className="text-green-400" />
                                <span className="text-green-400">{h.farmerId.name}</span>
                                <span className="text-xs text-gray-400">({h.farmerId.email})</span>
                              </div>
                            ) : (
                              <span className="text-gray-500">No farmer assigned</span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                            <button
                              onClick={() => handleDeleteHarvest(h._id)}
                              className="text-red-400 hover:text-red-300 flex items-center gap-1"
                            >
                              <FiTrash2 size={14} />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-4 py-4 text-center text-gray-400">
                          No harvests found matching your criteria
                        </td>
                      </tr>
                    )
                  ) : sortedAndFilteredFarmers.length > 0 ? (
                    sortedAndFilteredFarmers.map((f) => (
                      <tr key={f._id} className="hover:bg-gray-700">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">
                          {f.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                          {f.email}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                          {new Date(f.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                          <div className="flex gap-3">
                            <button
                              onClick={() => navigate(`/farmer/${f._id}`)}
                              className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                            >
                              <FiEye size={14} />
                              View
                            </button>
                            <button
                              onClick={() => handleDeleteFarmer(f._id)}
                              className="text-red-400 hover:text-red-300 flex items-center gap-1"
                            >
                              <FiTrash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-4 py-4 text-center text-gray-400">
                        No farmers found matching your criteria
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