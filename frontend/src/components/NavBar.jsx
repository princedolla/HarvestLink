import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLeaf,
  faBars,
  faTimes,
  faSearch,
  faUserPlus,
  faSignInAlt,
  faUser,
  faShoppingCart,
  faBell,
  faChevronDown,
  faTractor,
  faStore,
  faCalendarAlt,
  faNewspaper,
  faInfoCircle,
  faCheckCircle,
  faHome,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [user, setUser] = useState(null);
  
  const searchRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const location = useLocation();

  // Enhanced navigation items with icons
  const navigationItems = [
    { name: "Home", to: "/", icon: faHome },
    { name: "Marketplace", to: "/marketplace", icon: faStore },
    { name: "For Farmers", to: "/farmers", icon: faTractor },
    { name: "For Buyers", to: "/buyers", icon: faShoppingCart },
    { name: "Events", to: "/events", icon: faCalendarAlt },
    { name: "Blog", to: "/blog", icon: faNewspaper },
    { name: "About", to: "/about", icon: faInfoCircle },
  ];

  // Simulate user authentication
  useEffect(() => {
    const simulatedUser = {
      name: "John Farmer",
      role: "farmer",
      verified: true,
      cartItems: 3,
      notifications: 2
    };
    setUser(simulatedUser);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      setSearchLoading(true);
      setTimeout(() => {
        setSearchLoading(false);
      }, 600);
    }
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    if (searchRef.current) {
      searchRef.current.focus();
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-gray-900/95 backdrop-blur-xl shadow-lg border-b border-emerald-500/20 py-2"
            : "bg-gray-900 backdrop-blur-md py-3"
        }`}
        style={{ minHeight: '64px' }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-12">
            {/* Logo - Smaller size with reduced margin */}
            <Link
              to="/"
              className="flex items-center gap-1.5 group relative flex-shrink-0 ml-1"
              style={{ minWidth: '120px' }}
            >
              <div className="relative">
                <div className="bg-gradient-to-br from-emerald-400 to-green-600 p-1.5 rounded-lg group-hover:scale-105 transition-all duration-300 shadow-md">
                  <FontAwesomeIcon
                    icon={faLeaf}
                    className="text-white text-xs sm:text-sm"
                  />
                </div>
              </div>
              <div className="flex flex-col leading-tight">
                <h1 className="text-sm sm:text-base font-bold bg-gradient-to-r from-emerald-300 via-green-400 to-emerald-300 bg-clip-text text-transparent group-hover:brightness-125 transition-all duration-300 whitespace-nowrap">
                  HarvestLink
                </h1>
                <span className="text-[8px] sm:text-[10px] text-emerald-400/70 font-medium tracking-wide">
                  Grow Together
                </span>
              </div>
            </Link>

            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden lg:flex items-center flex-1 justify-center mx-2">
              <div className="flex items-center gap-0">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.to}
                    className={`group relative flex items-center gap-1 px-2 py-2 rounded-lg transition-all duration-200 hover:bg-white/5 mx-1 ${
                      location.pathname === item.to
                        ? "text-emerald-400 bg-emerald-500/10"
                        : "text-gray-300 hover:text-white"
                    }`}
                    style={{ minWidth: 'fit-content' }}
                  >
                    <FontAwesomeIcon
                      icon={item.icon}
                      className={`transition-transform duration-200 text-xs ${
                        location.pathname === item.to ? "text-emerald-400" : "text-gray-400"
                      }`}
                    />
                    <span className="font-medium text-xs whitespace-nowrap ml-1">
                      {item.name}
                    </span>
                    {location.pathname === item.to && (
                      <div className="absolute bottom-0 left-1/4 w-1/2 h-0.5 bg-emerald-400 rounded-full"></div>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Desktop Right Section - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-2 flex-shrink-0" style={{ minWidth: '200px' }}>
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <FontAwesomeIcon
                    icon={faSearch}
                    className={`transition-colors duration-300 text-xs ${
                      isSearchFocused ? "text-emerald-400" : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search..."
                  className="w-32 xl:w-40 bg-gray-800/60 text-white rounded-lg pl-7 pr-6 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 border border-gray-600 transition-all duration-300 placeholder-gray-400 text-xs"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-1.5 flex items-center text-gray-400 hover:text-emerald-400 transition-colors duration-300"
                  >
                    <FontAwesomeIcon icon={faTimes} className="text-xs" />
                  </button>
                )}
              </div>

              {/* User Menu / Auth Buttons */}
              {user ? (
                <div className="flex items-center gap-1">
                  <button className="relative p-1.5 text-gray-300 hover:text-emerald-400 transition-colors duration-300 rounded-lg hover:bg-gray-800/50">
                    <FontAwesomeIcon icon={faBell} className="text-xs" />
                    {user.notifications > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    )}
                  </button>
                  
                  <button className="relative p-1.5 text-gray-300 hover:text-emerald-400 transition-colors duration-300 rounded-lg hover:bg-gray-800/50">
                    <FontAwesomeIcon icon={faShoppingCart} className="text-xs" />
                    {user.cartItems > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    )}
                  </button>
                  
                  <div className="flex items-center gap-1 bg-gray-800/50 rounded-lg pl-1.5 pr-1.5 py-1 border border-gray-600 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer">
                    <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center relative">
                      <FontAwesomeIcon icon={faUser} className="text-white text-xs" />
                      {user.verified && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-blue-500 rounded-full flex items-center justify-center">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-white text-[6px]" />
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-white font-medium max-w-16 truncate hidden xl:block">
                      {user.name.split(' ')[0]}
                    </span>
                    <FontAwesomeIcon icon={faChevronDown} className="text-gray-400 text-xs" />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Link
                    to="/register"
                    className="px-2 py-1.5 border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-emerald-500/10 transition-all duration-300 flex items-center gap-1 text-xs font-semibold whitespace-nowrap"
                  >
                    <FontAwesomeIcon icon={faUserPlus} className="text-xs" />
                    Join Farmer
                  </Link>
                  <Link
                    to="/login"
                    className="px-2 py-1.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300 flex items-center gap-1 text-xs font-semibold whitespace-nowrap"
                  >
                    <FontAwesomeIcon icon={faSignInAlt} className="text-xs" />
                    Login
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Controls - Visible only on mobile */}
            <div className="flex items-center gap-1 lg:hidden">
              <button
                className="p-2 text-gray-300 hover:text-emerald-400 transition-colors duration-300 rounded-lg hover:bg-gray-800/50"
              >
                <FontAwesomeIcon icon={faSearch} className="text-sm" />
              </button>

              <button
                className="p-2 text-gray-300 hover:text-emerald-400 rounded-lg hover:bg-gray-800/50 transition-all duration-300"
                onClick={toggleMobileMenu}
              >
                <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} className="text-base" />
              </button>
            </div>
          </div>

          {/* Mobile Search Bar - Hidden on desktop */}
          <div className="lg:hidden mt-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="text-emerald-400 text-xs"
                />
              </div>
              <input
                type="text"
                placeholder="Search harvests, farmers..."
                className="w-full bg-gray-800/60 text-white rounded-lg pl-9 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 border border-gray-600 transition-all duration-300 placeholder-gray-400 text-xs"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-emerald-400 transition-colors duration-300"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-xs" />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from being hidden behind navbar */}
      <div style={{ height: '80px' }}></div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleMobileMenu}
        ></div>
      )}

      {/* Mobile Menu Sidebar */}
      <div
        ref={mobileMenuRef}
        className={`lg:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-gray-900/95 backdrop-blur-xl z-50 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } border-l border-emerald-500/20`}
      >
        {/* Mobile Menu Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-400 to-green-600 p-2 rounded-lg">
              <FontAwesomeIcon icon={faLeaf} className="text-white text-base" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">HarvestLink</h2>
              <p className="text-emerald-400 text-xs">Grow Together</p>
            </div>
          </div>
          <button
            onClick={toggleMobileMenu}
            className="text-emerald-400 hover:text-emerald-300 transition-colors duration-300 p-2 hover:bg-gray-800 rounded-lg"
          >
            <FontAwesomeIcon icon={faTimes} className="text-lg" />
          </button>
        </div>
        
        {/* Mobile Navigation Links */}
        <div className="p-4 space-y-1 max-h-[60vh] overflow-y-auto">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group ${
                location.pathname === item.to
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "text-gray-300 hover:text-white hover:bg-gray-800/50"
              }`}
            >
              <FontAwesomeIcon
                icon={item.icon}
                className="text-base group-hover:scale-110 transition-transform duration-200"
              />
              <span className="font-semibold text-sm">{item.name}</span>
            </Link>
          ))}
        </div>

        {/* Mobile User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700/50 bg-gray-900/90 backdrop-blur-lg">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faUser} className="text-white text-sm" />
                  </div>
                  {user.verified && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-white text-[6px]" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-white font-semibold text-sm truncate">{user.name}</p>
                    {user.verified && (
                      <FontAwesomeIcon icon={faCheckCircle} className="text-blue-400 text-xs" />
                    )}
                  </div>
                  <p className="text-emerald-400 text-xs capitalize">{user.role}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-2 p-2 rounded-lg bg-gray-800/50 text-gray-300 hover:text-emerald-400 transition-all duration-200 text-xs">
                  <FontAwesomeIcon icon={faUser} className="text-xs" />
                  <span>Profile</span>
                </button>
                <button className="flex items-center justify-center gap-2 p-2 rounded-lg bg-gray-800/50 text-gray-300 hover:text-emerald-400 transition-all duration-200 text-xs">
                  <FontAwesomeIcon icon={faSignInAlt} className="text-xs" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white p-2.5 rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-200 font-semibold text-sm"
              >
                <FontAwesomeIcon icon={faSignInAlt} />
                Login to Account
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 border border-emerald-500/50 text-emerald-400 p-2.5 rounded-lg hover:bg-emerald-500/10 transition-all duration-200 font-semibold text-sm"
              >
                <FontAwesomeIcon icon={faUserPlus} />
                Join as Farmer
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;