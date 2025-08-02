import React, { useEffect, useState } from "react";
import HarvestList from "./HarvestList1";
import HarvestForm from "./HarvestForm";
import { API_URL } from "../config";
import FarmerProfile from "./FarmerProfile1";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faArrowLeft, 
  faLeaf, 
  faList, 
  faPlus,
  faSpinner,
  faCircleNotch
} from "@fortawesome/free-solid-svg-icons";

const FarmerDashboard = () => {
  const [farmer, setFarmer] = useState(null);
  const [harvests, setHarvests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingHarvest, setEditingHarvest] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [harvestsLoading, setHarvestsLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setProfileLoading(true);
        setHarvestsLoading(true);
        
        const profileRes = await fetch(`${API_URL}/farmer/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!profileRes.ok) throw new Error("Failed to fetch farmer profile");
        const farmerData = await profileRes.json();
        setFarmer(farmerData);

        const harvestRes = await fetch(`${API_URL}/harvests/farmer/${farmerData._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!harvestRes.ok) throw new Error("Failed to fetch harvests");
        const harvestData = await harvestRes.json();
        setHarvests(harvestData);
      } catch (error) {
        console.error("Dashboard error:", error.message);
        alert("Session expired or unauthorized. Please log in again.");
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
        setProfileLoading(false);
        setHarvestsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handlePost = (newHarvest) => setHarvests((prev) => [newHarvest, ...prev]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this harvest?")) return;
    try {
      setDeletingId(id);
      const res = await fetch(`${API_URL}/harvests/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete harvest");
      setHarvests((prev) => prev.filter((h) => h._id !== id));
    } catch (error) {
      alert("Error deleting harvest: " + error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditClick = (harvest) => {
    setEditingHarvest(harvest);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = (updatedHarvest) => {
    setHarvests((prev) => prev.map((h) => (h._id === updatedHarvest._id ? updatedHarvest : h)));
    setEditingHarvest(null);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <FontAwesomeIcon 
        icon={faCircleNotch} 
        className="text-green-400 text-4xl animate-spin" 
      />
    </div>
  );

  if (!farmer) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-red-500 text-xl">
          Please log in to view your dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <Link
        to="/"
        className="inline-flex items-center mb-6 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Back to Home
      </Link>

      <h1 className="text-3xl font-bold text-center mb-8 flex items-center justify-center">
        <FontAwesomeIcon 
          icon={faLeaf} 
          className="text-green-400 mr-3 bg-gray-800 p-3 rounded-full" 
        />
        <span>Farmer Dashboard</span>
      </h1>

      <section className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        {profileLoading ? (
          <div className="flex justify-center py-8">
            <FontAwesomeIcon 
              icon={faSpinner} 
              className="text-green-400 text-2xl animate-spin" 
            />
          </div>
        ) : (
          <FarmerProfile farmer={farmer} />
        )}
      </section>

      <section className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <FontAwesomeIcon 
            icon={editingHarvest ? faList : faPlus} 
            className="text-green-400 mr-3 bg-gray-700 p-2 rounded-lg"
          />
          {editingHarvest ? "Edit Harvest" : "Post New Harvest"}
        </h2>
        <HarvestForm
          farmerId={farmer._id}
          token={token}
          onPost={handlePost}
          existingHarvest={editingHarvest}
          onUpdate={handleUpdate}
          onCancel={() => setEditingHarvest(null)}
        />
      </section>

      <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <FontAwesomeIcon 
            icon={faList} 
            className="text-green-400 mr-3 bg-gray-700 p-2 rounded-lg"
          />
          Your Harvests
        </h2>
        {harvestsLoading ? (
          <div className="flex justify-center py-8">
            <FontAwesomeIcon 
              icon={faSpinner} 
              className="text-green-400 text-2xl animate-spin" 
            />
          </div>
        ) : (
          <HarvestList
            harvests={harvests}
            onDelete={handleDelete}
            onEditClick={handleEditClick}
            deletingId={deletingId}
          />
        )}
      </section>
    </div>
  );
};

export default FarmerDashboard;