import React, { useEffect, useState } from "react";
import HarvestList from "./HarvestList1";
import HarvestForm from "./HarvestForm";
import { API_URL } from "../config";
import FarmerProfile from "./FarmerProfile1";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faArrowLeft, 
  faLeaf, 
  faList, 
  faPlus,
  faSpinner,
  faCircleNotch,
  faUser,
  faBoxOpen,
  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";

const FarmerDashboard = () => {
  const [farmer, setFarmer] = useState(null);
  const [harvests, setHarvests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingHarvest, setEditingHarvest] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [harvestsLoading, setHarvestsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Clear messages after a delay
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("Please log in to access your dashboard");
      return;
    }

    const fetchData = async () => {
      try {
        setProfileLoading(true);
        setHarvestsLoading(true);
        
        const [profileRes, harvestRes] = await Promise.allSettled([
          fetch(`${API_URL}/farmer/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          // Harvests will be fetched after we get farmer data
          Promise.resolve() // placeholder
        ]);

        // Handle profile fetch result
        if (profileRes.status === "fulfilled" && profileRes.value.ok) {
          const farmerData = await profileRes.value.json();
          setFarmer(farmerData);

          // Now fetch harvests for this farmer
          try {
            const harvestResponse = await fetch(
              `${API_URL}/harvests/farmer/${farmerData._id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            
            if (harvestResponse.ok) {
              const harvestData = await harvestResponse.json();
              setHarvests(harvestData);
            } else {
              console.error("Failed to fetch harvests");
            }
          } catch (harvestError) {
            console.error("Harvest fetch error:", harvestError);
          }
        } else {
          throw new Error("Failed to fetch farmer profile");
        }
      } catch (error) {
        console.error("Dashboard error:", error.message);
        setError("Session expired or unauthorized. Please log in again.");
        localStorage.removeItem("token");
        setTimeout(() => navigate("/login"), 2000);
      } finally {
        setLoading(false);
        setProfileLoading(false);
        setHarvestsLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  const handlePost = (newHarvest) => {
    setHarvests((prev) => [newHarvest, ...prev]);
    setSuccess("Harvest posted successfully!");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this harvest? This action cannot be undone.")) return;
    
    try {
      setDeletingId(id);
      const res = await fetch(`${API_URL}/harvests/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error("Failed to delete harvest");
      
      setHarvests((prev) => prev.filter((h) => h._id !== id));
      setSuccess("Harvest deleted successfully!");
    } catch (error) {
      setError("Error deleting harvest: " + error.message);
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
    setSuccess("Harvest updated successfully!");
  };

  const handleProfileUpdate = (updatedFarmer) => {
    setFarmer(updatedFarmer);
    setSuccess("Profile updated successfully!");
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
      <FontAwesomeIcon 
        icon={faCircleNotch} 
        className="text-green-400 text-5xl animate-spin mb-4" 
      />
      <p className="text-gray-300 text-lg">Loading your dashboard...</p>
    </div>
  );

  if (!token || !farmer) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <FontAwesomeIcon 
            icon={faExclamationTriangle} 
            className="text-yellow-400 text-5xl mb-4" 
          />
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-gray-300 mb-6">
            {error || "Please log in to view your dashboard"}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/login"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200 text-center"
            >
              Log In
            </Link>
            <Link
              to="/"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 text-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      {/* Notification messages */}
      {(error || success) && (
        <div className={`fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg shadow-lg ${
          error ? "bg-red-800 text-red-100" : "bg-green-800 text-green-100"
        }`}>
          <div className="flex items-start">
            <FontAwesomeIcon 
              icon={error ? faExclamationTriangle : faCircleNotch} 
              className="mt-1 mr-3" 
            />
            <div>
              <p className="font-medium">{error ? "Error" : "Success"}</p>
              <p className="text-sm mt-1">{error || success}</p>
            </div>
            <button 
              onClick={() => { setError(""); setSuccess(""); }}
              className="ml-4 text-xl hover:opacity-70"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center mb-6 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200 border border-gray-700"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold mb-8 flex items-center justify-center md:justify-start">
          <span className="bg-gradient-to-r from-green-400 to-green-600 p-3 rounded-full mr-3">
            <FontAwesomeIcon icon={faLeaf} />
          </span>
          <span>Farmer Dashboard</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Profile Section */}
          <section className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-6 flex items-center pb-3 border-b border-gray-700">
              <span className="bg-green-900 p-2 rounded-lg mr-3">
                <FontAwesomeIcon icon={faUser} className="text-green-400" />
              </span>
              Your Profile
            </h2>
            {profileLoading ? (
              <div className="flex justify-center py-8">
                <FontAwesomeIcon 
                  icon={faSpinner} 
                  className="text-green-400 text-2xl animate-spin" 
                />
              </div>
            ) : (
              <FarmerProfile farmer={farmer} onUpdate={handleProfileUpdate} />
            )}
          </section>

          {/* Harvest Form Section */}
          <section className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-6 flex items-center pb-3 border-b border-gray-700">
              <span className="bg-green-900 p-2 rounded-lg mr-3">
                <FontAwesomeIcon 
                  icon={editingHarvest ? faList : faPlus} 
                  className="text-green-400"
                />
              </span>
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
        </div>

        {/* Harvests List Section */}
        <section className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-6 flex items-center pb-3 border-b border-gray-700">
            <span className="bg-green-900 p-2 rounded-lg mr-3">
              <FontAwesomeIcon icon={faList} className="text-green-400" />
            </span>
            Your Harvests
            {harvests.length > 0 && (
              <span className="ml-3 bg-green-900 text-green-300 text-sm px-3 py-1 rounded-full">
                {harvests.length} {harvests.length === 1 ? 'item' : 'items'}
              </span>
            )}
          </h2>
          
          {harvestsLoading ? (
            <div className="flex justify-center py-8">
              <FontAwesomeIcon 
                icon={faSpinner} 
                className="text-green-400 text-2xl animate-spin" 
              />
            </div>
          ) : harvests.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <FontAwesomeIcon icon={faBoxOpen} className="text-4xl mb-4 opacity-50" />
              <p className="text-lg">No harvests posted yet</p>
              <p className="mt-2">Use the form above to add your first harvest!</p>
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
    </div>
  );
};

export default FarmerDashboard;