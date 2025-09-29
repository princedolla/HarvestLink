import { useState, useEffect, useRef } from "react";
import React from "react";

import { Link } from "react-router-dom";
import { API_URL } from "../config";
import HarvestList from "./HarvestList2";
import Navbar from "./NavBar";
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
  faArrowTrendUp,
  faArrowRight,
  faStar,
  faCheckCircle,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faLinkedin,
  faYoutube,
  faWhatsapp,
  faPinterest,
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const testimonialRef = useRef(null);

  // Scroll detection for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Testimonial auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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

  // Enhanced animated background effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const particles = [];
    const particleCount = 80;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `hsla(${120 + Math.random() * 60}, 70%, 50%, ${
          Math.random() * 0.15 + 0.05
        })`;
        this.alpha = Math.random() * 0.1 + 0.05;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.fillStyle = "rgba(3, 7, 18, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(34, 197, 94, ${
              0.1 * (1 - distance / 120)
            })`;
            ctx.lineWidth = 0.8;
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
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredHarvests(harvests);
      return;
    }

    setSearchLoading(true);

    setTimeout(() => {
      const filtered = harvests.filter(
        (harvest) =>
          harvest.name?.toLowerCase().includes(query.toLowerCase()) ||
          harvest.description?.toLowerCase().includes(query.toLowerCase()) ||
          harvest.farmerName?.toLowerCase().includes(query.toLowerCase()) ||
          harvest.farmer?.toLowerCase().includes(query.toLowerCase()) ||
          harvest.farmerDetails?.name
            ?.toLowerCase()
            .includes(query.toLowerCase())
      );

      setFilteredHarvests(filtered);
      setSearchLoading(false);
    }, 600);
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

  const testimonials = [
    {
      name: "Jean Pierre",
      role: "Farm Owner",
      content:
        "HarvestLink transformed my business! I now reach buyers directly and get better prices for my crops.",
      avatar: "/images/farmer-1.jpg",
    },
    {
      name: "Marie Claire",
      role: "Restaurant Owner",
      content:
        "The quality of produce from HarvestLink is exceptional. Fresh, direct from farms, and reliable delivery.",
      avatar: "/images/buyer-1.jpg",
    },
    {
      name: "David Smith",
      role: "Agricultural Investor",
      content:
        "This platform is revolutionizing Rwanda's agricultural sector. Efficient, transparent, and growing fast!",
      avatar: "/images/investor-1.jpg",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 overflow-hidden relative">
      {/* Enhanced Animated Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Content Container */}
      <div className="relative z-10">
        {/* Enhanced Hero Section */}
        <section
          ref={heroRef}
          className="relative pt-32 pb-24 text-center bg-cover bg-center bg-fixed overflow-hidden"
          style={{
            backgroundImage:
              "linear-gradient(rgba(3, 7, 18, 0.8), rgba(6, 78, 59, 0.4)), url('/images/farm-field.jpg')",
          }}
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-green-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-8 border border-emerald-500/20 shadow-xl shadow-black/50 relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `radial-gradient(circle at 1px 1px, rgba(34, 197, 94, 0.3) 1px, transparent 0)`,
                      backgroundSize: "40px 40px",
                    }}
                  ></div>
                </div>

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-1.5 mb-4">
                    <FontAwesomeIcon
                      icon={faStar}
                      className="text-emerald-400 text-xs"
                    />
                    <span className="text-emerald-300 font-semibold text-xs">
                      Trusted by 1,000+ Farmers
                    </span>
                  </div>

                  <h2 className="text-4xl md:text-6xl font-bold mb-4 text-white">
                    Welcome to{" "}
                    <span className="bg-gradient-to-r from-emerald-300 via-green-400 to-emerald-300 bg-clip-text text-transparent">
                      HarvestLink
                    </span>
                    <FontAwesomeIcon
                      icon={faLeaf}
                      className="text-emerald-400 ml-3 inline-block text-2xl"
                    />
                  </h2>

                  <p className="text-lg md:text-xl text-gray-200 mb-6 flex items-center justify-center gap-2 font-light">
                    <FontAwesomeIcon
                      icon={faHandshake}
                      className="text-emerald-400"
                    />
                    Connecting farmers directly with buyers worldwide
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {[
                      {
                        icon: faTractor,
                        title: "For Farmers",
                        desc: "Reach more buyers directly",
                        color: "from-emerald-400 to-green-500",
                      },
                      {
                        icon: faStore,
                        title: "For Buyers",
                        desc: "Source fresh produce directly",
                        color: "from-green-400 to-emerald-500",
                      },
                      {
                        icon: faChartLine,
                        title: "Track Growth",
                        desc: "Monitor your farming business",
                        color: "from-emerald-500 to-green-600",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="group bg-gray-800/30 backdrop-blur-sm p-4 rounded-xl border border-gray-700/30 hover:border-emerald-400/50 transition-all duration-500 hover:transform hover:-translate-y-1 relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-green-500/0 group-hover:from-emerald-500/5 group-hover:to-green-500/10 transition-all duration-500"></div>
                        <div
                          className={`bg-gradient-to-r ${item.color} w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300 shadow-lg`}
                        >
                          <FontAwesomeIcon
                            icon={item.icon}
                            className="text-white text-lg"
                          />
                        </div>
                        <h3 className="text-white font-semibold text-base mb-1">
                          {item.title}
                        </h3>
                        <p className="text-gray-300 text-xs">{item.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <Link
                      to="/login"
                      className="group relative px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 flex items-center gap-2 font-semibold text-base hover:transform hover:-translate-y-0.5 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      <FontAwesomeIcon icon={faSignInAlt} />
                      Get Started Now
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="group-hover:translate-x-1 transition-transform duration-300"
                      />
                    </Link>
                    <Link
                      to="/register"
                      className="group px-6 py-3 bg-gray-800/50 backdrop-blur-sm text-emerald-400 rounded-xl hover:bg-gray-700/50 transition-all duration-300 border border-gray-700 hover:border-emerald-400 flex items-center gap-2 font-semibold text-base hover:transform hover:-translate-y-0.5"
                    >
                      <FontAwesomeIcon icon={faUserPlus} />
                      Join as Farmer
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Stats Section */}
        <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: faUser,
                  count: "1,250+",
                  label: "Active Farmers",
                  color: "emerald",
                },
                {
                  icon: faStore,
                  count: "500+",
                  label: "Verified Buyers",
                  color: "green",
                },
                {
                  icon: faSeedling,
                  count: "5,000+",
                  label: "Harvest Listings",
                  color: "emerald",
                },
                {
                  icon: faHandshake,
                  count: "5M+",
                  label: "Transactions",
                  color: "green",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="group text-center p-6 rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 hover:border-emerald-400/30 transition-all duration-500 hover:transform hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-green-500/0 group-hover:from-emerald-500/5 group-hover:to-green-500/10 transition-all duration-500"></div>
                  <div
                    className={`bg-${stat.color}-500/10 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-300`}
                  >
                    <FontAwesomeIcon
                      icon={stat.icon}
                      className={`text-${stat.color}-400 text-2xl`}
                    />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {stat.count}
                  </div>
                  <div className="text-gray-400 font-semibold text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Harvest List Section */}
        <section className="py-16 bg-gray-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2 mb-4">
                <FontAwesomeIcon
                  icon={faSeedling}
                  className="text-emerald-400 text-sm"
                />
                <span className="text-emerald-300 font-semibold text-sm">
                  Fresh from the Farm
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Featured{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                  Harvests
                </span>
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Discover fresh produce directly from local farmers across Rwanda
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-48">
                <div className="text-center">
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="text-emerald-400 text-4xl animate-spin mb-3"
                  />
                  <p className="text-gray-300 text-base">
                    Loading fresh harvests...
                  </p>
                </div>
              </div>
            ) : searchLoading ? (
              <div className="flex justify-center items-center h-48">
                <div className="text-center">
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="text-emerald-400 text-4xl animate-spin mb-3"
                  />
                  <p className="text-gray-300 text-base">Searching harvests...</p>
                </div>
              </div>
            ) : filteredHarvests.length === 0 && searchQuery ? (
              <div className="flex justify-center items-center h-48">
                <div className="text-center">
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="text-gray-400 text-4xl mb-3"
                  />
                  <p className="text-gray-300 text-lg mb-1">
                    No harvests found
                  </p>
                  <p className="text-gray-500 text-sm">Try a different search term</p>
                </div>
              </div>
            ) : (
              <>
                {searchQuery && (
                  <div className="mb-6 text-gray-300 bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700/30">
                    <p className="text-base">
                      Showing{" "}
                      <span className="text-emerald-400 font-semibold">
                        {filteredHarvests.length}
                      </span>{" "}
                      of{" "}
                      <span className="text-emerald-400 font-semibold">
                        {harvests.length}
                      </span>{" "}
                      harvests
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

        {/* Enhanced Features Section */}
        <section className="py-16 bg-gradient-to-b from-gray-950 to-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2 mb-4">
                <FontAwesomeIcon icon={faAward} className="text-emerald-400 text-sm" />
                <span className="text-emerald-300 font-semibold text-sm">
                  Why Choose Us
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Why Choose{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                  HarvestLink?
                </span>
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                We're revolutionizing the way farmers and buyers connect with
                cutting-edge features
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: faRocket,
                  title: "Fast & Direct",
                  desc: "Connect directly with buyers without intermediaries, reducing costs and time.",
                  color: "emerald",
                },
                {
                  icon: faShieldHeart,
                  title: "Secure Transactions",
                  desc: "Safe and secure payment system ensuring both farmers and buyers are protected.",
                  color: "green",
                },
                {
                  icon: faLightbulb,
                  title: "Smart Insights",
                  desc: "Get valuable insights about market trends and pricing to maximize your profits.",
                  color: "emerald",
                },
                {
                  icon: faTractor,
                  title: "Farm Tools",
                  desc: "Access to agricultural tools and resources to improve your farming practices.",
                  color: "green",
                },
                {
                  icon: faArrowTrendUp,
                  title: "Growth Tracking",
                  desc: "Monitor your sales, trends, and growth with our comprehensive dashboard.",
                  color: "emerald",
                },
                {
                  icon: faUsers,
                  title: "Community Support",
                  desc: "Join a thriving community of farmers and buyers supporting each other.",
                  color: "green",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group bg-gray-800/30 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/30 hover:border-emerald-400/30 transition-all duration-500 hover:transform hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-green-500/0 group-hover:from-emerald-500/5 group-hover:to-green-500/10 transition-all duration-500"></div>
                  <div
                    className={`bg-${feature.color}-500/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300`}
                  >
                    <FontAwesomeIcon
                      icon={feature.icon}
                      className={`text-${feature.color}-400 text-xl`}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2 mb-4">
                <FontAwesomeIcon icon={faHeart} className="text-emerald-400 text-sm" />
                <span className="text-emerald-300 font-semibold text-sm">
                  Success Stories
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                What Our{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                  Users Say
                </span>
              </h2>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <FontAwesomeIcon
                        icon={faUser}
                        className="text-white text-xl"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {testimonials[activeTestimonial].name}
                    </h3>
                    <p className="text-emerald-400 font-semibold text-sm">
                      {testimonials[activeTestimonial].role}
                    </p>
                  </div>
                  <p className="text-lg text-gray-300 text-center leading-relaxed italic">
                    "{testimonials[activeTestimonial].content}"
                  </p>
                  <div className="flex justify-center space-x-2 mt-6">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveTestimonial(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === activeTestimonial
                            ? "bg-emerald-400 w-6"
                            : "bg-gray-600 hover:bg-gray-500"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-gray-900 to-emerald-900/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-8 border border-emerald-500/20 shadow-xl">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to Grow Your{" "}
                  <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                    Business?
                  </span>
                </h2>
                <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
                  Join thousands of farmers and buyers already using HarvestLink
                  to transform their agricultural business.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    to="/register"
                    className="group px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 font-semibold text-base hover:transform hover:-translate-y-0.5"
                  >
                    <FontAwesomeIcon icon={faUserPlus} />
                    Start Selling Today
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    />
                  </Link>
                  <Link
                    to="/marketplace"
                    className="group px-6 py-3 bg-gray-800/50 backdrop-blur-sm text-emerald-400 rounded-xl hover:bg-gray-700/50 transition-all duration-300 border border-gray-700 hover:border-emerald-400 flex items-center justify-center gap-2 font-semibold text-base hover:transform hover:-translate-y-0.5"
                  >
                    <FontAwesomeIcon icon={faStore} />
                    Browse Marketplace
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Modal Slideshow */}
        {selectedImages.length > 0 && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-emerald-400 text-2xl hover:text-emerald-300 bg-gray-900/80 p-2 rounded-xl backdrop-blur-sm transition-all duration-300 hover:bg-gray-800/80 z-10"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <button
              onClick={showPrev}
              className="absolute left-2 text-white text-xl hover:text-emerald-400 p-3 bg-gray-900/80 rounded-xl backdrop-blur-sm transition-all duration-300 hover:bg-gray-800/80 z-10"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <div className="relative max-w-6xl max-h-[85vh] flex items-center justify-center">
              <img
                src={`${API_URL}${selectedImages[currentIndex]}`}
                alt="Harvest Slide"
                className="max-h-[70vh] sm:max-h-[80vh] max-w-full object-contain rounded-xl shadow-xl"
              />
            </div>
            <button
              onClick={showNext}
              className="absolute right-2 text-white text-xl hover:text-emerald-400 p-3 bg-gray-900/80 rounded-xl backdrop-blur-sm transition-all duration-300 hover:bg-gray-800/80 z-10"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
            <div className="absolute bottom-4 text-white text-xs bg-black/70 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-600/50">
              {currentIndex + 1} / {selectedImages.length}
            </div>
          </div>
        )}

        {/* Enhanced Footer */}
        <footer className="bg-gray-900 text-gray-400 mt-auto border-t border-gray-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.01] bg-[size:30px_30px]"></div>
          <div className="container mx-auto px-4 py-12 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Company Info */}
              <div className="lg:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-gradient-to-br from-emerald-400 to-green-600 p-2 rounded-xl shadow-lg">
                    <FontAwesomeIcon
                      icon={faLeaf}
                      className="text-white text-lg"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      HarvestLink
                    </h3>
                    <p className="text-emerald-400 text-xs font-semibold">
                      Grow Together
                    </p>
                  </div>
                </div>
                <p className="mb-4 text-gray-300 leading-relaxed text-sm">
                  Connecting farmers directly with buyers for a sustainable
                  agricultural future in Rwanda and beyond.
                </p>
                <div className="flex space-x-2">
                  {[
                    { icon: faFacebook, color: "blue-500" },
                    { icon: faTwitter, color: "blue-400" },
                    { icon: faInstagram, color: "pink-500" },
                    { icon: faLinkedin, color: "blue-600" },
                    { icon: faYoutube, color: "red-500" },
                    { icon: faWhatsapp, color: "green-500" },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href="#"
                      className="bg-gray-800 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-300 hover:transform hover:-translate-y-0.5 text-sm"
                    >
                      <FontAwesomeIcon icon={social.icon} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-base font-semibold text-white mb-4">
                  Quick Links
                </h3>
                <ul className="space-y-2">
                  {[
                    { icon: faHome, text: "Home", link: "/" },
                    { icon: faInfoCircle, text: "About Us", link: "/about" },
                    { icon: faSeedling, text: "Services", link: "/services" },
                    {
                      icon: faStore,
                      text: "Marketplace",
                      link: "/marketplace",
                    },
                    { icon: faNewspaper, text: "Blog", link: "/blog" },
                    { icon: faEnvelope, text: "Contact", link: "/contact" },
                  ].map((item, index) => (
                    <li key={index}>
                      <Link
                        to={item.link}
                        className="hover:text-emerald-400 transition-all duration-300 flex items-center gap-2 py-1 group text-sm"
                      >
                        <FontAwesomeIcon
                          icon={item.icon}
                          className="w-3 text-emerald-400 group-hover:scale-105 transition-transform"
                        />
                        <span>{item.text}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="text-base font-semibold text-white mb-4">
                  Resources
                </h3>
                <ul className="space-y-2">
                  {[
                    { icon: faQuestionCircle, text: "FAQ", link: "/faq" },
                    {
                      icon: faQuestionCircle,
                      text: "Help Center",
                      link: "/help-center",
                    },
                    {
                      icon: faShieldAlt,
                      text: "Privacy Policy",
                      link: "/privacy-policy",
                    },
                    {
                      icon: faShieldAlt,
                      text: "Terms of Service",
                      link: "/terms-of-service",
                    },
                    {
                      icon: faShippingFast,
                      text: "Shipping Info",
                      link: "/shipping-info",
                    },
                    {
                      icon: faShippingFast,
                      text: "Returns Policy",
                      link: "/returns-policy",
                    },
                  ].map((item, index) => (
                    <li key={index}>
                      <Link
                        to={item.link}
                        className="hover:text-emerald-400 transition-all duration-300 flex items-center gap-2 py-1 group text-sm"
                      >
                        <FontAwesomeIcon
                          icon={item.icon}
                          className="w-3 text-emerald-400 group-hover:scale-105 transition-transform"
                        />
                        <span>{item.text}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-base font-semibold text-white mb-4">
                  Contact Us
                </h3>
                <ul className="space-y-3">
                  {[
                    {
                      icon: faMapMarkerAlt,
                      text: "123 Farm Road, Agricultural District, Kigali, Rwanda",
                    },
                    { icon: faPhone, text: "+250 788 123 456" },
                    { icon: faEnvelope, text: "info@harvestlink.com" },
                    { icon: faGlobe, text: "www.harvestlink.com" },
                    { icon: faWhatsapp, text: "+250 788 123 456" },
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2 group text-sm">
                      <FontAwesomeIcon
                        icon={item.icon}
                        className="text-emerald-400 mt-0.5 flex-shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <span className="text-gray-300 group-hover:text-white transition-colors">
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Additional Links Section */}
            <div className="border-t border-gray-800 pt-8 mb-6">
              <h3 className="text-base font-semibold text-white mb-4 text-center">
                More From HarvestLink
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { icon: faTractor, text: "For Farmers" },
                  { icon: faStore, text: "For Buyers" },
                  { icon: faBriefcase, text: "Careers" },
                  { icon: faHandshake, text: "Partners" },
                  { icon: faChartLine, text: "Investors" },
                  { icon: faUsers, text: "Community" },
                ].map((item, index) => (
                  <Link
                    key={index}
                    to={`/${item.text.toLowerCase().replace(/\s+/g, "-")}`}
                    className="hover:text-emerald-400 transition-all duration-300 flex items-center gap-1 text-xs bg-gray-800/50 p-2 rounded-lg justify-center group hover:bg-gray-700/50"
                  >
                    <FontAwesomeIcon
                      icon={item.icon}
                      className="text-emerald-400 group-hover:scale-105 transition-transform text-xs"
                    />
                    <span>{item.text}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="border-t border-gray-800 pt-8 mb-6">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                <div className="text-center lg:text-left">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Stay Updated
                  </h3>
                  <p className="text-gray-400 max-w-md text-sm">
                    Subscribe to our newsletter for the latest updates on new
                    harvests, market trends, and special offers.
                  </p>
                </div>
                <form
                  onSubmit={handleNewsletterSubmit}
                  className="flex w-full lg:w-auto flex-col sm:flex-row gap-3"
                >
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 text-sm"
                    />
                    <input
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-800 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full lg:w-64 border border-gray-700 placeholder-gray-400 text-sm"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl px-6 py-3 hover:from-emerald-600 hover:to-green-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:transform hover:-translate-y-0.5 text-sm"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-800 pt-6 text-center">
              <p className="text-gray-400 mb-3 text-sm">
                &copy; {new Date().getFullYear()} HarvestLink. All rights
                reserved.
              </p>
              <div className="flex justify-center space-x-4 text-xs">
                {["Sitemap", "Accessibility", "Legal", "Cookies"].map(
                  (item) => (
                    <Link
                      key={item}
                      to={`/${item.toLowerCase()}`}
                      className="hover:text-emerald-400 transition-all duration-300"
                    >
                      {item}
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;