import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUndoAlt,
  faBoxOpen,
  faExclamationTriangle,
  faTruck,
  faMoneyBillWave,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

const ReturnsPolicy = () => {
  const sections = [
    {
      icon: faBoxOpen,
      title: "Eligibility for Returns",
      content: [
        "You have 7 calendar days to return an item from the date you received it",
        "Your item must be unused and in the same condition you received it",
        "The item must be in the original packaging",
        "A receipt or proof of purchase is required",
      ],
    },
    {
      icon: faExclamationTriangle,
      title: "Non-returnable Items",
      content: [
        "Perishable goods such as fruits, vegetables, or grains",
        "Custom-made or personalized products",
        "Items marked as final sale or clearance",
        "Products damaged due to misuse or negligence",
      ],
    },
    {
      icon: faMoneyBillWave,
      title: "Refunds",
      content: [
        "Refunds are initiated within 5–10 business days after approval",
        "Refunds are made to the original payment method",
        "Partial refunds may apply for items not in original condition",
        "Administrative fees may apply in certain cases",
      ],
    },
    {
      icon: faTruck,
      title: "Shipping",
      content: [
        "Customers are responsible for return shipping costs",
        "Shipping costs are non-refundable",
        "We recommend using a trackable shipping service",
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
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Thank you for shopping with us. If you are not entirely satisfied
            with your purchase, we’re here to help. Please review our policy
            below.
          </p>
        </section>

        {/* Notice */}
        <div className="bg-gradient-to-r from-yellow-600/10 to-orange-600/10 border border-yellow-500/20 rounded-2xl p-6 mb-8">
          <div className="flex items-start">
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="text-yellow-400 text-xl mt-1 mr-4"
            />
            <div>
              <h3 className="text-lg font-semibold mb-2">Important Notice</h3>
              <p className="text-gray-300">
                Agricultural products may naturally vary in appearance and
                quality. Refunds are only applicable for wrong, defective, or
                damaged items.
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
                {section.content.map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* Contact */}
        <section className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="text-gray-300 mb-2">
            If you have any questions about our returns policy, feel free to
            reach out:
          </p>
          <p className="text-green-400">Email: support@harvestlink.rw</p>
          <p className="text-green-400">Phone: +250 788 123 456</p>
          <Link
            to="/contact"
            className="inline-block mt-4 bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Contact Support
          </Link>
        </section>
      </div>
    </div>
  );
};

export default ReturnsPolicy;
