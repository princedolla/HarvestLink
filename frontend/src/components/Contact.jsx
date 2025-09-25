import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faClock,
  faPaperPlane,
  faHeadset
} from '@fortawesome/free-solid-svg-icons';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: faMapMarkerAlt,
      title: "Visit Us",
      details: ["123 Farm Road", "Agricultural District", "Kigali, Rwanda"],
      color: "text-green-400"
    },
    {
      icon: faPhone,
      title: "Call Us",
      details: ["+250 788 123 456", "+250 789 123 456"],
      color: "text-blue-400"
    },
    {
      icon: faEnvelope,
      title: "Email Us",
      details: ["info@harvestlink.com", "support@harvestlink.com"],
      color: "text-purple-400"
    },
    {
      icon: faClock,
      title: "Working Hours",
      details: ["Mon - Fri: 8:00 - 18:00", "Sat: 9:00 - 14:00"],
      color: "text-orange-400"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get in touch with our team. We're here to help you with any questions about HarvestLink.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <FontAwesomeIcon icon={faHeadset} className="mr-3 text-green-400" />
                Get In Touch
              </h2>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start">
                    <div className={`bg-gray-800 p-3 rounded-lg mr-4 ${info.color}`}>
                      <FontAwesomeIcon icon={info.icon} className="text-lg" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{info.title}</h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-400 text-sm">{detail}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Emergency Support */}
              <div className="mt-8 p-4 bg-red-400/10 border border-red-400/30 rounded-lg">
                <h4 className="font-semibold text-red-400 mb-2">Emergency Support</h4>
                <p className="text-sm text-gray-300">For urgent issues outside working hours</p>
                <p className="text-red-400 font-semibold">+250 788 999 999</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all flex items-center"
                >
                  <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12 bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
          <h2 className="text-2xl font-bold mb-6">Find Us</h2>
          <div className="bg-gray-800 rounded-lg h-64 flex items-center justify-center">
            <p className="text-gray-400">Interactive Map would be embedded here</p>
            {/* In a real application, you would embed a Google Map or similar */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;