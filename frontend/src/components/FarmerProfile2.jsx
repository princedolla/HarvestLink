import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faPhone,
  faComment,
  faLeaf,
  faCalendarAlt,
  faWeightHanging,
  faMoneyBillWave,
  faSpinner,
  faTimes,
  faChevronLeft,
  faChevronRight,
  faUser,
  faMapMarkerAlt,
  faEnvelope,
  faEye,
  faHeart,
  faAngleDown,
  faStar,
  faSeedling,
  faTractor,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { API_URL } from "../config";

const FarmerProfile = () => {
  const { farmerId } = useParams();
  const [harvests, setHarvests] = useState([]);
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHarvest, setSelectedHarvest] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [currentDescription, setCurrentDescription] = useState("");
  const [favorites, setFavorites] = useState(new Set());
  const [expandedDescriptions, setExpandedDescriptions] = useState(new Set());
  const [expandedCrop, setExpandedCrop] = useState(null);
  const [visibleCrops, setVisibleCrops] = useState(6);

  // Fetch farmer data and harvests
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/harvests/farmer/${farmerId}`);
        
        if (!response.ok) throw new Error("Failed to fetch data");
        
        const data = await response.json();
        
        if (data.length > 0) {
          setFarmer(data[0].farmerId);
        } else {
          setFarmer(null);
        }
        setHarvests(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [farmerId]);

  // Modal handlers with useCallback
  const openImageModal = useCallback((harvest, index = 0) => {
    setSelectedHarvest(harvest);
    setCurrentImageIndex(index);
  }, []);

  const closeImageModal = useCallback(() => {
    setSelectedHarvest(null);
    setCurrentImageIndex(0);
  }, []);

  const navigateImage = useCallback((direction) => {
    if (!selectedHarvest || !selectedHarvest.imageUrls) return;
    
    setCurrentImageIndex(prevIndex => {
      const images = selectedHarvest.imageUrls;
      if (direction === 'prev') {
        return prevIndex === 0 ? images.length - 1 : prevIndex - 1;
      } else {
        return prevIndex === images.length - 1 ? 0 : prevIndex + 1;
      }
    });
  }, [selectedHarvest]);

  const openDescriptionModal = useCallback((description) => {
    setCurrentDescription(description);
    setShowDescriptionModal(true);
  }, []);

  const closeDescriptionModal = useCallback(() => {
    setShowDescriptionModal(false);
    setCurrentDescription("");
  }, []);

  // Toggle favorite
  const toggleFavorite = (harvestId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(harvestId)) {
        newFavorites.delete(harvestId);
      } else {
        newFavorites.add(harvestId);
      }
      return newFavorites;
    });
  };

  // Toggle description expansion
  const toggleDescription = (harvestId) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(harvestId)) {
        newSet.delete(harvestId);
      } else {
        newSet.add(harvestId);
      }
      return newSet;
    });
  };

  const loadMore = () => {
    setVisibleCrops((prev) => prev + 6);
  };

  const toggleExpandCrop = (cropName) => {
    setExpandedCrop(expandedCrop === cropName ? null : cropName);
  };

  // Handle keyboard navigation for image modal
  useEffect(() => {
    if (!selectedHarvest) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeImageModal();
      } else if (e.key === 'ArrowLeft') {
        navigateImage('prev');
      } else if (e.key === 'ArrowRight') {
        navigateImage('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedHarvest, closeImageModal, navigateImage]);

  // Group harvests by crop name
  const groupedHarvests = harvests.reduce((acc, harvest) => {
    const key = harvest.cropName;
    if (!acc[key]) acc[key] = [];
    acc[key].push(harvest);
    return acc;
  }, {});

  const sortedGroupKeys = Object.keys(groupedHarvests).sort();
  const paginatedKeys = sortedGroupKeys.slice(0, visibleCrops);

  // Format price with thousands separators
  const formatPrice = (price) => {
    return new Intl.NumberFormat().format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center p-6 bg-gray-900/80 backdrop-blur-md rounded-xl shadow border border-gray-800">
          <div className="relative">
            <FontAwesomeIcon 
              icon={faSpinner} 
              className="text-4xl text-green-500 animate-spin mb-3" 
            />
            <FontAwesomeIcon 
              icon={faSeedling} 
              className="text-xl text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
            />
          </div>
          <p className="text-sm text-gray-300 mt-3 font-medium">Loading farmer profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-3">
        <div className="text-center p-6 max-w-md mx-auto bg-gray-900/80 backdrop-blur-md rounded-xl shadow border border-red-800/30">
          <div className="w-14 h-14 mx-auto bg-red-900/30 rounded-full flex items-center justify-center mb-3 backdrop-blur-sm">
            <FontAwesomeIcon icon={faTimes} className="text-2xl text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-3">Error Loading Profile</h2>
          <p className="text-gray-400 text-sm mb-5">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow hover:shadow-md font-medium text-sm"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-1.5 text-xs" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!farmer) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-3">
        <div className="text-center p-6 max-w-md mx-auto bg-gray-900/80 backdrop-blur-md rounded-xl shadow border border-gray-800">
          <div className="w-14 h-14 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-3">
            <FontAwesomeIcon icon={faUser} className="text-2xl text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-3">Farmer Not Found</h2>
          <p className="text-gray-400 text-sm mb-5">The requested farmer profile could not be found.</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow hover:shadow-md font-medium text-sm"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-1.5 text-xs" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-4 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center mb-4 px-3 py-1.5 bg-gray-800 text-green-400 rounded-md hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow font-medium border border-gray-700 text-xs"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-1.5 text-xs" />
          Back to Home
        </Link>

        {/* Farmer Profile Card */}
        <FarmerCard farmer={farmer} />

        {/* Harvests Section */}
        <div className="mb-6 bg-gray-900/80 backdrop-blur-md rounded-lg p-3 shadow border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-white flex items-center">
              <FontAwesomeIcon icon={faLeaf} className="mr-1.5 text-green-500 bg-green-900/30 p-1 rounded-md backdrop-blur-sm text-xs" />
              Available Harvests 
              <span className="ml-1.5 bg-green-900/30 text-green-400 px-1.5 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm">
                {harvests.length}
              </span>
            </h3>
            
            {harvests.length > 0 && (
              <div className="flex items-center text-xs text-gray-400">
                <FontAwesomeIcon icon={faShieldAlt} className="mr-1 text-green-500 text-xs" />
                Verified Farmers
              </div>
            )}
          </div>
          
          {harvests.length === 0 ? (
            <div className="bg-gray-800/50 rounded-md p-4 text-center border border-gray-700 backdrop-blur-sm">
              <FontAwesomeIcon icon={faSeedling} className="text-2xl text-gray-600 mb-2" />
              <h4 className="text-sm font-medium text-gray-400 mb-1">No harvests available</h4>
              <p className="text-gray-500 text-xs">This farmer doesn't have any active harvests at the moment.</p>
            </div>
          ) : (
            <div className="mb-3">
              {paginatedKeys.map((cropName) => (
                <div key={cropName} className="mb-4 last:mb-0">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-base font-semibold flex items-center text-white">
                      <FontAwesomeIcon
                        icon={faLeaf}
                        className="text-green-500 mr-1.5 bg-green-900/30 p-1 rounded-md backdrop-blur-sm text-xs"
                      />
                      {cropName}
                      <span className="ml-1.5 text-xs text-gray-400 bg-gray-800 px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                        {groupedHarvests[cropName].length} listings
                      </span>
                    </h2>
                    {groupedHarvests[cropName].length > 1 && (
                      <button
                        onClick={() => toggleExpandCrop(cropName)}
                        className="text-green-400 hover:text-green-300 flex items-center text-xs bg-green-900/30 px-1.5 py-0.5 rounded transition-all hover:bg-green-900/50 font-medium backdrop-blur-sm"
                      >
                        {expandedCrop === cropName ? "Collapse" : "Expand"}
                        <FontAwesomeIcon
                          icon={faAngleDown}
                          className={`ml-1 transition-transform text-xs ${
                            expandedCrop === cropName ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  <div className="bg-gradient-to-r from-transparent via-green-900/30 to-transparent h-px rounded-full mb-3"></div>

                  <div
                    className={`relative ${
                      groupedHarvests[cropName].length > 1 &&
                      expandedCrop !== cropName
                        ? "overflow-x-auto scrollbar-hide pb-2"
                        : ""
                    }`}
                  >
                    <style jsx>{`
                      .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                      }
                      .scrollbar-hide {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                      }
                    `}</style>
                    <div
                      className={`${
                        expandedCrop === cropName
                          ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2"
                          : "flex space-x-2"
                      } ${expandedCrop === cropName ? "" : "min-w-max"}`}
                    >
                      {groupedHarvests[cropName].map((harvest) => (
                        <HarvestCard 
                          key={harvest._id} 
                          harvest={harvest} 
                          onImageClick={openImageModal}
                          onDescriptionClick={openDescriptionModal}
                          isFavorite={favorites.has(harvest._id)}
                          onToggleFavorite={toggleFavorite}
                          isExpanded={expandedDescriptions.has(harvest._id)}
                          onToggleDescription={toggleDescription}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {visibleCrops < sortedGroupKeys.length && (
            <div className="text-center mt-4">
              <button
                onClick={loadMore}
                className="px-3 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-md hover:from-green-700 hover:to-emerald-700 transition-all shadow hover:shadow flex items-center mx-auto font-medium text-xs"
              >
                Load More Crops
                <FontAwesomeIcon icon={faAngleDown} className="ml-1 text-xs" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal with Slideshow */}
      <ImageModal
        harvest={selectedHarvest}
        currentIndex={currentImageIndex}
        onClose={closeImageModal}
        onNavigate={navigateImage}
        onIndexChange={setCurrentImageIndex}
      />

      {/* Description Modal */}
      <DescriptionModal
        isOpen={showDescriptionModal}
        description={currentDescription}
        onClose={closeDescriptionModal}
      />
    </div>
  );
};

// Sub-components for better organization
const FarmerCard = ({ farmer }) => (
  <div className="bg-gray-900/80 backdrop-blur-md rounded-lg shadow overflow-hidden mb-4 p-3 border border-gray-800">
    <div className="flex flex-col md:flex-row items-start gap-3">
      <div className="relative">
        <div className="relative rounded-lg overflow-hidden">
          <img
            src={farmer.profileImage || "/images/default-profile.jpg"}
            alt={farmer.name}
            className="w-16 h-16 sm:w-20 sm:h-20 object-cover"
            onError={(e) => {
              e.target.src = "/images/default-profile.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-0.5 shadow text-xs">
          <FontAwesomeIcon icon={faLeaf} className="text-xs" />
        </div>
      </div>
      
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-1 mb-1.5">
          <h2 className="text-lg font-bold text-white flex items-center">
            <FontAwesomeIcon icon={faUser} className="mr-1 text-green-500 text-xs" />
            {farmer.name}
          </h2>
          <span className="bg-green-900/30 text-green-400 px-1.5 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm">
            Verified Farmer
          </span>
        </div>
        
        {farmer.location && (
          <p className="text-gray-400 mb-2 flex items-center text-xs">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1 text-green-500 text-xs" />
            {farmer.location}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 mt-3">
          <a
            href={`tel:${farmer.phone}`}
            className="flex items-center justify-center px-2.5 py-1.5 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700 transition-all shadow-sm hover:shadow font-medium"
          >
            <FontAwesomeIcon icon={faPhone} className="mr-1 text-xs" />
            Call Now
          </a>
          <a
            href={`sms:${farmer.phone}?body=Hello%20${encodeURIComponent(farmer.name)},%20I'm%20interested%20in%20your%20harvest`}
            className="flex items-center justify-center px-2.5 py-1.5 bg-gray-800 text-gray-300 rounded-md text-xs hover:bg-gray-700 transition-all shadow-sm hover:shadow font-medium"
          >
            <FontAwesomeIcon icon={faComment} className="mr-1 text-xs" />
            Send SMS
          </a>
          <a
            href={`https://wa.me/${farmer.phone.replace("+", "")}?text=Hello%20${encodeURIComponent(farmer.name)},%20I'm%20interested%20in%20your%20harvest`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-2.5 py-1.5 bg-[#25D366] text-white rounded-md text-xs hover:bg-[#1DA851] transition-all shadow-sm hover:shadow font-medium"
          >
            <FontAwesomeIcon icon={faWhatsapp} className="mr-1 text-xs" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  </div>
);

const HarvestCard = ({ 
  harvest, 
  onImageClick, 
  onDescriptionClick, 
  isFavorite, 
  onToggleFavorite,
  isExpanded,
  onToggleDescription
}) => {
  // Format price with thousands separators
  const formatPrice = (price) => {
    return new Intl.NumberFormat().format(price);
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700 hover:border-green-500/30 transition-all duration-300 hover:shadow w-full max-w-[180px]">
      {/* Image section */}
      {harvest.imageUrls?.length > 0 && (
        <div className="relative pt-[65%] overflow-hidden group">
          <img
            src={harvest.imageUrls[0]}
            alt={harvest.cropName}
            onClick={() => onImageClick(harvest, 0)}
            className="absolute top-0 left-0 h-full w-full object-cover cursor-pointer group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.src = "/images/default-harvest.jpg";
            }}
          />
          <div className="absolute top-1.5 right-1.5 flex gap-1">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(harvest._id);
              }}
              className="bg-gray-900/80 backdrop-blur-sm p-1 rounded-full hover:bg-red-500 transition-all shadow-sm text-xs"
            >
              <FontAwesomeIcon 
                icon={faHeart} 
                className={`${isFavorite ? "text-red-500" : "text-gray-400"} text-xs`} 
              />
            </button>
          </div>
          {harvest.imageUrls.length > 1 && (
            <div className="absolute bottom-1.5 right-1.5 bg-black/70 text-white px-1 py-0.5 rounded text-xs backdrop-blur-sm">
              +{harvest.imageUrls.length - 1}
            </div>
          )}
          <button 
            onClick={() => onImageClick(harvest, 0)}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-sm"
          >
            <div className="bg-gray-900/80 backdrop-blur-sm p-1 rounded-full text-xs">
              <FontAwesomeIcon icon={faEye} className="text-white text-xs" />
            </div>
          </button>
        </div>
      )}

      {/* Content section */}
      <div className="p-2">
        <div className="flex justify-between items-start mb-1.5">
          <span className="text-xs font-medium bg-green-900/30 text-green-400 px-1.5 py-0.5 rounded-full backdrop-blur-sm">
            {harvest.cropType}
          </span>
          <div className="text-right">
            <div className="text-sm font-bold text-green-400">
              {formatPrice(harvest.pricePerUnit)} {harvest.currency}
            </div>
            <div className="text-xs text-gray-500">per {harvest.unit}</div>
          </div>
        </div>

        <h3 className="font-semibold text-white mb-1 text-sm">{harvest.cropName}</h3>

        <div className="space-y-0.5 text-xs text-gray-400 mb-2">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faWeightHanging} className="mr-1 text-green-500 w-3" />
            <span className="font-medium">{harvest.estimatedQuantity}</span> {harvest.unit}
          </div>
          {harvest.expectedHarvestDate && (
            <div className="flex items-center">
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-1 text-green-500 w-3" />
              {new Date(harvest.expectedHarvestDate).toLocaleDateString()}
            </div>
          )}
        </div>

        {harvest.description && (
          <div className="mb-2">
            <p className="text-xs text-gray-400">
              {isExpanded 
                ? harvest.description
                : `${harvest.description.substring(0, 50)}${harvest.description.length > 50 ? '...' : ''}`
              }
            </p>
            {harvest.description.length > 50 && (
              <button
                onClick={() => onToggleDescription(harvest._id)}
                className="text-xs text-green-400 hover:text-green-300 cursor-pointer mt-0.5 font-medium"
              >
                {isExpanded ? 'Read less' : 'Read more'}
              </button>
            )}
          </div>
        )}

        <div className="flex gap-1">
          <button
            onClick={() => onDescriptionClick(harvest.description)}
            className="flex-1 flex items-center justify-center gap-0.5 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-md transition-all text-xs font-medium shadow-sm hover:shadow"
          >
            <FontAwesomeIcon icon={faEye} className="text-xs" />
            Details
          </button>
          <button className="p-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md transition-all shadow-sm hover:shadow text-xs">
            <FontAwesomeIcon icon={faEnvelope} className="text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ImageModal = ({ harvest, currentIndex, onClose, onNavigate, onIndexChange }) => {
  if (!harvest) return null;
  
  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-3">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-white text-lg hover:text-green-400 z-10 bg-gray-900/80 backdrop-blur-sm rounded-full p-1.5 w-8 h-8 flex items-center justify-center shadow"
        aria-label="Close modal"
      >
        <FontAwesomeIcon icon={faTimes} className="text-sm" />
      </button>
      
      <div className="relative w-full max-w-4xl max-h-[90vh]">
        {/* Navigation Arrows */}
        {harvest.imageUrls.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('prev');
              }}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-gray-900/80 backdrop-blur-sm text-white p-2 rounded-full hover:bg-gray-800 z-10 shadow"
              aria-label="Previous image"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('next');
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-900/80 backdrop-blur-sm text-white p-2 rounded-full hover:bg-gray-800 z-10 shadow"
              aria-label="Next image"
            >
              <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
            </button>
          </>
        )}
        
        {/* Current Image */}
        <img
          src={harvest.imageUrls[currentIndex]}
          alt={`${harvest.cropName} - ${currentIndex + 1}`}
          className="max-h-[70vh] max-w-full mx-auto object-contain rounded-md"
          loading="eager"
        />
        
        {/* Image Counter */}
        {harvest.imageUrls.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">
            {currentIndex + 1} / {harvest.imageUrls.length}
          </div>
        )}
        
        {/* Thumbnail Navigation */}
        {harvest.imageUrls.length > 1 && (
          <div className="flex justify-center mt-3 space-x-1.5">
            {harvest.imageUrls.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  onIndexChange(index);
                }}
                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-white scale-125' : 'bg-gray-500 hover:bg-gray-400'}`}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const DescriptionModal = ({ isOpen, description, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-3">
      <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto mx-3 shadow-xl border border-gray-800">
        <div className="flex justify-between items-center p-3 border-b border-gray-800">
          <h3 className="text-base font-semibold text-white flex items-center">
            <FontAwesomeIcon icon={faLeaf} className="mr-1.5 text-green-500 text-sm" />
            Product Description
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 bg-gray-800 rounded-full p-1 w-6 h-6 flex items-center justify-center hover:bg-gray-700 transition-colors text-xs"
            aria-label="Close modal"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xs" />
          </button>
        </div>
        <div className="p-3 text-gray-300 whitespace-pre-line leading-relaxed text-xs">
          {description}
        </div>
        <div className="p-3 border-t border-gray-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-md text-white font-medium shadow-sm hover:shadow transition-all text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;