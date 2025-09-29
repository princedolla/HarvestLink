import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilter,
  faSyncAlt,
  faChevronLeft,
  faChevronRight,
  faTimes,
  faUser,
  faCalendarAlt,
  faWeightHanging,
  faMoneyBillWave,
  faLeaf,
  faAngleDown,
  faSpinner,
  faEye,
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faStar,
  faHeart,
  faShare,
  faChartLine,
  faTruck,
  faCertificate,
} from "@fortawesome/free-solid-svg-icons";

const HarvestList = ({ harvests, loading }) => {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [minQuantity, setMinQuantity] = useState("");
  const [maxQuantity, setMaxQuantity] = useState("");
  const [sortDate, setSortDate] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCrops, setVisibleCrops] = useState(4);
  const [expandedCrop, setExpandedCrop] = useState(null);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [currentDescription, setCurrentDescription] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [expandedDescriptions, setExpandedDescriptions] = useState(new Set());

  // Constants
  const itemsPerPage = 12; // Increased items per page since cards are smaller

  // Effect to handle screen size changes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Effect to handle search/filter changes with loading state
  useEffect(() => {
    if (harvests.length > 0) {
      setSearchLoading(true);

      // Simulate a short delay to show loading state
      const timer = setTimeout(() => {
        setSearchLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [
    searchTerm,
    selectedType,
    selectedCurrency,
    minQuantity,
    maxQuantity,
    sortDate,
    harvests,
  ]);

  // Toggle favorite
  const toggleFavorite = (harvestId) => {
    setFavorites((prev) => {
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
    setExpandedDescriptions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(harvestId)) {
        newSet.delete(harvestId);
      } else {
        newSet.add(harvestId);
      }
      return newSet;
    });
  };

  // Filter and sort logic
  const filteredHarvests = harvests
    .filter((harvest) =>
      harvest.cropName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((harvest) =>
      selectedType ? harvest.cropType === selectedType : true
    )
    .filter((harvest) =>
      selectedCurrency ? harvest.currency === selectedCurrency : true
    )
    .filter((harvest) => {
      const quantity = parseFloat(harvest.estimatedQuantity);
      return (
        (!minQuantity || quantity >= parseFloat(minQuantity)) &&
        (!maxQuantity || quantity <= parseFloat(maxQuantity))
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.expectedHarvestDate);
      const dateB = new Date(b.expectedHarvestDate);
      return sortDate === "asc" ? dateA - dateB : dateB - dateA;
    });

  // Grouping logic
  const groupedHarvests = filteredHarvests.reduce((acc, harvest) => {
    const key = harvest.cropName;
    if (!acc[key]) acc[key] = [];
    acc[key].push(harvest);
    return acc;
  }, {});

  const sortedGroupKeys = Object.keys(groupedHarvests).sort();
  const totalItems = filteredHarvests.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedKeys = sortedGroupKeys.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handler functions
  const openModal = (images) => {
    setSelectedImages(images);
    setCurrentIndex(0);
  };

  const closeModal = () => setSelectedImages([]);
  const showNext = () =>
    setCurrentIndex((prev) => (prev + 1) % selectedImages.length);
  const showPrev = () =>
    setCurrentIndex(
      (prev) => (prev - 1 + selectedImages.length) % selectedImages.length
    );
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedType("");
    setSelectedCurrency("");
    setMinQuantity("");
    setMaxQuantity("");
    setSortDate("desc");
    setCurrentPage(1);
  };

  const loadMore = () => {
    setVisibleCrops((prev) => prev + 4);
  };

  const toggleExpandCrop = (cropName) => {
    setExpandedCrop(expandedCrop === cropName ? null : cropName);
  };

  const openDescriptionModal = (description) => {
    setCurrentDescription(description);
    setShowDescriptionModal(true);
  };

  const closeDescriptionModal = () => {
    setShowDescriptionModal(false);
    setCurrentDescription("");
  };

  // Format price with thousands separators
  const formatPrice = (price) => {
    return new Intl.NumberFormat().format(price);
  };

  if (loading) {
    return (
      <div className="w-full text-center p-12 bg-gray-950 text-white">
        <FontAwesomeIcon
          icon={faSpinner}
          className="text-4xl text-green-500 mb-4 animate-spin"
        />
        <p className="text-gray-300 text-lg">Loading harvests...</p>
      </div>
    );
  }

  if (!harvests || harvests.length === 0) {
    return (
      <div className="w-full text-center p-12 bg-gray-950 text-white">
        <FontAwesomeIcon
          icon={faLeaf}
          className="text-4xl text-gray-400 mb-4"
        />
        <p className="text-gray-300 text-lg mb-4">No harvests available yet.</p>
        <p className="text-gray-500">
          Check back later for new harvest listings.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-950 min-h-screen">
      {/* Filter Controls - Enhanced design */}
      <div className="w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-30">
        <div className="max-w-screen-2xl mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row flex-wrap gap-3 items-center">
            {/* Search input */}
            <div className="relative w-full md:flex-grow md:max-w-lg">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-2.5 text-gray-400 text-sm"
              />
              <input
                type="text"
                placeholder="Search crops, farmers, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-700 rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-800 text-white placeholder-gray-400 text-sm"
              />
              {searchLoading && (
                <div className="absolute right-3 top-2.5">
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="text-green-500 animate-spin text-sm"
                  />
                </div>
              )}
            </div>

            {/* Filter controls */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 w-full md:w-auto">
              <div className="flex items-center gap-1 bg-gray-800 px-2 py-1.5 rounded-lg border border-gray-700">
                <FontAwesomeIcon
                  icon={faFilter}
                  className="text-gray-400 text-xs"
                />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-white w-full text-xs"
                >
                  <option value="">All Types</option>
                  {[...new Set(harvests.map((h) => h.cropType))].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1 bg-gray-800 px-2 py-1.5 rounded-lg border border-gray-700">
                <FontAwesomeIcon
                  icon={faMoneyBillWave}
                  className="text-gray-400 text-xs"
                />
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-white w-full text-xs"
                >
                  <option value="">All Currencies</option>
                  {[...new Set(harvests.map((h) => h.currency))].map(
                    (currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="flex items-center gap-1 bg-gray-800 px-2 py-1.5 rounded-lg border border-gray-700">
                <FontAwesomeIcon
                  icon={faWeightHanging}
                  className="text-gray-400 text-xs"
                />
                <div className="flex items-center w-full gap-1">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minQuantity}
                    onChange={(e) => setMinQuantity(e.target.value)}
                    className="w-10 bg-transparent border-none focus:ring-0 text-white text-xs placeholder-gray-400"
                  />
                  <span className="text-gray-400 text-xs">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxQuantity}
                    onChange={(e) => setMaxQuantity(e.target.value)}
                    className="w-10 bg-transparent border-none focus:ring-0 text-white text-xs placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1 bg-gray-800 px-2 py-1.5 rounded-lg border border-gray-700">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="text-gray-400 text-xs"
                />
                <select
                  value={sortDate}
                  onChange={(e) => setSortDate(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-white w-full text-xs"
                >
                  <option value="desc">Newest</option>
                  <option value="asc">Oldest</option>
                </select>
              </div>

              <button
                onClick={resetFilters}
                className="flex items-center justify-center gap-1 px-2 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-white text-xs"
              >
                <FontAwesomeIcon icon={faSyncAlt} className="text-xs" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-2xl mx-auto px-4 py-4">
        {/* Search status */}
        {searchLoading && (
          <div className="flex justify-center items-center py-4">
            <FontAwesomeIcon
              icon={faSpinner}
              className="text-green-500 text-lg animate-spin mr-2"
            />
            <span className="text-gray-300 text-sm">Searching harvests...</span>
          </div>
        )}

        {/* Results count */}
        {!searchLoading && searchTerm && (
          <div className="mb-4 p-2 bg-gray-900/50 rounded-lg">
            <p className="text-gray-300 text-sm">
              Found{" "}
              <span className="text-green-400 font-medium">
                {filteredHarvests.length}
              </span>{" "}
              harvests matching "
              <span className="text-white">{searchTerm}</span>"
            </p>
          </div>
        )}

        {/* No results message */}
        {!searchLoading && filteredHarvests.length === 0 && (
          <div className="w-full text-center p-6 bg-gray-900/50 rounded-lg border border-gray-800">
            <FontAwesomeIcon
              icon={faSearch}
              className="text-3xl text-gray-400 mb-3"
            />
            <p className="text-gray-300 text-sm mb-2">
              No harvests found matching your search criteria.
            </p>
            <p className="text-gray-500 text-xs mb-3">
              Try adjusting your filters or search term.
            </p>
            <button
              onClick={resetFilters}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-500 rounded text-white transition-all text-xs"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Harvest Cards */}
        {!searchLoading && filteredHarvests.length > 0 && (
          <div className="mb-6">
            {paginatedKeys.slice(0, visibleCrops).map((cropName) => (
              <div key={cropName} className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold flex items-center text-white uppercase">
                    <FontAwesomeIcon
                      icon={faLeaf}
                      className="text-green-500 mr-2"
                    />
                    {cropName}
                    <span className="ml-2 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-md">
                      {groupedHarvests[cropName].length} listings
                    </span>
                  </h2>
                  {groupedHarvests[cropName].length > 1 && (
                    <button
                      onClick={() => toggleExpandCrop(cropName)}
                      className="text-green-500 hover:text-green-400 flex items-center text-xs bg-gray-800 px-2 py-1 rounded-md transition-all"
                    >
                      {expandedCrop === cropName ? "Collapse" : "Expand All"}
                      <FontAwesomeIcon
                        icon={faAngleDown}
                        className={`ml-1 transition-transform text-xs ${
                          expandedCrop === cropName ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>

                <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 h-0.5 rounded-full mb-4"></div>

                <div
                  className={`relative ${
                    groupedHarvests[cropName].length > 1 &&
                    expandedCrop !== cropName
                      ? "overflow-x-auto scrollbar-hide pb-3"
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
                        ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
                        : "flex space-x-3"
                    } ${expandedCrop === cropName ? "" : "min-w-max"}`}
                  >
                    {groupedHarvests[cropName].map((harvest) => (
                      <div
                        key={harvest._id}
                        className={`bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-green-700/30 transition-all duration-200 hover:shadow-md ${
                          expandedCrop === cropName
                            ? "w-full"
                            : "w-56 flex-shrink-0"
                        }`}
                      >
                        {/* Image section */}
                        {harvest.imageUrls?.length > 0 && (
                          <div className="relative pt-[60%] overflow-hidden group">
                            <img
                              src={harvest.imageUrls[0]}
                              alt={harvest.cropName}
                              onClick={() => openModal(harvest.imageUrls)}
                              className="absolute top-0 left-0 h-full w-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-200"
                            />
                            <div className="absolute top-2 right-2 flex gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(harvest._id);
                                }}
                                className="bg-gray-900/80 backdrop-blur-sm p-1.5 rounded-full hover:bg-red-600 transition-all"
                              >
                                <FontAwesomeIcon
                                  icon={faHeart}
                                  className={`text-xs ${
                                    favorites.has(harvest._id)
                                      ? "text-red-500"
                                      : "text-gray-300"
                                  }`}
                                />
                              </button>
                            </div>
                            {harvest.imageUrls.length > 1 && (
                              <div className="absolute bottom-2 right-2 bg-gray-900/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-xs text-white">
                                +{harvest.imageUrls.length - 1}
                              </div>
                            )}
                            <button
                              onClick={() => openModal(harvest.imageUrls)}
                              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-sm"
                            >
                              <div className="bg-white/80 p-1.5 rounded-full">
                                <FontAwesomeIcon
                                  icon={faEye}
                                  className="text-gray-900 text-sm"
                                />
                              </div>
                            </button>
                          </div>
                        )}

                        {/* Content section */}
                        <div className="p-3">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-medium bg-green-900/30 text-green-400 px-2 py-1 rounded-md border border-green-800/50">
                              {harvest.cropType}
                            </span>
                            <div className="text-right">
                              <div className="text-sm font-bold text-white">
                                {formatPrice(harvest.pricePerUnit)}{" "}
                                {harvest.currency}
                              </div>
                              <div className="text-xs text-gray-400">
                                per {harvest.unit}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1.5 text-xs text-gray-300 mb-3">
                            <div className="flex items-center">
                              <FontAwesomeIcon
                                icon={faWeightHanging}
                                className="mr-1.5 text-gray-400 w-3"
                              />
                              <span className="font-medium">
                                {harvest.estimatedQuantity}
                              </span>{" "}
                              {harvest.unit}
                            </div>
                            {harvest.expectedHarvestDate && (
                              <div className="flex items-center">
                                <FontAwesomeIcon
                                  icon={faCalendarAlt}
                                  className="mr-1.5 text-gray-400 w-3"
                                />
                                {new Date(
                                  harvest.expectedHarvestDate
                                ).toLocaleDateString()}
                              </div>
                            )}
                          </div>

                          {harvest.description && (
                            <div className="mb-3">
                              <p className="text-xs text-gray-400">
                                {expandedDescriptions.has(harvest._id)
                                  ? harvest.description
                                  : `${harvest.description.substring(0, 60)}${
                                      harvest.description.length > 60
                                        ? "..."
                                        : ""
                                    }`}
                              </p>
                              {harvest.description.length > 60 && (
                                <button
                                  onClick={() => toggleDescription(harvest._id)}
                                  className="text-xs text-green-500 hover:text-green-400 cursor-pointer mt-1"
                                >
                                  {expandedDescriptions.has(harvest._id)
                                    ? "Read less"
                                    : "Read more"}
                                </button>
                              )}
                            </div>
                          )}

                          {/* Farmer info */}
                          {harvest.farmerId && (
                            <div className="flex items-center mb-3 p-2 bg-gray-800/40 rounded-md">
                              <div className="w-7 h-7 bg-green-900/30 rounded-full flex items-center justify-center mr-2 overflow-hidden">
                                {harvest.farmerId.photo ? (
                                  <img
                                    src={harvest.farmerId.photo}
                                    alt={harvest.farmerId.name || "Farmer"}
                                    className="w-full h-full object-cover rounded-full"
                                  />
                                ) : (
                                  <FontAwesomeIcon
                                    icon={faUser}
                                    className="text-green-400 text-xs"
                                  />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-white truncate">
                                  {harvest.farmerId.name || "Farm Owner"}
                                </div>
                                {harvest.farmerId.location && (
                                  <div className="text-xs text-gray-400 flex items-center truncate">
                                    <FontAwesomeIcon
                                      icon={faMapMarkerAlt}
                                      className="mr-1 text-xs"
                                    />
                                    {harvest.farmerId.location}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="flex gap-1.5">
                            <button
                              onClick={() =>
                                (window.location.href = `/farmer/${harvest.farmerId._id}`)
                              }
                              className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-md transition-all text-xs font-medium"
                            >
                              <FontAwesomeIcon
                                icon={faUser}
                                className="text-xs"
                              />
                              View Farm
                            </button>
                            <button className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md transition-all">
                              <FontAwesomeIcon
                                icon={faEnvelope}
                                className="text-xs"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!searchLoading && visibleCrops < paginatedKeys.length && (
          <div className="text-center my-6">
            <button
              onClick={loadMore}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all flex items-center mx-auto font-medium text-sm shadow-md"
            >
              Load More
              <FontAwesomeIcon icon={faAngleDown} className="ml-1.5 text-xs" />
            </button>
          </div>
        )}

        {/* Pagination */}
        {!searchLoading && totalPages > 1 && (
          <div className="flex justify-center gap-1.5 my-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-gray-700 disabled:opacity-50 text-white bg-gray-800 hover:bg-gray-700 transition-all flex items-center text-xs"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="text-xs mr-1" />
              Prev
            </button>

            <div className="flex gap-1">
              {[...Array(totalPages).keys()].map((num) => (
                <button
                  key={num + 1}
                  onClick={() => setCurrentPage(num + 1)}
                  className={`px-2.5 py-1.5 rounded-lg border transition-all text-xs ${
                    currentPage === num + 1
                      ? "bg-green-600 text-white border-green-600 shadow-md"
                      : "hover:bg-gray-800 text-white border-gray-700 bg-gray-900"
                  }`}
                >
                  {num + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-gray-700 disabled:opacity-50 text-white bg-gray-800 hover:bg-gray-700 transition-all flex items-center text-xs"
            >
              Next
              <FontAwesomeIcon icon={faChevronRight} className="text-xs ml-1" />
            </button>
          </div>
        )}

        {/* Image Modal */}
        {selectedImages.length > 0 && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-3">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-white hover:text-gray-300 z-10 bg-gray-800 rounded-full p-1.5 w-8 h-8 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faTimes} className="text-sm" />
            </button>
            <button
              onClick={showPrev}
              className="absolute left-3 text-white hover:text-gray-300 p-1.5 z-10 bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
            </button>
            <div className="max-w-full max-h-full">
              <img
                src={selectedImages[currentIndex]}
                alt={`Harvest ${currentIndex + 1}`}
                className="max-h-[70vh] max-w-full object-contain rounded"
              />
            </div>
            <button
              onClick={showNext}
              className="absolute right-3 text-white hover:text-gray-300 p-1.5 z-10 bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
            </button>
            <div className="absolute bottom-3 text-white text-xs bg-black/70 px-3 py-1 rounded-full">
              {currentIndex + 1} / {selectedImages.length}
            </div>
          </div>
        )}

        {/* Description Modal */}
        {showDescriptionModal && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-3">
            <div className="bg-gray-900 rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto border border-gray-700">
              <div className="flex justify-between items-center p-3 border-b border-gray-800">
                <h3 className="text-base font-semibold text-white">
                  Crop Description
                </h3>
                <button
                  onClick={closeDescriptionModal}
                  className="text-gray-400 hover:text-white bg-gray-800 rounded-full p-1 w-6 h-6 flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-xs" />
                </button>
              </div>
              <div className="p-4 text-gray-300 whitespace-pre-line text-sm">
                {currentDescription}
              </div>
              <div className="p-3 border-t border-gray-800 flex justify-end">
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
    </div>
  );
};

export default HarvestList;
