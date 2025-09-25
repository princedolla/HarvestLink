import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faTractor,
  faStore,
  faChartLine,
  faShieldAlt,
  faShippingFast,
  faMobileAlt,
} from "@fortawesome/free-solid-svg-icons";

const Services = () => {
  const services = [
    {
      icon: faTractor,
      title: "For Farmers",
      features: [
        "Direct market access to buyers",
        "Fair pricing without intermediaries",
        "Digital payment solutions",
        "Market trend insights",
        "Inventory management tools",
      ],
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: faStore,
      title: "For Buyers",
      features: [
        "Fresh produce directly from farms",
        "Quality assurance guarantees",
        "Bulk ordering capabilities",
        "Delivery coordination",
        "Supplier relationship management",
      ],
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: faChartLine,
      title: "Analytics & Insights",
      features: [
        "Real-time market pricing",
        "Demand forecasting",
        "Sales performance tracking",
        "Seasonal trend analysis",
        "Custom reporting dashboards",
      ],
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: faShieldAlt,
      title: "Secure Transactions",
      features: [
        "Escrow payment protection",
        "Verified user profiles",
        "Dispute resolution service",
        "Transaction history tracking",
        "Secure messaging system",
      ],
      color: "from-orange-500 to-red-500",
    },
    {
      icon: faShippingFast,
      title: "Logistics Support",
      features: [
        "Delivery coordination",
        "Route optimization",
        "Cold chain management",
        "Real-time tracking",
        "Multiple transport options",
      ],
      color: "from-yellow-500 to-amber-500",
    },
    {
      icon: faMobileAlt,
      title: "Mobile Platform",
      features: [
        "User-friendly mobile app",
        "Offline capability",
        "SMS notifications",
        "Multi-language support",
        "24/7 customer service",
      ],
      color: "from-indigo-500 to-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Our Services
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive solutions designed to empower farmers and streamline
            agricultural commerce
          </p>
        </section>

        {/* Services Grid */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 hover:border-green-400/30 transition-all duration-300"
            >
              <div
                className={`bg-gradient-to-r ${service.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4`}
              >
                <FontAwesomeIcon
                  icon={service.icon}
                  className="text-white text-2xl"
                />
              </div>
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-center text-gray-300"
                  >
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-green-100 mb-6 text-lg">
            Join thousands of farmers and buyers already using HarvestLink
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
            >
              Sign Up Free
            </Link>
            <Link
              to="/contact"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all"
            >
              Contact Sales
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Services;
