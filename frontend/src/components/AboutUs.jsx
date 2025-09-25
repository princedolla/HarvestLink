import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { API_URL } from "../config";
import { 
  faUsers, 
  faBullseye, // Changed from faTarget
  faHandshake, 
  faLeaf,
  faHeart,
  faChartLine,
  faGlobeAmericas, // Changed from faGlobe
  faAward
} from '@fortawesome/free-solid-svg-icons';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            About HarvestLink
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Revolutionizing agriculture in Rwanda by connecting farmers directly with buyers
          </p>
        </section>

        {/* Mission & Vision */}
        <section className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800">
            <FontAwesomeIcon icon={faBullseye} className="text-green-400 text-4xl mb-4" />
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-300">
              To empower Rwandan farmers by providing a direct marketplace that eliminates intermediaries, 
              increases profitability, and promotes sustainable agricultural practices.
            </p>
          </div>
          
          <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800">
            <FontAwesomeIcon icon={faGlobeAmericas} className="text-green-400 text-4xl mb-4" />
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-gray-300">
              To create a thriving agricultural ecosystem where every farmer has equal access to markets 
              and every buyer can source fresh, quality produce directly from source.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
          <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800">
            <p className="text-gray-300 text-lg leading-relaxed">
              HarvestLink was founded in 2020 by a group of agricultural enthusiasts and tech innovators 
              who recognized the challenges faced by Rwandan farmers. We noticed that despite producing 
              high-quality crops, many farmers struggled to reach profitable markets due to traditional 
              supply chain inefficiencies.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed mt-4">
              Today, we've helped over 1,250 farmers connect directly with 500+ verified buyers, 
              facilitating millions in transactions and significantly improving farmers' livelihoods.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: faHeart, title: "Empowerment", desc: "We believe in empowering farmers with technology" },
              { icon: faHandshake, title: "Transparency", desc: "Clear pricing and direct communication" },
              { icon: faLeaf, title: "Sustainability", desc: "Promoting eco-friendly farming practices" },
              { icon: faChartLine, title: "Growth", desc: "Supporting continuous improvement" },
              { icon: faUsers, title: "Community", desc: "Building strong agricultural networks" },
              { icon: faAward, title: "Excellence", desc: "Commitment to quality service" }
            ].map((value, index) => (
              <div key={index} className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 text-center">
                <FontAwesomeIcon icon={value.icon} className="text-green-400 text-3xl mb-3" />
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-400">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Preview */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Growing Community</h2>
          <p className="text-gray-300 mb-6">Become part of Rwanda's agricultural revolution</p>
          <Link to="/register" className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all">
            Get Started Today
          </Link>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;