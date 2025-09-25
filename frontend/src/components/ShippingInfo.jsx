import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTruck, 
  faMapMarkerAlt, 
  faClock, 
  faMoneyBillWave,
  faBoxOpen,
  faPhone,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

const ShippingInfo = () => {
  const deliveryAreas = [
    {
      region: "Kigali City",
      areas: ["Gasabo", "Kicukiro", "Nyarugenge"],
      timeframe: "Same day delivery",
      cost: "1,000 - 2,000 RWF",
      notes: "Orders before 2 PM delivered same day"
    },
    {
      region: "Northern Province",
      areas: ["Musanze", "Burera", "Gicumbi", "Rulindo"],
      timeframe: "1-2 business days",
      cost: "2,000 - 4,000 RWF",
      notes: "Mountain areas may have slightly longer delivery times"
    },
    {
      region: "Southern Province",
      areas: ["Huye", "Muhanga", "Nyamagabe", "Nyanza"],
      timeframe: "1-2 business days",
      cost: "2,000 - 4,000 RWF",
      notes: "Direct farmer delivery available in most areas"
    },
    {
      region: "Eastern Province",
      areas: ["Rwamagana", "Kayonza", "Ngoma", "Kirehe"],
      timeframe: "2-3 business days",
      cost: "3,000 - 5,000 RWF",
      notes: "Larger orders may qualify for free delivery"
    },
    {
      region: "Western Province",
      areas: ["Rubavu", "Karongi", "Rutsiro", "Nyamasheke"],
      timeframe: "2-3 business days",
      cost: "3,000 - 5,000 RWF",
      notes: "Lake-side areas may have specific delivery schedules"
    }
  ];

  const deliveryOptions = [
    {
      type: "Farmer Direct Delivery",
      icon: faTruck,
      description: "Farmers deliver directly to your location",
      benefits: ["Freshest possible products", "Direct farmer interaction", "Flexible timing"],
      bestFor: "Local orders, perishable items"
    },
    {
      type: "Partner Logistics",
      icon: faBoxOpen,
      description: "Professional delivery partners handle shipping",
      benefits: ["Tracking available", "Insurance coverage", "Standardized service"],
      bestFor: "Long-distance, high-value orders"
    },
    {
      type: "Pickup Points",
      icon: faMapMarkerAlt,
      description: "Collect from designated pickup locations",
      benefits: ["Reduced costs", "Flexible pickup times", "Multiple locations"],
      bestFor: "Budget-conscious customers, scheduled pickups"
    }
  ];

  const trackingInfo = {
    steps: [
      "Order confirmed: Farmer prepares your order",
      "Picked up: Order collected for delivery",
      "In transit: On the way to your location",
      "Out for delivery: In your area for final delivery",
      "Delivered: Successfully received"
    ],
    contact: {
      phone: "+250 788 123 458",
      email: "shipping@harvestlink.rw",
      hours: "7 AM - 9 PM, 7 days a week"
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <section className="text-center mb-12">
          <FontAwesomeIcon icon={faTruck} className="text-4xl text-green-400 mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Shipping Information
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            Fast, reliable delivery across Rwanda. Fresh produce from farm to your doorstep with care and efficiency.
          </p>
        </section>

        {/* Delivery Options */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Delivery Options</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {deliveryOptions.map((option, index) => (
              <div key={index} className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6 text-center">
                <FontAwesomeIcon icon={option.icon} className="text-green-400 text-3xl mb-4" />
                <h3 className="text-xl font-semibold mb-3">{option.type}</h3>
                <p className="text-gray-300 mb-4">{option.description}</p>
                <div className="text-left">
                  <h4 className="font-semibold text-green-300 mb-2">Benefits:</h4>
                  <ul className="space-y-1 mb-4">
                    {option.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start text-sm">
                        <span className="text-green-400 mr-2">•</span>
                        <span className="text-gray-300">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-yellow-400 text-sm">
                    <strong>Best for:</strong> {option.bestFor}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Delivery Areas & Timeframes */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Delivery Areas & Timeframes</h2>
          <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6 bg-gray-800/50 font-semibold">
              <div>Region</div>
              <div>Areas Covered</div>
              <div>Delivery Time</div>
              <div>Cost Range</div>
              <div>Notes</div>
            </div>
            {deliveryAreas.map((area, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6 border-t border-gray-700">
                <div className="font-semibold text-green-300">{area.region}</div>
                <div className="text-gray-300">{area.areas.join(", ")}</div>
                <div className="text-yellow-300">{area.timeframe}</div>
                <div className="text-green-400">{area.cost}</div>
                <div className="text-gray-400 text-sm">{area.notes}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Tracking Information */}
        <section className="bg-gray-900/50 rounded-2xl border border-gray-800 p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Order Tracking</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Delivery Process</h3>
              <ol className="space-y-3">
                {trackingInfo.steps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-1">
                      {index + 1}
                    </span>
                    <span className="text-gray-300">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Shipping Support</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faPhone} className="text-green-400 mr-3" />
                  <div>
                    <div className="font-semibold">Phone Support</div>
                    <div className="text-gray-300">{trackingInfo.contact.phone}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faClock} className="text-green-400 mr-3" />
                  <div>
                    <div className="font-semibold">Support Hours</div>
                    <div className="text-gray-300">{trackingInfo.contact.hours}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faMoneyBillWave} className="text-green-400 mr-3" />
                  <div>
                    <div className="font-semibold">Email Support</div>
                    <div className="text-gray-300">{trackingInfo.contact.email}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Important Notes */}
        <section className="bg-gradient-to-r from-yellow-600/10 to-orange-600/10 border border-yellow-500/20 rounded-2xl p-6 mb-8">
          <div className="flex items-start">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-400 text-xl mt-1 mr-4" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Important Shipping Notes</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• Perishable items are packed with ice packs during delivery</li>
                <li>• Delivery times may vary during holidays and peak seasons</li>
                <li>• Someone must be available to receive the delivery</li>
                <li>• Delivery fees are calculated based on distance and order size</li>
                <li>• Free delivery available for orders over 50,000 RWF in select areas</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Related Links */}
        <section className="mt-12 text-center">
          <h3 className="text-lg font-semibold text-gray-400 mb-4">Related Information</h3>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/returns" className="text-green-400 hover:text-green-300 transition-colors">Returns Policy</Link>
            <Link to="/faq" className="text-green-400 hover:text-green-300 transition-colors">Delivery FAQ</Link>
            <Link to="/contact" className="text-green-400 hover:text-green-300 transition-colors">Contact Support</Link>
            <Link to="/help-center" className="text-green-400 hover:text-green-300 transition-colors">Help Center</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ShippingInfo;