import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config";
import HarvestList from "./HarvestList2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUserPlus,
  faSignInAlt,
  faTimes,
  faChevronLeft,
  faChevronRight,
  faLeaf,
  faTractor,
  faHandshake,
  faSpinner,
  faBars,
} from "@fortawesome/free-solid-svg-icons";

const HomePage = () => {
  const [harvests, setHarvests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Default language is Kinyarwanda
  const [language, setLanguage] = useState("rw");

  useEffect(() => {
    const fetchHarvests = async () => {
      try {
        const response = await fetch(`${API_URL}/harvests`);
        const data = await response.json();
        setHarvests(data);
      } catch (error) {
        console.error("Failed to fetch harvests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHarvests();

    // Load Google Translate script dynamically
    const addGoogleTranslate = () => {
      if (window.google && window.google.translate) return;

      const script = document.createElement("script");
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "rw", // Default page language: Kinyarwanda
            includedLanguages: "en,fr,es,de,ru,rw,zh-CN",
            layout:
              window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );

        // Automatically switch to Kinyarwanda after initialization
        // (Google Translate widget initializes with English usually)
        setTimeout(() => {
          changeLanguage("rw");
        }, 1000); // wait 1s to ensure widget is ready
      };
    };

    addGoogleTranslate();
  }, []);

  // Change language via Google Translate widget
  const changeLanguage = (lang) => {
    const select = document.querySelector(".goog-te-combo");
    if (!select) return;

    select.value = lang;
    select.dispatchEvent(new Event("change"));

    setLanguage(lang);
  };

  const handleImageClick = (images) => {
    setSelectedImages(images);
    setCurrentIndex(0);
  };

  const closeModal = () => {
    setSelectedImages([]);
  };

  const showNext = () => {
    setCurrentIndex((prev) => (prev + 1) % selectedImages.length);
  };

  const showPrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + selectedImages.length) % selectedImages.length
    );
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-gray-900 text-white shadow-lg shadow-black/50 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FontAwesomeIcon icon={faLeaf} className="text-green-500" />
            <span className="text-green-400">HarvestLink</span>
          </h1>

          {/* Language Selector */}
          <div className="hidden sm:flex items-center space-x-2 mr-4">
            <label htmlFor="language-select" className="text-gray-300 text-sm">
              Language:
            </label>
            <select
              id="language-select"
              className="bg-gray-700 text-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
              <option value="de">Deutsch</option>
              <option value="ru">Русский</option>
              <option value="rw">Kinyarwanda</option>
              <option value="zh-CN">简体中文</option>
            </select>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="hover:text-green-400 flex items-center gap-1 text-gray-300"
            >
              <FontAwesomeIcon icon={faHome} />{" "}
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link
              to="/register"
              className="hover:text-green-400 flex items-center gap-1 text-gray-300"
            >
              <FontAwesomeIcon icon={faUserPlus} />{" "}
              <span className="hidden sm:inline">Register</span>
            </Link>
            <Link
              to="/login"
              className="hover:text-green-400 flex items-center gap-1 text-gray-300"
            >
              <FontAwesomeIcon icon={faSignInAlt} />{" "}
              <span className="hidden sm:inline">Login</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-green-400"
            onClick={toggleMobileMenu}
          >
            <FontAwesomeIcon icon={faBars} size="lg" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-800 py-2 px-4 space-y-3">
            <Link
              to="/"
              className="block hover:text-green-400 flex items-center gap-2 text-gray-300 py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FontAwesomeIcon icon={faHome} /> Home
            </Link>
            <Link
              to="/register"
              className="block hover:text-green-400 flex items-center gap-2 text-gray-300 py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FontAwesomeIcon icon={faUserPlus} /> Register
            </Link>
            <Link
              to="/login"
              className="block hover:text-green-400 flex items-center gap-2 text-gray-300 py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FontAwesomeIcon icon={faSignInAlt} /> Login
            </Link>
          </div>
        )}

        {/* Announcement Marquee - Hidden on small screens */}
        <div className="hidden sm:block bg-green-600 text-white overflow-hidden whitespace-nowrap py-2 border-b border-green-700 relative">
          <div className="inline-block animate-marquee">
            📢 New season harvests now available! | 📝 Register now to connect
            directly with farmers | 🚜 HarvestLink — Empowering Farmers
            Everywhere!
          </div>
        </div>
      </nav>

      {/* Hidden div where Google Translate widget will mount */}
      <div id="google_translate_element" className="hidden"></div>

      {/* Hero Section with Image Background */}
      <section
        className="relative py-16 text-center bg-cover bg-center mt-24"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.7), rgba(16, 185, 129, 0.3)), url('/images/farm-field.jpg')",
          minHeight: "300px",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center h-full">
          <h2
            className="
                text-2xl        
                sm:text-3xl     
                md:text-4xl     
                lg:text-5xl     
                font-bold mb-4 text-white 
                flex items-center justify-center gap-2
              "
          >
            Welcome to HarvestLink{" "}
            <FontAwesomeIcon icon={faTractor} className="text-green-400" />
          </h2>

          <p className="text-base sm:text-lg text-gray-200 mb-6 flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faHandshake} className="text-green-400" />{" "}
            Connecting farmers directly with buyers
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              to="/login"
              className="px-4 sm:px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition border border-green-700 text-sm sm:text-base"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 sm:px-6 py-2 bg-gray-900 text-green-400 rounded hover:bg-gray-800 transition border border-gray-700 text-sm sm:text-base"
            >
              Register
            </Link>
          </div>
        </div>
      </section>

      {/* Harvest List */}
      <section className="relative py-8 sm:py-10 bg-gray-900">
        <div className="container mx-auto px-2 sm:px-4">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <FontAwesomeIcon
                icon={faSpinner}
                className="text-green-500 text-4xl animate-spin"
              />
            </div>
          ) : (
            <HarvestList
              harvests={harvests}
              loading={loading}
              onImageClick={handleImageClick}
            />
          )}
        </div>
      </section>

      {/* Modal Slideshow */}
      {selectedImages.length > 0 && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <button
            onClick={closeModal}
            className="absolute top-5 right-5 text-green-500 text-3xl hover:text-green-400"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <button
            onClick={showPrev}
            className="absolute left-2 sm:left-5 text-white text-2xl sm:text-3xl hover:text-green-400 p-2 sm:p-4"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <img
            src={`${API_URL}${selectedImages[currentIndex]}`}
            alt="Harvest Slide"
            className="max-h-[70vh] sm:max-h-[80vh] max-w-[90vw] object-contain"
          />
          <button
            onClick={showNext}
            className="absolute right-2 sm:right-5 text-white text-2xl sm:text-3xl hover:text-green-400 p-2 sm:p-4"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
          <div className="absolute bottom-5 text-white text-sm bg-black/50 px-2 py-1 rounded">
            {currentIndex + 1} / {selectedImages.length}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-4 mt-auto border-t border-gray-800 text-sm sm:text-base">
        <p>&copy; {new Date().getFullYear()} HarvestLink</p>
      </footer>
    </div>
  );
};

export default HomePage;
