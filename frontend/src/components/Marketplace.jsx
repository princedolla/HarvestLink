import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilter,
  faShoppingCart,
  faHeart,
  faShare,
  faStar,
  faMapMarkerAlt,
  faSeedling,
  faTruck,
  faClock,
  faFire,
  faTag,
  faSort,
  faEye,
  faChartLine,
  faUsers,
  faShieldAlt,
  faLeaf,
  faRecycle,
} from "@fortawesome/free-solid-svg-icons";

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Mock data with Pixabay images
  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        name: "Fresh Avocados",
        farmer: "Green Valley Farms",
        price: 2500,
        originalPrice: 3000,
        category: "fruits",
        image: "https://cdn.pixabay.com/photo/2016/03/05/22/45/avocado-1236523_960_720.jpg",
        rating: 4.8,
        reviews: 124,
        location: "Musanze, Northern Province",
        harvestDate: "2024-01-15",
        quantity: 150,
        unit: "kg",
        organic: true,
        featured: true,
        discount: 17,
      },
      {
        id: 2,
        name: "Organic Potatoes",
        farmer: "Mountain Harvest",
        price: 800,
        originalPrice: 1000,
        category: "vegetables",
        image: "https://cdn.pixabay.com/photo/2016/11/18/16/17/potatoes-1836415_960_720.jpg",
        rating: 4.6,
        reviews: 89,
        location: "Rubavu, Western Province",
        harvestDate: "2024-01-10",
        quantity: 500,
        unit: "kg",
        organic: true,
        featured: true,
        discount: 20,
      },
      {
        id: 3,
        name: "Rwandan Coffee Beans",
        farmer: "Hillside Coffee Co.",
        price: 12000,
        originalPrice: 15000,
        category: "beverages",
        image: "https://cdn.pixabay.com/photo/2016/11/29/09/32/coffee-1869598_960_720.jpg",
        rating: 4.9,
        reviews: 256,
        location: "Huye, Southern Province",
        harvestDate: "2024-01-05",
        quantity: 75,
        unit: "kg",
        organic: false,
        featured: true,
        discount: 20,
      },
      {
        id: 4,
        name: "Fresh Bananas",
        farmer: "Sunrise Plantations",
        price: 600,
        originalPrice: 600,
        category: "fruits",
        image: "https://cdn.pixabay.com/photo/2018/04/29/19/53/bananas-3365651_960_720.jpg",
        rating: 4.4,
        reviews: 67,
        location: "Ngoma, Eastern Province",
        harvestDate: "2024-01-12",
        quantity: 300,
        unit: "bunch",
        organic: true,
        featured: false,
        discount: 0,
      },
      {
        id: 5,
        name: "Organic Tomatoes",
        farmer: "Green Thumb Gardens",
        price: 1200,
        originalPrice: 1500,
        category: "vegetables",
        image: "https://cdn.pixabay.com/photo/2014/04/10/11/22/tomatoes-320860_960_720.jpg",
        rating: 4.7,
        reviews: 143,
        location: "Gasabo, Kigali",
        harvestDate: "2024-01-08",
        quantity: 200,
        unit: "kg",
        organic: true,
        featured: true,
        discount: 20,
      },
      {
        id: 6,
        name: "Passion Fruits",
        farmer: "Tropical Delights",
        price: 1800,
        originalPrice: 2000,
        category: "fruits",
        image: "https://cdn.pixabay.com/photo/2017/08/07/22/36/passion-fruit-2608857_960_720.jpg",
        rating: 4.5,
        reviews: 91,
        location: "Nyamagabe, Southern Province",
        harvestDate: "2024-01-14",
        quantity: 120,
        unit: "kg",
        organic: false,
        featured: false,
        discount: 10,
      },
    ];

    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.farmer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort(
          (a, b) => new Date(b.harvestDate) - new Date(a.harvestDate)
        );
        break;
      default:
        // featured first, then by rating
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.rating - a.rating;
        });
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

  const categories = [
    { id: "all", name: "All Products", icon: faLeaf, count: products.length },
    {
      id: "fruits",
      name: "Fruits",
      icon: faSeedling,
      count: products.filter((p) => p.category === "fruits").length,
    },
    {
      id: "vegetables",
      name: "Vegetables",
      icon: faLeaf,
      count: products.filter((p) => p.category === "vegetables").length,
    },
    {
      id: "beverages",
      name: "Beverages",
      icon: faRecycle,
      count: products.filter((p) => p.category === "beverages").length,
    },
    {
      id: "grains",
      name: "Grains",
      icon: faSeedling,
      count: products.filter((p) => p.category === "grains").length,
    },
    {
      id: "dairy",
      name: "Dairy",
      icon: faTruck,
      count: products.filter((p) => p.category === "dairy").length,
    },
  ];

  const stats = [
    { icon: faUsers, value: "1,250+", label: "Active Farmers" },
    { icon: faLeaf, value: "50+", label: "Product Categories" },
    { icon: faTruck, value: "24h", label: "Delivery Time" },
    { icon: faShieldAlt, value: "100%", label: "Quality Guarantee" },
  ];

  const ProductCard = ({ product }) => (
    <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
            -{product.discount}%
          </span>
        )}
        {product.organic && (
          <span className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-sm">
            <FontAwesomeIcon icon={faLeaf} className="mr-1" />
            Organic
          </span>
        )}
        <button className="absolute top-12 right-3 bg-gray-900/80 rounded-full p-2 hover:bg-red-500/80 transition-colors">
          <FontAwesomeIcon icon={faHeart} className="text-white" />
        </button>
        <button className="absolute top-24 right-3 bg-gray-900/80 rounded-full p-2 hover:bg-green-500/80 transition-colors">
          <FontAwesomeIcon icon={faShare} className="text-white" />
        </button>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg truncate">{product.name}</h3>
          {product.featured && (
            <FontAwesomeIcon icon={faFire} className="text-yellow-500 ml-2" />
          )}
        </div>

        <p className="text-gray-400 text-sm mb-2">{product.farmer}</p>

        <div className="flex items-center mb-2">
          <FontAwesomeIcon
            icon={faMapMarkerAlt}
            className="text-green-400 text-xs mr-1"
          />
          <span className="text-gray-400 text-sm">{product.location}</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faStar}
              className="text-yellow-400 text-sm"
            />
            <span className="text-white ml-1 text-sm">{product.rating}</span>
            <span className="text-gray-500 text-sm ml-1">
              ({product.reviews})
            </span>
          </div>
          <div className="text-gray-400 text-sm">
            <FontAwesomeIcon icon={faClock} className="mr-1" />
            {new Date(product.harvestDate).toLocaleDateString()}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            {product.discount > 0 ? (
              <>
                <span className="text-lg font-bold text-green-400">
                  {product.price.toLocaleString()} RWF
                </span>
                <span className="text-gray-500 line-through text-sm ml-2">
                  {product.originalPrice.toLocaleString()} RWF
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-green-400">
                {product.price.toLocaleString()} RWF
              </span>
            )}
            <span className="text-gray-400 text-sm block">
              per {product.unit}
            </span>
          </div>
          <button
            onClick={() => setSelectedProduct(product)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faEye} className="mr-2" />
            View
          </button>
        </div>
      </div>
    </div>
  );

  const ProductModal = ({ product, onClose }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Product Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Farmer:</span>
                  <span>{product.farmer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Location:</span>
                  <span>{product.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Harvest Date:</span>
                  <span>
                    {new Date(product.harvestDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Available Quantity:</span>
                  <span>
                    {product.quantity} {product.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Quality Rating:</span>
                  <span className="flex items-center">
                    <FontAwesomeIcon
                      icon={faStar}
                      className="text-yellow-400 mr-1"
                    />
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <div className="text-3xl font-bold text-green-400 mb-4">
                  {product.price.toLocaleString()} RWF
                  {product.discount > 0 && (
                    <span className="text-red-500 text-lg ml-2">
                      -{product.discount}%
                    </span>
                  )}
                </div>

                <div className="flex space-x-4">
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors">
                    <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                    Add to Cart
                  </button>
                  <button className="px-4 border border-green-500 text-green-400 rounded-lg hover:bg-green-500/10 transition-colors">
                    <FontAwesomeIcon icon={faHeart} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            FreshFarm Marketplace
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Discover fresh, high-quality produce directly from Rwandan farmers.
            Support local agriculture while enjoying the best prices.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for fruits, vegetables, farmers..."
                className="w-full px-6 py-4 bg-gray-900 border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <FontAwesomeIcon
                  icon={stat.icon}
                  className="text-green-400 text-2xl mb-2"
                />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-2xl border transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? "bg-green-600 border-green-500"
                    : "bg-gray-900 border-gray-800 hover:border-green-500"
                }`}
              >
                <FontAwesomeIcon icon={cat.icon} />
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default Marketplace;
