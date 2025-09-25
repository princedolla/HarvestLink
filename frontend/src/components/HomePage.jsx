import { useState, useEffect, useRef } from "react";
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
  faSearch,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faGlobe,
  faInfoCircle,
  faShieldAlt,
  faQuestionCircle,
  faUsers,
  faNewspaper,
  faBriefcase,
  faStore,
  faSeedling,
  faShippingFast,
  faChartLine,
  faComments,
  faUser,
  faHeart,
  faAward,
  faRocket,
  faLightbulb,
  faShieldHeart,
  faArrowTrendUp
} from "@fortawesome/free-solid-svg-icons";
import { 
  faFacebook, 
  faTwitter, 
  faInstagram, 
  faLinkedin, 
  faYoutube,
  faWhatsapp,
  faPinterest
} from "@fortawesome/free-brands-svg-icons";

const HomePage = () => {
  const [harvests, setHarvests] = useState([]);
  const [filteredHarvests, setFilteredHarvests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchHarvests = async () => {
      try {
        const response = await fetch(`${API_URL}/harvests`);
        const data = await response.json();
        setHarvests(data);
        setFilteredHarvests(data);
      } catch (error) {
        console.error("Failed to fetch harvests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHarvests();
  }, []);

  // Animated background effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 50;
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = `rgba(34, 197, 94, ${Math.random() * 0.1 + 0.05})`;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY;
        }
      }
      
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // Connect particles with lines
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(34, 197, 94, ${0.1 * (1 - distance/100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Search function with loading state - Updated to include farmer search
  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredHarvests(harvests);
      return;
    }
    
    setSearchLoading(true);
    
    // Simulate API call delay for demonstration
    setTimeout(() => {
      const filtered = harvests.filter(harvest => 
        harvest.name.toLowerCase().includes(query.toLowerCase()) ||
        harvest.description.toLowerCase().includes(query.toLowerCase()) ||
        (harvest.farmerName && harvest.farmerName.toLowerCase().includes(query.toLowerCase())) ||
        (harvest.farmer && harvest.farmer.toLowerCase().includes(query.toLowerCase())) ||
        (harvest.farmerDetails && harvest.farmerDetails.name && harvest.farmerDetails.name.toLowerCase().includes(query.toLowerCase()))
      );
      
      setFilteredHarvests(filtered);
      setSearchLoading(false);
    }, 800); // Simulate network delay
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

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing with: ${email}`);
    setEmail("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 overflow-hidden relative">
      {/* Animated Background Canvas */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
      />
      
      {/* Content Container */}
      <div className="relative z-10">
        {/* Navbar */}
        <nav className="fixed w-full z-50 bg-gray-900/95 backdrop-blur-md text-white shadow-lg shadow-black/50 border-b border-gray-800">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg">
                  <FontAwesomeIcon icon={faLeaf} className="text-white text-xl" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  HarvestLink
                </h1>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search harvests, farmers..."
                className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-700"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {searchLoading && (
                <div className="absolute right-3 top-2.5">
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="text-green-500 animate-spin"
                  />
                </div>
              )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/"
                className="px-3 py-2 text-gray-300 hover:text-green-400 transition-all duration-200 hover:bg-gray-800 rounded-lg flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faHome} /> Home
              </Link>
              <Link
                to="/register"
                className="px-3 py-2 text-gray-300 hover:text-green-400 transition-all duration-200 hover:bg-gray-800 rounded-lg flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faUserPlus} /> Register
              </Link>
              <Link
                to="/login"
                className="px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faSignInAlt} /> Login
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-300 hover:text-green-400 p-2 rounded-lg hover:bg-gray-800 transition-all"
              onClick={toggleMobileMenu}
            >
              <FontAwesomeIcon icon={faBars} size="lg" />
            </button>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden px-4 pb-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search harvests, farmers..."
                className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-700"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {searchLoading && (
                <div className="absolute right-3 top-2.5">
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="text-green-500 animate-spin"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-gray-800/95 backdrop-blur-md py-4 px-4 space-y-3 border-t border-gray-700">
              <Link
                to="/"
                className="block hover:text-green-400 flex items-center gap-3 text-gray-300 py-2 px-3 rounded-lg hover:bg-gray-700 transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FontAwesomeIcon icon={faHome} /> Home
              </Link>
              <Link
                to="/register"
                className="block hover:text-green-400 flex items-center gap-3 text-gray-300 py-2 px-3 rounded-lg hover:bg-gray-700 transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FontAwesomeIcon icon={faUserPlus} /> Register
              </Link>
              <Link
                to="/login"
                className="block bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 px-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all flex items-center gap-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FontAwesomeIcon icon={faSignInAlt} /> Login
              </Link>
            </div>
          )}

          {/* Announcement Marquee */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white overflow-hidden whitespace-nowrap py-2 relative">
            <div className="inline-block animate-marquee whitespace-nowrap">
              <span className="mx-4">🌱 New season harvests now available!</span>
              <span className="mx-4">🚜 Register now to connect directly with farmers</span>
              <span className="mx-4">⭐ HarvestLink — Empowering Farmers Everywhere!</span>
            </div>
          </div>
        </nav>

        {/* Hero Section with Image Background */}
        <section className="relative pt-32 pb-20 text-center bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(16, 185, 129, 0.3)), url('/images/farm-field.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto">
              <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50 shadow-2xl shadow-black/50">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white flex items-center justify-center gap-3">
                  Welcome to HarvestLink{" "}
                  <FontAwesomeIcon icon={faLeaf} className="text-green-400" />
                </h2>

                <p className="text-lg text-gray-200 mb-8 flex items-center justify-center gap-2">
                  <FontAwesomeIcon icon={faHandshake} className="text-green-400" />{" "}
                  Connecting farmers directly with buyers
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/30 hover:border-green-400/50 transition-all duration-300">
                    <FontAwesomeIcon icon={faTractor} className="text-green-400 text-2xl mb-2" />
                    <h3 className="text-white font-semibold">For Farmers</h3>
                    <p className="text-gray-300 text-sm">Reach more buyers directly</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/30 hover:border-green-400/50 transition-all duration-300">
                    <FontAwesomeIcon icon={faStore} className="text-green-400 text-2xl mb-2" />
                    <h3 className="text-white font-semibold">For Buyers</h3>
                    <p className="text-gray-300 text-sm">Source fresh produce directly</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/30 hover:border-green-400/50 transition-all duration-300">
                    <FontAwesomeIcon icon={faChartLine} className="text-green-400 text-2xl mb-2" />
                    <h3 className="text-white font-semibold">Track Growth</h3>
                    <p className="text-gray-300 text-sm">Monitor your farming business</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/login"
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform hover:-translate-y-1"
                  >
                    <FontAwesomeIcon icon={faSignInAlt} /> Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-3 bg-gray-800 text-green-400 rounded-lg hover:bg-gray-700 transition-all duration-300 border border-gray-700 hover:border-green-400 flex items-center justify-center gap-2 transform hover:-translate-y-1"
                  >
                    <FontAwesomeIcon icon={faUserPlus} /> Register
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-gradient-to-b from-gray-900 to-gray-950">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/30 text-center hover:border-green-400/30 transition-all duration-300">
                <FontAwesomeIcon icon={faUser} className="text-green-400 text-3xl mb-2" />
                <div className="text-2xl font-bold text-white">1,250+</div>
                <div className="text-gray-400">Active Farmers</div>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/30 text-center hover:border-green-400/30 transition-all duration-300">
                <FontAwesomeIcon icon={faStore} className="text-green-400 text-3xl mb-2" />
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-gray-400">Verified Buyers</div>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/30 text-center hover:border-green-400/30 transition-all duration-300">
                <FontAwesomeIcon icon={faSeedling} className="text-green-400 text-3xl mb-2" />
                <div className="text-2xl font-bold text-white">5,000+</div>
                <div className="text-gray-400">Harvest Listings</div>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/30 text-center hover:border-green-400/30 transition-all duration-300">
                <FontAwesomeIcon icon={faHandshake} className="text-green-400 text-3xl mb-2" />
                <div className="text-2xl font-bold text-white">5M+</div>
                <div className="text-gray-400">Transactions</div>
              </div>
            </div>
          </div>
        </section>

        {/* Harvest List */}
        <section className="py-12 bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-3">Featured Harvests</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Discover fresh produce directly from local farmers across Rwanda</p>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <FontAwesomeIcon
                  icon={faSpinner}
                  className="text-green-500 text-4xl animate-spin"
                />
              </div>
            ) : searchLoading ? (
              <div className="flex justify-center items-center h-48">
                <div className="text-center">
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="text-green-500 text-4xl animate-spin mb-3"
                  />
                  <p className="text-gray-300">Searching harvests...</p>
                </div>
              </div>
            ) : filteredHarvests.length === 0 && searchQuery ? (
              <div className="flex justify-center items-center h-48">
                <div className="text-center">
                  <p className="text-gray-300 text-xl mb-2">No harvests found</p>
                  <p className="text-gray-500">Try a different search term</p>
                </div>
              </div>
            ) : (
              <>
                {searchQuery && (
                  <div className="mb-6 text-gray-300 bg-gray-800/50 p-4 rounded-lg">
                    <p>
                      Showing {filteredHarvests.length} of {harvests.length} harvests
                      {searchQuery && ` for "${searchQuery}"`}
                    </p>
                  </div>
                )}
                <HarvestList
                  harvests={filteredHarvests}
                  loading={loading}
                  onImageClick={handleImageClick}
                />
              </>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gradient-to-b from-gray-950 to-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-3">Why Choose HarvestLink?</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">We're revolutionizing the way farmers and buyers connect</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/30 hover:border-green-400/30 transition-all duration-300 transform hover:-translate-y-2">
                <div className="bg-green-400/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={faRocket} className="text-green-400 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Fast & Direct</h3>
                <p className="text-gray-400">Connect directly with buyers without intermediaries, reducing costs and time.</p>
              </div>
              
              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/30 hover:border-green-400/30 transition-all duration-300 transform hover:-translate-y-2">
                <div className="bg-green-400/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={faShieldHeart} className="text-green-400 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Secure Transactions</h3>
                <p className="text-gray-400">Safe and secure payment system ensuring both farmers and buyers are protected.</p>
              </div>
              
              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/30 hover:border-green-400/30 transition-all duration-300 transform hover:-translate-y-2">
                <div className="bg-green-400/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={faLightbulb} className="text-green-400 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Smart Insights</h3>
                <p className="text-gray-400">Get valuable insights about market trends and pricing to maximize your profits.</p>
              </div>
              
              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/30 hover:border-green-400/30 transition-all duration-300 transform hover:-translate-y-2">
                <div className="bg-green-400/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={faTractor} className="text-green-400 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Farm Tools</h3>
                <p className="text-gray-400">Access to agricultural tools and resources to improve your farming practices.</p>
              </div>
              
              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/30 hover:border-green-400/30 transition-all duration-300 transform hover:-translate-y-2">
                <div className="bg-green-400/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={faArrowTrendUp} className="text-green-400 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Growth Tracking</h3>
                <p className="text-gray-400">Monitor your sales, trends, and growth with our comprehensive dashboard.</p>
              </div>
              
              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/30 hover:border-green-400/30 transition-all duration-300 transform hover:-translate-y-2">
                <div className="bg-green-400/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={faUsers} className="text-green-400 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Community Support</h3>
                <p className="text-gray-400">Join a thriving community of farmers and buyers supporting each other.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Modal Slideshow */}
        {selectedImages.length > 0 && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 text-green-500 text-3xl hover:text-green-400 bg-gray-900/80 p-2 rounded-full"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <button
              onClick={showPrev}
              className="absolute left-2 sm:left-5 text-white text-2xl sm:text-3xl hover:text-green-400 p-2 sm:p-4 bg-gray-900/80 rounded-full"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <img
              src={`${API_URL}${selectedImages[currentIndex]}`}
              alt="Harvest Slide"
              className="max-h-[70vh] sm:max-h-[80vh] max-w-[90vw] object-contain rounded-lg"
            />
            <button
              onClick={showNext}
              className="absolute right-2 sm:right-5 text-white text-2xl sm:text-3xl hover:text-green-400 p-2 sm:p-4 bg-gray-900/80 rounded-full"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
            <div className="absolute bottom-5 text-white text-sm bg-black/70 px-4 py-2 rounded-full">
              {currentIndex + 1} / {selectedImages.length}
            </div>
          </div>
        )}

        {/* Enhanced Footer */}
        <footer className="bg-gray-900 text-gray-400 mt-auto border-t border-gray-800">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Company Info */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg">
                    <FontAwesomeIcon icon={faLeaf} className="text-white text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">HarvestLink</h3>
                </div>
                <p className="mb-6">Connecting farmers directly with buyers for a sustainable agricultural future.</p>
                <div className="flex space-x-3">
                  {[faFacebook, faTwitter, faInstagram, faLinkedin, faYoutube, faWhatsapp].map((icon, index) => (
                    <a key={index} href="#" className="bg-gray-800 p-2 rounded-lg text-gray-400 hover:text-green-400 hover:bg-gray-700 transition-all">
                      <FontAwesomeIcon icon={icon} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                <ul className="space-y-3">
                  {[
                    { icon: faHome, text: "Home", link: "/" },
                    { icon: faInfoCircle, text: "About Us", link: "/about" },
                    { icon: faSeedling, text: "Services", link: "/services" },
                    { icon: faStore, text: "Marketplace", link: "/marketplace" },
                    { icon: faNewspaper, text: "Blog", link: "/blog" },
                    { icon: faEnvelope, text: "Contact", link: "/contact" }
                  ].map((item, index) => (
                    <li key={index}>
                      <Link to={item.link} className="hover:text-green-400 transition-all flex items-center gap-3 py-1">
                        <FontAwesomeIcon icon={item.icon} className="w-4" /> {item.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
                <ul className="space-y-3">
                  {[
                    { icon: faQuestionCircle, text: "FAQ", link: "/faq" },
                    { icon: faQuestionCircle, text: "Help Center", link: "/help-center" },
                    { icon: faShieldAlt, text: "Privacy Policy", link: "/privacy-policy" },
                    { icon: faShieldAlt, text: "Terms of Service", link: "/terms-of-service" },
                    { icon: faShippingFast, text: "Shipping Info", link: "/shipping-info" },
                    { icon: faShippingFast, text: "Returns Policy", link: "/returns-policy" }
                  ].map((item, index) => (
                    <li key={index}>
                      <Link to={item.link} className="hover:text-green-400 transition-all flex items-center gap-3 py-1">
                        <FontAwesomeIcon icon={item.icon} className="w-4" /> {item.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
                <ul className="space-y-3">
                  {[
                    { icon: faMapMarkerAlt, text: "123 Farm Road, Agricultural District, Kigali, Rwanda" },
                    { icon: faPhone, text: "+250 788 123 456" },
                    { icon: faEnvelope, text: "info@harvestlink.com" },
                    { icon: faGlobe, text: "www.harvestlink.com" },
                    { icon: faWhatsapp, text: "+250 788 123 456" }
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <FontAwesomeIcon icon={item.icon} className="text-green-500 mt-1 flex-shrink-0" />
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Additional Links Section */}
            <div className="border-t border-gray-800 mt-8 pt-8">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">More From HarvestLink</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { icon: faTractor, text: "For Farmers" },
                  { icon: faStore, text: "For Buyers" },
                  { icon: faBriefcase, text: "Careers" },
                  { icon: faHandshake, text: "Partners" },
                  { icon: faChartLine, text: "Investors" },
                  { icon: faUsers, text: "Community" }
                ].map((item, index) => (
                  <Link key={index} to={`/${item.text.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-green-400 transition-all flex items-center gap-2 text-sm bg-gray-800/50 p-2 rounded-lg justify-center">
                    <FontAwesomeIcon icon={item.icon} /> {item.text}
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="border-t border-gray-800 mt-8 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                  <h3 className="text-lg font-semibold text-white mb-2">Subscribe to Our Newsletter</h3>
                  <p className="text-sm text-gray-400">Get the latest updates on new harvests and special offers</p>
                </div>
                <form onSubmit={handleNewsletterSubmit} className="flex w-full md:w-auto">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-800 text-white rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 w-full md:w-64 border border-gray-700"
                    required
                  />
                  <button type="submit" className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-r-lg px-4 py-2 hover:from-green-700 hover:to-emerald-700 transition-all">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-800 mt-8 pt-6 text-center">
              <p>&copy; {new Date().getFullYear()} HarvestLink. All rights reserved.</p>
              <div className="flex justify-center space-x-6 mt-2 text-sm">
                <Link to="/sitemap" className="hover:text-green-400 transition-all">Sitemap</Link>
                <Link to="/accessibility" className="hover:text-green-400 transition-all">Accessibility</Link>
                <Link to="/legal" className="hover:text-green-400 transition-all">Legal</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default HomePage;