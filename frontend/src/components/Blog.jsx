import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendar,
  faUser,
  faTags,
  faArrowRight,
  faComment
} from '@fortawesome/free-solid-svg-icons';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Sustainable Farming Practices in Rwanda",
      excerpt: "Discover how Rwandan farmers are adopting sustainable methods to increase yield while protecting the environment.",
      author: "Jean de Dieu",
      date: "2024-01-15",
      category: "Farming Tips",
      image: "/images/blog1.jpg",
      readTime: "5 min read",
      comments: 12
    },
    {
      id: 2,
      title: "Market Trends: What's Hot in Agricultural Products",
      excerpt: "Analysis of current market demands and which crops are seeing the highest profitability this season.",
      author: "Marie Claire",
      date: "2024-01-12",
      category: "Market Analysis",
      image: "/images/blog2.jpg",
      readTime: "7 min read",
      comments: 8
    },
    // Add more blog posts...
  ];

  const categories = [
    "Farming Tips", "Market Analysis", "Technology", "Success Stories", "Policy Updates"
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            HarvestLink Blog
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Insights, tips, and stories from the agricultural community in Rwanda
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 gap-8">
              {blogPosts.map(post => (
                <article key={post.id} className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden hover:border-green-400/30 transition-all duration-300">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-400 mb-3">
                      <span className="bg-green-400/10 text-green-400 px-2 py-1 rounded-full text-xs">
                        {post.category}
                      </span>
                      <span className="mx-2">•</span>
                      <FontAwesomeIcon icon={faCalendar} className="mr-1" />
                      {post.date}
                      <span className="mx-2">•</span>
                      <span>{post.readTime}</span>
                    </div>
                    
                    <h2 className="text-xl font-bold mb-3 hover:text-green-400 transition-colors">
                      <Link to={`/blog/${post.id}`}>{post.title}</Link>
                    </h2>
                    
                    <p className="text-gray-300 mb-4">{post.excerpt}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-400">
                        <FontAwesomeIcon icon={faUser} className="mr-2" />
                        {post.author}
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <FontAwesomeIcon icon={faComment} className="mr-2" />
                        {post.comments}
                      </div>
                    </div>
                    
                    <Link 
                      to={`/blog/${post.id}`} 
                      className="inline-flex items-center text-green-400 hover:text-green-300 mt-4"
                    >
                      Read More <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Categories */}
            <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6 mb-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <FontAwesomeIcon icon={faTags} className="mr-2 text-green-400" />
                Categories
              </h3>
              <ul className="space-y-2">
                {categories.map(category => (
                  <li key={category}>
                    <Link to={`/blog/category/${category.toLowerCase()}`} className="text-gray-300 hover:text-green-400 transition-colors flex justify-between">
                      {category}
                      <span className="bg-gray-800 px-2 rounded-full text-xs">12</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6">
              <h3 className="font-semibold text-lg mb-3">Stay Updated</h3>
              <p className="text-green-100 text-sm mb-4">Get the latest blog posts delivered to your inbox</p>
              <form className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="w-full bg-white/20 text-white placeholder-green-200 rounded-lg px-3 py-2 border border-white/30"
                />
                <button type="submit" className="w-full bg-white text-green-600 rounded-lg py-2 font-semibold hover:bg-gray-100 transition-all">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;