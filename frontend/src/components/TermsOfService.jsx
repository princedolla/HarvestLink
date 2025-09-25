import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUndoAlt,
  faBoxOpen,
  faExclamationTriangle,
  faTruck,
  faMoneyBillWave,
  faClock,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

const ReturnsPolicy = () => {
  const sections = [
    {
      icon: faBoxOpen,
      title: "Eligibility for Returns",
      content: [
        "You have 7 calendar days to return an item from the date received",
        "Item must be unused and in the same condition as delivered",
        "Items must be in original packaging with all accessories",
        "Proof of purchase is required for all returns",
      ],
    },
    {
      icon: faExclamationTriangle,
      title: "Non-returnable Items",
      content: [
        "Perishable or consumable goods (e.g., fruits, vegetables, grains)",
        "Custom or made-to-order products",
        "Items marked as final sale or clearance",
        "Products damaged due to misuse or negligence",
      ],
    },
    {
      icon: faMoneyBillWave,
      title: "Refunds",
      content: [
        "Refunds are processed within 5–10 business days after approval",
        "Refunds are made to the original payment method",
        "Administrative fees may apply for refund processing",
        "Partial refunds may be granted for items not in original condition",
      ],
    },
    {
      icon: faTruck,
      title: "Return Shipping",
      content: [
        "Customers are responsible for return shipping costs",
        "Shipping costs are non-refundable",
        "We recommend using a trackable shipping service",
      ],
    },
    {
      icon: faClock,
      title: "Processing Timeline",
      content: [
        "Return requests must be initiated within 7 days of delivery",
        "Inspection and approval take up to 3 business days after receipt",
        "Refunds may take 5–10 days to reflect depending on payment provider",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <section className="text-center mb-12">
          <FontAwesomeIcon
            icon={faUndoAlt}
            className="text-4xl text-green-400 mb-4"
          />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Returns & Refund Policy
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            Effective Date: January 15, 2024. Please read our return and refund
            guidelines carefully before making a request.
          </p>
        </section>

        {/* Notice */}
        <div className="bg-gradient-to-r from-red-600/10 to-orange-600/10 border border-red-500/20 rounded-2xl p-6 mb-8">
          <div className="flex items-start">
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="text-red-400 text-xl mt-1 mr-4"
            />
            <div>
              <h3 className="text-lg font-semibold mb-2">Important Notice</h3>
              <p className="text-gray-300">
                Agricultural products are natural and may vary in appearance and
                quality. Refunds are only applicable for significant defects,
                wrong items, or damaged goods.
              </p>
            </div>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-8 mb-12">
          {sections.map((section, index) => (
            <section
              key={index}
              className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6"
            >
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={section.icon}
                  className="text-green-400 text-2xl mr-4"
                />
                <h2 className="text-2xl font-bold">{section.title}</h2>
              </div>

              <ul className="space-y-2">
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* Related Links */}
        <section className="mt-12 text-center">
          <h3 className="text-lg font-semibold text-gray-400 mb-4">
            Related Documents
          </h3>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              to="/terms"
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy-policy"
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/shipping"
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              Shipping Information
            </Link>
            <Link
              to="/help-center"
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              Help Center
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ReturnsPolicy;
