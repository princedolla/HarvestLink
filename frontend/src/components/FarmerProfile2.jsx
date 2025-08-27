import React, { useEffect, useState } from "react";
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
  faChevronRight
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

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/harvests/farmer/${farmerId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((data) => {
        if (data.length > 0) {
          setFarmer(data[0].farmerId);
        } else {
          setFarmer(null);
        }
        setHarvests(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [farmerId]);

  const openImageModal = (harvest, index = 0) => {
    setSelectedHarvest(harvest);
    setCurrentImageIndex(index);
  };

  const closeImageModal = () => {
    setSelectedHarvest(null);
    setCurrentImageIndex(0);
  };

  const navigateImage = (direction) => {
    const images = selectedHarvest.imageUrls;
    if (direction === 'prev') {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    } else {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const openDescriptionModal = (description) => {
    setCurrentDescription(description);
    setShowDescriptionModal(true);
  };

  const closeDescriptionModal = () => {
    setShowDescriptionModal(false);
    setCurrentDescription("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon 
            icon={faSpinner} 
            className="text-4xl text-green-500 animate-spin mb-4" 
          />
          <p className="text-lg text-gray-300">Loading farmer profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center p-6 max-w-md mx-auto bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-400 mb-4">Error Loading Profile</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!farmer) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center p-6 max-w-md mx-auto bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-300 mb-4">Farmer Not Found</h2>
          <p className="text-gray-400 mb-6">The requested farmer profile could not be found.</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-4 px-3 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center mb-4 px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition border border-gray-700 text-sm"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-1.5" />
          Back to Home
        </Link>

        {/* Farmer Profile Card */}
        <div className="bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-4 p-3 sm:p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={farmer.profileImage || "images/default-profile.jpg"}
                alt={farmer.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-green-600"
              />
              <div className="absolute -bottom-1 -right-1 bg-green-600 text-white rounded-full p-1 text-xs">
                <FontAwesomeIcon icon={faLeaf} />
              </div>
            </div>
            
            <div className="flex-1">
              <h2 className="text-base sm:text-lg font-bold text-gray-100">{farmer.name}</h2>
              {farmer.location && (
                <p className="text-xs text-gray-400 mt-1">
                  {farmer.location}
                </p>
              )}
              
              <div className="mt-2 flex flex-wrap gap-1 sm:gap-2">
                <a
                  href={`tel:${farmer.phone}`}
                  className="flex items-center px-2 py-1 sm:px-3 sm:py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition"
                >
                  <FontAwesomeIcon icon={faPhone} className="mr-1 sm:mr-1.5" />
                  Call
                </a>
                <a
                  href={`sms:${farmer.phone}?body=Hello%20${farmer.name},%20I'm%20interested%20in%20your%20harvest`}
                  className="flex items-center px-2 py-1 sm:px-3 sm:py-1.5 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition"
                >
                  <FontAwesomeIcon icon={faComment} className="mr-1 sm:mr-1.5" />
                  SMS
                </a>
                <a
                  href={`https://wa.me/${farmer.phone.replace("+", "")}?text=Hello%20${farmer.name},%20I'm%20interested%20in%20your%20harvest`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-2 py-1 sm:px-3 sm:py-1.5 bg-[#25D366] text-white rounded text-xs hover:bg-[#1DA851] transition"
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="mr-1 sm:mr-1.5" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Harvests Section */}
        <div className="mb-4">
          <h3 className="text-base sm:text-lg font-bold text-gray-100 mb-3 flex items-center">
            <FontAwesomeIcon icon={faLeaf} className="mr-2 text-green-500 text-sm" />
            Available Harvests
          </h3>
          
          {harvests.length === 0 ? (
            <div className="bg-gray-800 rounded-lg shadow-sm p-3 text-center text-sm text-gray-400 border border-gray-700">
              No harvests available at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
              {harvests.map((harvest) => (
                <div key={harvest._id} className="bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition overflow-hidden border border-green-700">
                  {harvest.imageUrls?.length > 0 && (
                    <div className="relative pt-[65%] overflow-hidden">
                      {harvest.imageUrls.map((imgUrl, index) => (
                        <img
                          key={index}
                          src={imgUrl}
                          alt={harvest.cropName}
                          className={`absolute top-0 left-0 h-full w-full object-cover cursor-pointer transition-opacity duration-300 ${index === 0 ? 'opacity-100' : 'opacity-0'}`}
                          onClick={() => openImageModal(harvest, index)}
                        />
                      ))}
                    </div>
                  )}
                  <div className="p-2 sm:p-3">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-100 line-clamp-1">{harvest.cropName}</h4>
                      <span className="text-xs bg-green-900 text-green-300 px-1 py-0.5 rounded whitespace-nowrap">
                        {harvest.cropType}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-xs text-gray-400">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faWeightHanging} className="mr-1 text-gray-500" />
                        {harvest.estimatedQuantity} {harvest.unit}
                      </div>
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faMoneyBillWave} className="mr-1 text-gray-500" />
                        {harvest.pricePerUnit} {harvest.currency}
                      </div>
                      {harvest.expectedHarvestDate && (
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faCalendarAlt} className="mr-1 text-gray-500" />
                          {new Date(harvest.expectedHarvestDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    
                    {harvest.description && (
                      <div className="mt-1 sm:mt-2">
                        <p className="text-xs text-gray-400 line-clamp-2">
                          {harvest.description.length > 15
                            ? `${harvest.description.substring(0, 15)}... `
                            : harvest.description}
                        </p>
                        {harvest.description.length > 15 && (
                          <button 
                            onClick={() => openDescriptionModal(harvest.description)}
                            className="text-xs text-green-500 hover:text-green-400 cursor-pointer"
                          >
                            Read more...
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Image Modal with Slideshow */}
      {selectedHarvest && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-3">
          <button
            onClick={closeImageModal}
            className="absolute top-3 right-3 text-white text-xl hover:text-gray-300 z-10 bg-gray-800 rounded-full p-1 w-7 h-7 flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faTimes} className="text-sm" />
          </button>
          
          <div className="relative w-full max-w-4xl max-h-[90vh]">
            {/* Navigation Arrows */}
            {selectedHarvest.imageUrls.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('prev');
                  }}
                  className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 sm:p-3 rounded-full hover:bg-black/70 z-10"
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('next');
                  }}
                  className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 sm:p-3 rounded-full hover:bg-black/70 z-10"
                >
                  <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
                </button>
              </>
            )}
            
            {/* Current Image */}
            <img
              src={selectedHarvest.imageUrls[currentImageIndex]}
              alt={`${selectedHarvest.cropName} - ${currentImageIndex + 1}`}
              className="max-h-[70vh] max-w-full mx-auto object-contain"
            />
            
            {/* Image Counter */}
            {selectedHarvest.imageUrls.length > 1 && (
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                {currentImageIndex + 1} / {selectedHarvest.imageUrls.length}
              </div>
            )}
            
            {/* Thumbnail Navigation */}
            {selectedHarvest.imageUrls.length > 1 && (
              <div className="flex justify-center mt-3 space-x-1 sm:space-x-2">
                {selectedHarvest.imageUrls.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-gray-500'}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Description Modal */}
      {showDescriptionModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-3">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-700 mx-3">
            <div className="flex justify-between items-center p-3 border-b border-gray-700">
              <h3 className="text-base sm:text-lg font-semibold text-white">Full Description</h3>
              <button
                onClick={closeDescriptionModal}
                className="text-gray-400 hover:text-white bg-gray-700 rounded-full p-1 w-6 h-6 flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faTimes} className="text-xs" />
              </button>
            </div>
            <div className="p-3 sm:p-4 text-gray-300 whitespace-pre-line text-sm">
              {currentDescription}
            </div>
            <div className="p-3 border-t border-gray-700 flex justify-end">
              <button
                onClick={closeDescriptionModal}
                className="px-3 py-1.5 bg-green-600 hover:bg-green-500 rounded text-white text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerProfile;