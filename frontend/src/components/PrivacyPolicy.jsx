import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShieldAlt, 
  faDatabase, 
  faUserLock, 
  faCookie,
  faEye,
  faHandshake,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: faDatabase,
      title: "Information We Collect",
      content: [
        "Personal Information: Name, email, phone number, address when you register",
        "Farm Details: Location, crop types, farm size for farmer accounts",
        "Transaction Data: Purchase history, payment information",
        "Technical Data: IP address, browser type, device information",
        "Usage Data: How you interact with our platform"
      ]
    },
    {
      icon: faUserLock,
      title: "How We Use Your Information",
      content: [
        "To provide and maintain our agricultural marketplace services",
        "To process transactions and facilitate farmer-buyer connections",
        "To communicate about orders, accounts, and platform updates",
        "To improve our services and develop new features",
        "To ensure platform security and prevent fraud"
      ]
    },
    {
      icon: faHandshake,
      title: "Information Sharing",
      content: [
        "With farmers/buyers: Necessary information for transaction completion",
        "Service Providers: Payment processors, delivery partners (only essential data)",
        "Legal Requirements: When required by Rwandan law or legal process",
        "Business Transfers: In case of merger or acquisition",
        "Never sold: We do not sell your personal data to third parties"
      ]
    },
    {
      icon: faCookie,
      title: "Cookies & Tracking",
      content: [
        "Essential Cookies: Required for platform functionality",
        "Analytics Cookies: Help us understand how users interact with our site",
        "Preference Cookies: Remember your settings and preferences",
        "Marketing Cookies: Show relevant agricultural product offers",
        "You can control cookies through your browser settings"
      ]
    },
    {
      icon: faShieldAlt,
      title: "Data Security",
      content: [
        "Encryption: All sensitive data is encrypted in transit and at rest",
        "Access Controls: Strict role-based access to personal information",
        "Regular Audits: Security assessments and vulnerability testing",
        "Data Minimization: We only collect what's necessary for service delivery",
        "Staff Training: Regular privacy and security training for our team"
      ]
    },
    {
      icon: faEye,
      title: "Your Rights",
      content: [
        "Access: Right to know what personal data we hold about you",
        "Correction: Right to correct inaccurate or incomplete information",
        "Deletion: Right to request deletion of your personal data",
        "Portability: Right to receive your data in a readable format",
        "Objection: Right to object to certain data processing activities"
      ]
    }
  ];

  const contactInfo = {
    email: "privacy@harvestlink.rw",
    phone: "+250 788 123 456",
    address: "KG 123 St, Kigali, Rwanda",
    dpo: "Data Protection Officer: privacy@harvestlink.rw"
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <section className="text-center mb-12">
          <FontAwesomeIcon icon={faShieldAlt} className="text-4xl text-green-400 mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            Last updated: January 15, 2024. We are committed to protecting your privacy and ensuring transparency in how we handle your data.
          </p>
        </section>

        {/* Quick Summary */}
        <div className="bg-gradient-to-r from-green-600/10 to-emerald-600/10 border border-green-500/20 rounded-2xl p-6 mb-8">
          <div className="flex items-start">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-400 text-xl mt-1 mr-4" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Important Summary</h3>
              <p className="text-gray-300">
                We collect only necessary information to provide our agricultural marketplace services. 
                Your data is never sold to third parties. You have full control over your personal information.
              </p>
            </div>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-8 mb-12">
          {sections.map((section, index) => (
            <section key={index} className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon icon={section.icon} className="text-green-400 text-2xl mr-4" />
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

        {/* Contact Information */}
        <section className="bg-gray-900/50 rounded-2xl border border-gray-800 p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Contact Us</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Privacy Concerns</h3>
              <p className="text-gray-300">Email: {contactInfo.email}</p>
              <p className="text-gray-300">Phone: {contactInfo.phone}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Data Protection Officer</h3>
              <p className="text-gray-300">{contactInfo.dpo}</p>
              <p className="text-gray-300">Address: {contactInfo.address}</p>
            </div>
          </div>
        </section>

        {/* Policy Updates */}
        <section className="text-center bg-gray-900/30 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-2">Policy Updates</h3>
          <p className="text-gray-300">
            We may update this policy periodically. Significant changes will be notified via email or platform announcements. 
            Continued use of HarvestLink constitutes acceptance of updated policies.
          </p>
        </section>

        {/* Related Links */}
        <section className="mt-12 text-center">
          <h3 className="text-lg font-semibold text-gray-400 mb-4">Related Documents</h3>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/terms" className="text-green-400 hover:text-green-300 transition-colors">Terms of Service</Link>
            <Link to="/shipping" className="text-green-400 hover:text-green-300 transition-colors">Shipping Information</Link>
            <Link to="/returns" className="text-green-400 hover:text-green-300 transition-colors">Returns Policy</Link>
            <Link to="/help-center" className="text-green-400 hover:text-green-300 transition-colors">Help Center</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;