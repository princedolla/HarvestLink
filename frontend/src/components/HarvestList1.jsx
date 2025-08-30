import React, { useState, useMemo, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faSyncAlt,
  faChevronLeft,
  faChevronRight,
  faTimes,
  faUser,
  faCalendarAlt,
  faWeightHanging,
  faLeaf,
  faEdit,
  faTrash,
  faDollarSign,
  faSeedling,
  faTags
} from "@fortawesome/free-solid-svg-icons";

// Constants
const ITEMS_PER_PAGE = 12;
const MAX_CARDS_PER_ROW = 6;

const HarvestList = ({ harvests, onDelete, onEditClick }) => {
  // State management
  const [filters, setFilters] = useState({
    searchTerm: "",
    selectedType: "",
    selectedCurrency: "",
    minQuantity: "",
    maxQuantity: "",
    sortDate: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  // Update filter function
  const updateFilter = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Filter and sort logic with useMemo for performance
  const filteredHarvests = useMemo(() => {
    return harvests
      .filter((harvest) =>
        harvest.cropName.toLowerCase().includes(filters.searchTerm.toLowerCase())
      )
      .filter((harvest) =>
        filters.selectedType ? harvest.cropType === filters.selectedType : true
      )
      .filter((harvest) =>
        filters.selectedCurrency ? harvest.currency === filters.selectedCurrency : true
      )
      .filter((harvest) => {
        const quantity = parseFloat(harvest.estimatedQuantity);
        return (
          (!filters.minQuantity || quantity >= parseFloat(filters.minQuantity)) &&
          (!filters.maxQuantity || quantity <= parseFloat(filters.maxQuantity))
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.expectedHarvestDate);
        const dateB = new Date(b.expectedHarvestDate);
        return filters.sortDate === "asc" ? dateA - dateB : dateB - dateA;
      });
  }, [harvests, filters]);

  // Grouping logic with useMemo
  const { groupedHarvests, sortedGroupKeys } = useMemo(() => {
    const grouped = filteredHarvests.reduce((acc, harvest) => {
      const key = harvest.cropName;
      if (!acc[key]) acc[key] = [];
      acc[key].push(harvest);
      return acc;
    }, {});

    return {
      groupedHarvests: grouped,
      sortedGroupKeys: Object.keys(grouped).sort()
    };
  }, [filteredHarvests]);

  // Pagination calculations
  const totalItems = filteredHarvests.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedKeys = sortedGroupKeys.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handler functions with useCallback
  const openModal = useCallback((images) => {
    setSelectedImages(images);
    setCurrentIndex(0);
  }, []);

  const closeModal = useCallback(() => setSelectedImages([]), []);
  
  const showNext = useCallback(() =>
    setCurrentIndex((prev) => (prev + 1) % selectedImages.length),
    [selectedImages.length]
  );
  
  const showPrev = useCallback(() =>
    setCurrentIndex((prev) => (prev - 1 + selectedImages.length) % selectedImages.length),
    [selectedImages.length]
  );
  
  const openProfileModal = useCallback((url) => setProfileImageUrl(url), []);
  const closeProfileModal = useCallback(() => setProfileImageUrl(null), []);
  
  const resetFilters = useCallback(() => {
    setFilters({
      searchTerm: "",
      selectedType: "",
      selectedCurrency: "",
      minQuantity: "",
      maxQuantity: "",
      sortDate: "desc",
    });
    setCurrentPage(1);
  }, []);

  // Get unique values for filter options
  const cropTypes = useMemo(() => [...new Set(harvests.map((h) => h.cropType))], [harvests]);
  const currencies = useMemo(() => [...new Set(harvests.map((h) => h.currency))], [harvests]);

  if (!harvests || harvests.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-800 rounded-xl shadow-lg">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-700 rounded-full mb-4">
          <FontAwesomeIcon
            icon={faLeaf}
            className="text-3xl text-green-400"
          />
        </div>
        <h3 className="text-xl font-semibold text-gray-200 mb-2">No Harvests Yet</h3>
        <p className="text-gray-400">Add your first harvest to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-lg">
      {/* Filter Controls */}
      <div className="bg-gray-800 p-4 rounded-xl shadow-sm mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-grow max-w-md">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-3 text-gray-400 text-sm"
            />
            <input
              type="text"
              placeholder="Search crops..."
              value={filters.searchTerm}
              onChange={(e) => updateFilter("searchTerm", e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-gray-700 text-white rounded-xl w-full focus:ring-2 focus:ring-green-500 text-sm border-0"
            />
          </div>

          <select
            value={filters.selectedType}
            onChange={(e) => updateFilter("selectedType", e.target.value)}
            className="bg-gray-700 text-white border-0 focus:ring-2 focus:ring-green-500 text-sm rounded-xl px-3 py-2.5 min-w-[140px]"
          >
            <option value="">All Types</option>
            {cropTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            value={filters.selectedCurrency}
            onChange={(e) => updateFilter("selectedCurrency", e.target.value)}
            className="bg-gray-700 text-white border-0 focus:ring-2 focus:ring-green-500 text-sm rounded-xl px-3 py-2.5 min-w-[140px]"
          >
            <option value="">All Currencies</option>
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2 bg-gray-700 px-3 py-2.5 rounded-xl text-sm">
            <FontAwesomeIcon icon={faWeightHanging} className="text-gray-400" />
            <input
              type="number"
              placeholder="Min"
              value={filters.minQuantity}
              onChange={(e) => updateFilter("minQuantity", e.target.value)}
              className="w-14 bg-gray-700 text-white border-none focus:ring-0 text-sm placeholder-gray-500"
              min="0"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxQuantity}
              onChange={(e) => updateFilter("maxQuantity", e.target.value)}
              className="w-14 bg-gray-700 text-white border-none focus:ring-0 text-sm placeholder-gray-500"
              min="0"
            />
          </div>

          <select
            value={filters.sortDate}
            onChange={(e) => updateFilter("sortDate", e.target.value)}
            className="bg-gray-700 text-white border-0 focus:ring-2 focus:ring-green-500 text-sm rounded-xl px-3 py-2.5 min-w-[150px]"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>

          <button
            onClick={resetFilters}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-600 hover:bg-gray-500 text-white rounded-xl transition text-sm font-medium"
            aria-label="Reset filters"
          >
            <FontAwesomeIcon icon={faSyncAlt} className="text-xs" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-400">
          Showing {filteredHarvests.length} of {harvests.length} harvests
        </p>
        <div className="flex items-center text-sm text-gray-400">
          <FontAwesomeIcon icon={faLeaf} className="mr-2 text-green-400" />
          {sortedGroupKeys.length} different crops
        </div>
      </div>

      {/* Harvest Cards */}
      <div className="mb-6">
        {paginatedKeys.length > 0 ? (
          paginatedKeys.map((cropName) => (
            <div key={cropName} className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-900 rounded-lg flex items-center justify-center mr-3">
                  <FontAwesomeIcon icon={faSeedling} className="text-green-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-100 uppercase tracking-wide">
                  {cropName}
                </h2>
                <span className="ml-3 px-2 py-1 bg-gray-700 text-gray-300 text-xs font-medium rounded-full">
                  {groupedHarvests[cropName].length} listings
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {groupedHarvests[cropName].map((harvest) => (
                  <div key={harvest._id} className="bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-700 hover:border-green-500/30 group">
                    {harvest.imageUrls?.length > 0 && (
                      <div
                        className="relative pt-[75%] overflow-hidden cursor-pointer"
                        onClick={() => openModal(harvest.imageUrls)}
                        aria-label="View images"
                      >
                        <img
                          src={harvest.imageUrls[0]}
                          alt={harvest.cropName}
                          className="absolute top-0 left-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        {harvest.imageUrls.length > 1 && (
                          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                            +{harvest.imageUrls.length - 1}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-semibold bg-green-900/40 text-green-300 px-2 py-1 rounded-full">
                          {harvest.cropType}
                        </span>
                        <div className="text-right">
                          <div className="text-sm font-bold text-white">
                            {harvest.pricePerUnit} {harvest.currency}
                          </div>
                          <div className="text-xs text-gray-400">per {harvest.unit}</div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm">
                          <div className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center mr-2">
                            <FontAwesomeIcon icon={faWeightHanging} className="text-gray-400 text-xs" />
                          </div>
                          <span className="text-gray-300">
                            {harvest.estimatedQuantity} {harvest.unit}
                          </span>
                        </div>
                        
                        {harvest.expectedHarvestDate && (
                          <div className="flex items-center text-sm">
                            <div className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center mr-2">
                              <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 text-xs" />
                            </div>
                            <span className="text-gray-300">
                              {new Date(harvest.expectedHarvestDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        
                        {harvest.quality && (
                          <div className="flex items-center text-sm">
                            <div className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center mr-2">
                              <FontAwesomeIcon icon={faTags} className="text-gray-400 text-xs" />
                            </div>
                            <span className="text-gray-300 capitalize">{harvest.quality} quality</span>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                        <button
                          onClick={() => openProfileModal(harvest.farmerId?.profileImage)}
                          className="flex items-center text-xs text-blue-400 hover:text-blue-300 transition-colors"
                          title="View Profile"
                          aria-label="View farmer profile"
                        >
                          <div className="w-6 h-6 bg-blue-900 rounded-full flex items-center justify-center mr-1">
                            <FontAwesomeIcon icon={faUser} className="text-xs" />
                          </div>
                          Profile
                        </button>

                        <div className="flex gap-2">
                          <button
                            onClick={() => onEditClick(harvest)}
                            className="w-8 h-8 bg-yellow-900/40 hover:bg-yellow-800 text-yellow-300 rounded-full flex items-center justify-center transition-colors"
                            title="Edit"
                            aria-label="Edit harvest"
                          >
                            <FontAwesomeIcon icon={faEdit} className="text-xs" />
                          </button>
                          <button
                            onClick={() => onDelete(harvest._id)}
                            className="w-8 h-8 bg-red-900/40 hover:bg-red-800 text-red-300 rounded-full flex items-center justify-center transition-colors"
                            title="Delete"
                            aria-label="Delete harvest"
                          >
                            <FontAwesomeIcon icon={faTrash} className="text-xs" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-8 bg-gray-800 rounded-xl">
            <FontAwesomeIcon icon={faSearch} className="text-3xl text-gray-500 mb-3" />
            <h3 className="text-lg font-medium text-gray-300 mb-1">No matches found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 my-6">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800 text-gray-300 disabled:opacity-50 hover:bg-gray-700 transition-colors"
            aria-label="Previous page"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium ${
                currentPage === page
                  ? "bg-green-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              } transition-colors`}
              aria-label={`Page ${page}`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800 text-gray-300 disabled:opacity-50 hover:bg-gray-700 transition-colors"
            aria-label="Next page"
          >
            <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
          </button>
        </div>
      )}

      {/* Image Modal */}
      {selectedImages.length > 0 && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 text-white text-2xl hover:text-gray-300 z-10 w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center"
            aria-label="Close modal"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <button
            onClick={showPrev}
            className="absolute left-6 text-white text-xl hover:text-gray-300 p-2 z-10 w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center"
            aria-label="Previous image"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <div className="relative max-h-[80vh] max-w-full">
            <img
              src={selectedImages[currentIndex]}
              alt={`Harvest ${currentIndex + 1}`}
              className="max-h-[80vh] max-w-full object-contain rounded-lg"
            />
            <div className="absolute bottom-4 left-0 right-0 text-center text-white bg-black/40 py-1 rounded-full text-sm mx-auto w-20">
              {currentIndex + 1} of {selectedImages.length}
            </div>
          </div>
          <button
            onClick={showNext}
            className="absolute right-6 text-white text-xl hover:text-gray-300 p-2 z-10 w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center"
            aria-label="Next image"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      )}

      {/* Profile Image Modal */}
      {profileImageUrl && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={closeProfileModal}
        >
          <div className="relative">
            <button
              className="absolute -top-12 right-0 text-white text-2xl hover:text-gray-300 w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center"
              onClick={closeProfileModal}
              aria-label="Close modal"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <img
              src={profileImageUrl}
              alt="Farmer"
              className="max-w-[90vw] max-h-[90vh] rounded-xl shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HarvestList;