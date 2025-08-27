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
} from "@fortawesome/free-solid-svg-icons";

const HarvestList = ({ harvests }) => {
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

  // Constants
  const itemsPerPage = 8;

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

  if (!harvests || harvests.length === 0) {
    return (
      <div className="w-full text-center p-8 bg-black text-white">
        <FontAwesomeIcon
          icon={faLeaf}
          className="text-4xl text-gray-400 mb-2"
        />
        <p className="text-gray-300">No harvests available yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-blue min-h-screen">
      {/* Filter Controls - Responsive layout */}
      <div className="w-full bg-gray-900 border-b border-gray-800">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            {/* Search input - full width on mobile, grows on larger screens */}
            <div className="relative w-full sm:flex-grow sm:max-w-md">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-3 text-gray-400 text-sm"
              />
              <input
                type="text"
                placeholder="Search crops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-700 rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-800 text-white text-sm"
              />
            </div>

            {/* Filter controls - responsive layout */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-1 bg-gray-800 px-2 py-1.5 rounded-lg border border-gray-700">
                <FontAwesomeIcon
                  icon={faFilter}
                  className="text-gray-400 text-xs"
                />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-xs text-white w-full"
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
                  className="bg-transparent border-none focus:ring-0 text-xs text-white w-full"
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
                <div className="flex items-center w-full">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minQuantity}
                    onChange={(e) => setMinQuantity(e.target.value)}
                    className="w-10 bg-transparent border-none focus:ring-0 text-xs text-white"
                  />
                  <span className="text-gray-400 mx-1 text-xs">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxQuantity}
                    onChange={(e) => setMaxQuantity(e.target.value)}
                    className="w-10 bg-transparent border-none focus:ring-0 text-xs text-white"
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
                  className="bg-transparent border-none focus:ring-0 text-xs text-white w-full"
                >
                  <option value="desc">Newest</option>
                  <option value="asc">Oldest</option>
                </select>
              </div>

              <button
                onClick={resetFilters}
                className="flex items-center justify-center gap-1 px-2 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-white w-full text-xs"
              >
                <FontAwesomeIcon icon={faSyncAlt} className="text-xs" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Harvest Cards */}
        <div className="mb-6">
          {paginatedKeys.slice(0, visibleCrops).map((cropName) => (
            <div key={cropName} className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-base sm:text-lg font-semibold flex items-center text-white uppercase">
                  <FontAwesomeIcon
                    icon={faLeaf}
                    className="text-green-500 mr-1 text-sm"
                  />
                  {cropName}
                </h2>
                {groupedHarvests[cropName].length > 1 && (
                  <button
                    onClick={() => toggleExpandCrop(cropName)}
                    className="text-xs text-green-500 hover:text-green-400 flex items-center"
                  >
                    {expandedCrop === cropName ? "Show Less" : "Show All"}
                    <FontAwesomeIcon
                      icon={faAngleDown}
                      className={`ml-1 transition-transform text-xs ${
                        expandedCrop === cropName ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}
              </div>
              <hr className="border-0 h-1 bg-gradient-to-r from-green-500 via-green-700 to-green-500 rounded-full my-5" />

              <div
                className={`relative ${
                  groupedHarvests[cropName].length > 1 &&
                  expandedCrop !== cropName
                    ? "overflow-x-auto scrollbar-hide"
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
                      ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
                      : "flex space-x-3 pb-2"
                  } ${expandedCrop === cropName ? "" : "min-w-max"}`}
                >
                  {groupedHarvests[cropName].map((harvest) => (
                    <div
                      key={harvest._id}
                      className={`bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition overflow-hidden border border-green-800 ${
                        expandedCrop === cropName
                          ? "w-full"
                          : "w-48 xs:w-52 sm:w-64 flex-shrink-0"
                      }`}
                    >
                      {harvest.imageUrls?.length > 0 && (
                        <div className="relative pt-[65%] overflow-hidden">
                          <img
                            src={harvest.imageUrls[0]}
                            alt={harvest.cropName}
                            onClick={() => openModal(harvest.imageUrls)}
                            className="absolute top-0 left-0 h-full w-full object-cover cursor-pointer hover:opacity-90 transition"
                          />
                        </div>
                      )}
                      <div className="p-2">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs bg-green-900 text-green-300 px-1.5 py-0.5 rounded">
                            {harvest.cropType}
                          </span>
                          <span className="text-xs font-medium text-white">
                            {harvest.pricePerUnit} {harvest.currency}
                          </span>
                        </div>

                        <div className="space-y-1 text-xs text-gray-300">
                          <div className="flex items-center">
                            <FontAwesomeIcon
                              icon={faWeightHanging}
                              className="mr-1 text-gray-400"
                            />
                            {harvest.estimatedQuantity} {harvest.unit}
                          </div>
                          {harvest.expectedHarvestDate && (
                            <div className="flex items-center">
                              <FontAwesomeIcon
                                icon={faCalendarAlt}
                                className="mr-1 text-gray-400"
                              />
                              {new Date(
                                harvest.expectedHarvestDate
                              ).toLocaleDateString()}
                            </div>
                          )}
                        </div>

                        {harvest.description && (
                          <div className="mt-1">
                            <p className="text-xs text-gray-400 line-clamp-2">
                              {harvest.description.length > 15
                                ? `${harvest.description.substring(0, 15)}... `
                                : harvest.description}
                            </p>
                            {harvest.description.length > 15 && (
                              <button
                                onClick={() =>
                                  openDescriptionModal(harvest.description)
                                }
                                className="text-xs text-green-500 hover:text-green-400 cursor-pointer"
                              >
                                Read more...
                              </button>
                            )}
                          </div>
                        )}

                        <button
                          onClick={() =>
                            (window.location.href = `/farmer/${harvest.farmerId._id}`)
                          }
                          className="mt-2 w-full flex items-center justify-center gap-1 text-xs bg-blue-900 hover:bg-blue-800 text-blue-300 px-2 py-1 rounded transition"
                        >
                          <FontAwesomeIcon icon={faUser} className="text-xs" />
                          View Farmer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleCrops < paginatedKeys.length && (
          <div className="text-center my-4">
            <button
              onClick={loadMore}
              className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-500 transition flex items-center mx-auto text-sm"
            >
              Load More
              <FontAwesomeIcon icon={faAngleDown} className="ml-1 text-xs" />
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-1 my-4 flex-wrap">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 rounded border border-gray-700 disabled:opacity-50 text-white bg-gray-800 hover:bg-gray-700 text-xs"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
            </button>

            {[...Array(totalPages).keys()].map((num) => (
              <button
                key={num + 1}
                onClick={() => setCurrentPage(num + 1)}
                className={`px-2 py-1 rounded border text-xs ${
                  currentPage === num + 1
                    ? "bg-green-600 text-white border-green-600"
                    : "hover:bg-gray-800 text-white border-gray-700 bg-gray-900"
                }`}
              >
                {num + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-2 py-1 rounded border border-gray-700 disabled:opacity-50 text-white bg-gray-800 hover:bg-gray-700 text-xs"
            >
              <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
            </button>
          </div>
        )}

        {/* Image Modal */}
        {selectedImages.length > 0 && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-3">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-white text-xl hover:text-gray-300 z-10 bg-gray-800 rounded-full p-1 w-7 h-7 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faTimes} className="text-sm" />
            </button>
            <button
              onClick={showPrev}
              className="absolute left-2 sm:left-4 text-white text-xl hover:text-gray-300 p-1 z-10 bg-gray-800 rounded-full w-7 h-7 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
            </button>
            <div className="max-w-full max-h-full">
              <img
                src={selectedImages[currentIndex]}
                alt={`Harvest ${currentIndex + 1}`}
                className="max-h-[70vh] max-w-full object-contain"
              />
            </div>
            <button
              onClick={showNext}
              className="absolute right-2 sm:right-4 text-white text-xl hover:text-gray-300 p-1 z-10 bg-gray-800 rounded-full w-7 h-7 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
            </button>
            <div className="absolute bottom-3 text-white text-xs bg-black/50 px-2 py-1 rounded">
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
              <div className="p-3 text-gray-300 whitespace-pre-line text-sm">
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
