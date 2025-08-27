import React, { useState } from "react";
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
} from "@fortawesome/free-solid-svg-icons";

const HarvestList = ({ harvests, onDelete, onEditClick }) => {
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
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  // Constants
  const itemsPerPage = 12; // Increased since cards are smaller
  const maxCardsPerRow = 6; // More cards per row

  // Filter and sort logic (same as before)
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

  // Grouping logic (same as before)
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

  // Handler functions (same as before)
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
  const openProfileModal = (url) => setProfileImageUrl(url);
  const closeProfileModal = () => setProfileImageUrl(null);
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedType("");
    setSelectedCurrency("");
    setMinQuantity("");
    setMaxQuantity("");
    setSortDate("desc");
    setCurrentPage(1);
  };

  if (!harvests || harvests.length === 0) {
    return (
      <div className="text-center p-4 bg-gray-800 rounded-lg">
        <FontAwesomeIcon
          icon={faLeaf}
          className="text-2xl text-gray-400 mb-1"
        />
        <p className="text-gray-400 text-sm">No harvests available yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-3 rounded-lg">
      {/* Filter Controls - Made more compact */}
      <div className="bg-gray-800 p-3 rounded-lg shadow-sm mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-grow max-w-md">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-2 top-2 text-gray-400 text-sm"
            />
            <input
              type="text"
              placeholder="Search crops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-gray-700 text-white rounded-lg w-full focus:ring-1 focus:ring-green-500 text-sm border border-gray-600"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-gray-700 text-white border-gray-600 focus:ring-1 focus:ring-green-500 text-sm rounded-lg px-2 py-1.5"
          >
            <option value="">All Types</option>
            {[...new Set(harvests.map((h) => h.cropType))].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="bg-gray-700 text-white border-gray-600 focus:ring-1 focus:ring-green-500 text-sm rounded-lg px-2 py-1.5"
          >
            <option value="">All Currencies</option>
            {[...new Set(harvests.map((h) => h.currency))].map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1 bg-gray-700 px-2 py-1.5 rounded-lg text-sm">
            <FontAwesomeIcon icon={faWeightHanging} className="text-gray-400" />
            <input
              type="number"
              placeholder="Min"
              value={minQuantity}
              onChange={(e) => setMinQuantity(e.target.value)}
              className="w-12 bg-gray-700 text-white border-none focus:ring-0 text-sm"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxQuantity}
              onChange={(e) => setMaxQuantity(e.target.value)}
              className="w-12 bg-gray-700 text-white border-none focus:ring-0 text-sm"
            />
          </div>

          <button
            onClick={resetFilters}
            className="flex items-center gap-1 px-2 py-1.5 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition text-sm"
          >
            <FontAwesomeIcon icon={faSyncAlt} className="text-xs" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Harvest Cards - Made smaller */}
      <div className="mb-6">
        {paginatedKeys.map((cropName) => (
          <div key={cropName} className="mb-4">
            <h2 className="text-md font-semibold text-gray-100 mb-2 flex items-center uppercase">
              <FontAwesomeIcon
                icon={faLeaf}
                className="text-green-500 mr-1 text-sm"
              />
              {cropName}
            </h2>
            <hr className="border-0 h-1 bg-gradient-to-r from-green-500 via-green-700 to-green-500 rounded-full my-5" />

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {groupedHarvests[cropName].map((harvest) => (
                <div
                  key={harvest._id}
                  className="bg-gray-800 rounded-md shadow-sm hover:shadow-md transition overflow-hidden border border-gray-700"
                >
                  {harvest.imageUrls?.length > 0 && (
                    <div
                      className="relative pt-[70%] overflow-hidden cursor-pointer"
                      onClick={() => openModal(harvest.imageUrls)}
                    >
                      <img
                        src={harvest.imageUrls[0]}
                        alt={harvest.cropName}
                        className="absolute top-0 left-0 h-full w-full object-cover hover:opacity-90 transition"
                      />
                    </div>
                  )}
                  <div className="p-2">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[0.65rem] bg-green-900 text-green-300 px-1 py-0.5 rounded whitespace-nowrap truncate">
                        {harvest.cropType}
                      </span>
                      <span className="text-xs font-medium text-gray-300">
                        {harvest.pricePerUnit} {harvest.currency}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-gray-400">
                      <div className="flex items-center">
                        <FontAwesomeIcon
                          icon={faWeightHanging}
                          className="mr-1 text-gray-500 text-[0.6rem]"
                        />
                        <span className="truncate">
                          {harvest.estimatedQuantity} {harvest.unit}
                        </span>
                      </div>
                      {harvest.expectedHarvestDate && (
                        <div className="flex items-center">
                          <FontAwesomeIcon
                            icon={faCalendarAlt}
                            className="mr-1 text-gray-500 text-[0.6rem]"
                          />
                          <span className="text-[0.65rem]">
                            {new Date(
                              harvest.expectedHarvestDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-2 flex justify-between gap-1">
                      <button
                        onClick={() =>
                          (window.location.href = `/farmer/${harvest.farmerId._id}`)
                        }
                        className="text-[0.6rem] bg-blue-600 hover:bg-blue-700 text-white px-1.5 py-1 rounded transition flex items-center justify-center"
                        title="View Profile"
                      >
                        <FontAwesomeIcon
                          icon={faUser}
                          className="text-[0.6rem]"
                        />
                      </button>

                      <div className="flex gap-1">
                        <button
                          onClick={() => onEditClick(harvest)}
                          className="text-[0.6rem] bg-yellow-600 hover:bg-yellow-700 text-white px-1.5 py-1 rounded transition flex items-center justify-center"
                          title="Edit"
                        >
                          <FontAwesomeIcon
                            icon={faEdit}
                            className="text-[0.6rem]"
                          />
                        </button>
                        <button
                          onClick={() => onDelete(harvest._id)}
                          className="text-[0.6rem] bg-red-600 hover:bg-red-700 text-white px-1.5 py-1 rounded transition flex items-center justify-center"
                          title="Delete"
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                            className="text-[0.6rem]"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls - Made more compact */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-1 my-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded border border-gray-600 text-gray-300 disabled:opacity-50 text-sm"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
          </button>

          {[...Array(totalPages).keys()].map((num) => (
            <button
              key={num + 1}
              onClick={() => setCurrentPage(num + 1)}
              className={`px-2 py-1 rounded text-xs ${
                currentPage === num + 1
                  ? "bg-green-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
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
            className="px-2 py-1 rounded border border-gray-600 text-gray-300 disabled:opacity-50 text-sm"
          >
            <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
          </button>
        </div>
      )}

      {/* Image Modal (unchanged) */}
      {selectedImages.length > 0 && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <button
            onClick={showPrev}
            className="absolute left-4 text-white text-2xl hover:text-gray-300 p-2"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <img
            src={selectedImages[currentIndex]}
            alt={`Harvest ${currentIndex + 1}`}
            className="max-h-[80vh] max-w-full object-contain"
          />
          <button
            onClick={showNext}
            className="absolute right-4 text-white text-2xl hover:text-gray-300 p-2"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      )}

      {/* Profile Image Modal (unchanged) */}
      {profileImageUrl && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={closeProfileModal}
        >
          <img
            src={profileImageUrl}
            alt="Farmer"
            className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export default HarvestList;
