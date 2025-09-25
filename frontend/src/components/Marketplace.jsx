import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
  faEye,
  faUsers,
  faShieldAlt,
  faLeaf,
  faRecycle
} from '@fortawesome/free-solid-svg-icons';

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        name: 'Fresh Avocados',
        farmer: 'Green Valley Farms',
        price: 2500,
        originalPrice: 3000,
        category: 'fruits',
        image: '/api/placeholder/300/200',
        rating: 4.8,
        reviews: 124,
        location: 'Musanze, Northern Province',
        harvestDate: '2024-01-15',
        quantity: 150,
        unit: 'kg',
        organic: true,
        featured: true,
        discount: 17
      },
      {
        id: 2,
        name: 'Organic Potatoes',
        farmer: 'Mountain Harvest',
        price: 800,
        originalPrice: 1000,
        category: 'vegetables',
        image: '/api/placeholder/300/200',
        rating: 4.6,
        reviews: 89,
        location: 'Rubavu, Western Province',
        harvestDate: '2024-01-10',
        quantity: 500,
        unit: 'kg',
        organic: true,
        featured: true,
        discount: 20
      },
      {
        id: 3,
        name: 'Rwandan Coffee Beans',
        farmer: 'Hillside Coffee Co.',
        price: 12000,
        originalPrice: 15000,
        category: 'beverages',
        image: '/api/placeholder/300/200',
        rating: 4.9,
        reviews: 256,
        location: 'Huye, Southern Province',
        harvestDate: '2024-01-05',
        quantity: 75,
        unit: 'kg',
        organic: false,
        featured: true,
        discount: 20
      },
      {
        id: 4,
        name: 'Fresh Bananas',
        farmer: 'Sunrise Plantations',
        price: 600,
        originalPrice: 600,
        category: 'fruits',
        image: '/api/placeholder/300/200',
        rating: 4.4,
        reviews: 67,
        location: 'Ngoma, Eastern Province',
        harvestDate: '2024-01-12',
        quantity: 300,
        unit: 'bunch',
        organic: true,
        featured: false,
        discount: 0
      },
      {
        id: 5,
        name: 'Organic Tomatoes',
        farmer: 'Green Thumb Gardens',
        price: 1200,
        originalPrice: 1500,
        category: 'vegetables',
        image: '/api/placeholder/300/200',
        rating: 4.7,
        reviews: 143,
        location: 'Gasabo, Kigali',
        harvestDate: '2024-01-08',
        quantity: 200,
        unit: 'kg',
        organic: true,
        featured: true,
        discount: 20
      },
      {
        id: 6,
        name: 'Passion Fruits',
        farmer: 'Tropical Delights',
        price: 1800,
        originalPrice: 2000,
        category: 'fruits',
        image: '/api/placeholder/300/200',
        rating: 4.5,
        reviews: 91,
        location: 'Nyamagabe, Southern Province',
        harvestDate: '2024-01-14',
        quantity: 120,
        unit: 'kg',
        organic: false,
        featured: false,
        discount: 10
      }
    ];
    
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.farmer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.harvestDate) - new Date(a.harvestDate));
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
    { id: 'all', name: 'All Products', icon: faLeaf, count: products.length },
    { id: 'fruits', name: 'Fruits', icon: faSeedling, count: products.filter(p => p.category === 'fruits').length },
    { id: 'vegetables', name: 'Vegetables', icon: faLeaf, count: products.filter(p => p.category === 'vegetables').length },
    { id: 'beverages', name: 'Beverages', icon: faRecycle, count: products.filter(p => p.category === 'beverages').length },
    { id: 'grains', name: 'Grains', icon: faSeedling, count: products.filter(p => p.category === 'grains').length },
    { id: 'dairy', name: 'Dairy', icon: faTruck, count: products.filter(p => p.category === 'dairy').length }
  ];

  const stats = [
    { icon: faUsers, value: '1,250+', label: 'Active Farmers' },
    { icon: faLeaf, value: '50+', label: 'Product Categories' },
    { icon: faTruck, value: '24h', label: 'Delivery Time' },
    { icon: faShieldAlt, value: '100%', label: 'Quality Guarantee' }
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
          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-green-400 text-xs mr-1" />
          <span className="text-gray-400 text-sm">{product.location}</span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-sm" />
            <span className="text-white ml-1 text-sm">{product.rating}</span>
            <span className="text-gray-500 text-sm ml-1">({product.reviews})</span>
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
                <span className="text-lg font-bold text-green-400">{product.price.toLocaleString()} RWF</span>
                <span className="text-gray-500 line-through text-sm ml-2">{product.originalPrice.toLocaleString()} RWF</span>
              </>
            ) : (
              <span className="text-lg font-bold text-green-400">{product.price.toLocaleString()} RWF</span>
            )}
            <span className="text-gray-400 text-sm block">per {product.unit}</span>
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
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">×</button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <img src={product.image} alt={product.name} className="w-full h-64 object-cover rounded-lg" />
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
                  <span>{new Date(product.harvestDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Available Quantity:</span>
                  <span>{product.quantity} {product.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Quality Rating:</span>
                  <span className="flex items-center">
                    <FontAwesomeIcon icon={faStar} className="text-yellow-400 mr-1" />
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="text-3xl font-bold text-green-400 mb-4">
                  {product.price.toLocaleString()} RWF
                  {product.discount > 0 && (
                    <span className="text-red-500 text-lg ml-2">-{product.discount}%</span>
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
            Discover fresh, high-quality produce directly from Rwandan farmers. Support local agriculture while enjoying the best prices.
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
                <FontAwesomeIcon icon={stat.icon} className="text-green-400 text-2xl mb-2" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FontAwesomeIcon icon={faFilter} className="mr-2 text-green-400" />
                Filters
              </h3>
              
              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="flex items-center">
                          <FontAwesomeIcon icon={category.icon} className="mr-2 text-sm" />
                          {category.name}
                        </span>
                        <span className="bg-gray-800 px-2 py-1 rounded text-xs">{category.count}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Price Range (RWF)</h4>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>0 RWF</span>
                    <span>{priceRange[1].toLocaleString()} RWF</span>
                  </div>
                </div>
              </div>
              
              {/* Special Filters */}
              <div>
                <h4 className="font-medium mb-3">Special</h4>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                    <FontAwesomeIcon icon={faFire} className="mr-2 text-red-400" />
                    Hot Deals
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                    <FontAwesomeIcon icon={faLeaf} className="mr-2 text-green-400" />
                    Organic Only
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <div className="text-gray-400 mb-4 sm:mb-0">
                Showing {filteredProducts.length} of {products.length} products
              </div>
              
              <div className="flex items-center space-x-4">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                </select>
                
                <div className="flex border border-gray-700 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-green-500' : 'bg-gray-900'}`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-green-500' : 'bg-gray-900'}`}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'
              }`}>
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FontAwesomeIcon icon={faSearch} className="text-4xl text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-gray-400">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600/10 to-emerald-600/10 py-16 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Buy Fresh Produce?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust FreshFarm for their daily fresh produce needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Start Shopping Now
            </Link>
            <button className="border border-green-500 text-green-400 px-8 py-3 rounded-lg hover:bg-green-500/10 transition-colors">
              Learn More
            </button>
          </div>
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