import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faQuestionCircle, 
  faUser, 
  faShoppingCart,
  faSeedling,
  faCreditCard,
  faTruck,
  faShieldAlt,
  faPhone,
  faEnvelope,
  faChevronDown,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons';

const HelpCenter = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const faqCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: faUser,
      questions: [
        {
          question: 'How do I create an account?',
          answer: 'Click on the "Register" button in the top navigation. Fill in your details including name, email, phone number, and choose a secure password. You\'ll receive a verification email to activate your account.'
        },
        {
          question: 'What information do I need to register as a farmer?',
          answer: 'Farmers need to provide: valid identification, farm location details, types of crops grown, farm size, and banking information for payments.'
        },
        {
          question: 'How do I verify my account?',
          answer: 'After registration, check your email for a verification link. Click the link to verify your account. If you don\'t see the email, check your spam folder.'
        }
      ]
    },
    {
      id: 'buying',
      title: 'Buying Products',
      icon: faShoppingCart,
      questions: [
        {
          question: 'How do I search for products?',
          answer: 'Use the search bar on the marketplace page or browse by category. You can filter by product type, farmer location, price range, and harvest date.'
        },
        {
          question: 'What payment methods are accepted?',
          answer: 'We accept mobile money (MTN, Airtel), bank transfers, and credit/debit cards. All payments are secure and encrypted.'
        },
        {
          question: 'How is delivery handled?',
          answer: 'Farmers can deliver directly or use our partner logistics services. Delivery costs and timelines are displayed before purchase.'
        }
      ]
    },
    {
      id: 'farming',
      title: 'For Farmers',
      icon: faSeedling,
      questions: [
        {
          question: 'How do I list my products?',
          answer: 'Go to your dashboard, click "Add Harvest", fill in product details including type, quantity, price, quality grade, and harvest date. Add clear photos for better visibility.'
        },
        {
          question: 'When do I get paid?',
          answer: 'Payments are processed within 24-48 hours after successful delivery and buyer confirmation. Funds are transferred directly to your registered bank account or mobile money.'
        },
        {
          question: 'What are the commission fees?',
          answer: 'We charge a 5% commission on successful transactions. There are no listing fees or monthly charges for farmers.'
        }
      ]
    },
    {
      id: 'payments',
      title: 'Payments & Pricing',
      icon: faCreditCard,
      questions: [
        {
          question: 'Are there any hidden fees?',
          answer: 'No hidden fees. All costs including commission, delivery charges, and taxes are clearly displayed before you complete any transaction.'
        },
        {
          question: 'How are prices determined?',
          answer: 'Farmers set their prices based on market rates, quality, and production costs. We provide market trend data to help farmers price competitively.'
        },
        {
          question: 'What if a payment fails?',
          answer: 'If payment fails, check your internet connection and payment method details. Failed payments are automatically canceled and no charges are made.'
        }
      ]
    },
    {
      id: 'delivery',
      title: 'Delivery & Logistics',
      icon: faTruck,
      questions: [
        {
          question: 'What are the delivery areas?',
          answer: 'We currently serve all districts of Rwanda. Delivery times vary from same-day in Kigali to 2-3 days for remote areas.'
        },
        {
          question: 'Who handles the delivery?',
          answer: 'Farmers can choose to deliver themselves or use our verified logistics partners. Buyers can see the delivery method before purchasing.'
        },
        {
          question: 'What if my order arrives damaged?',
          answer: 'Take photos of the damaged goods and contact support immediately. We offer refunds or replacements for damaged items within 24 hours of delivery.'
        }
      ]
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      icon: faShieldAlt,
      questions: [
        {
          question: 'Is my personal information safe?',
          answer: 'Yes, we use bank-level encryption and comply with Rwanda data protection laws. We never share your personal information with third parties without consent.'
        },
        {
          question: 'How secure are transactions?',
          answer: 'All transactions are encrypted and processed through secure payment gateways. We don\'t store your payment details on our servers.'
        },
        {
          question: 'Can I delete my account?',
          answer: 'Yes, you can delete your account from the settings page. Note that this action is permanent and cannot be undone.'
        }
      ]
    }
  ];

  const toggleCategory = (categoryId) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
  };

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const contactMethods = [
    {
      icon: faPhone,
      title: 'Call Us',
      details: '+250 788 123 456',
      description: 'Available 7AM-9PM, 7 days a week'
    },
    {
      icon: faEnvelope,
      title: 'Email Us',
      details: 'support@harvestlink.rw',
      description: 'We respond within 2 hours'
    },
    {
      icon: faQuestionCircle,
      title: 'Live Chat',
      details: 'Start Chat',
      description: 'Instant help during business hours'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Help Center
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Find answers to common questions or get in touch with our support team
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for answers..."
                className="w-full px-6 py-4 bg-gray-900 border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FontAwesomeIcon 
                icon={faSearch} 
                className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="grid md:grid-cols-3 gap-6 mb-16">
          {contactMethods.map((method, index) => (
            <div key={index} className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 text-center hover:border-green-500 transition-all duration-300">
              <FontAwesomeIcon icon={method.icon} className="text-green-400 text-3xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">{method.title}</h3>
              <p className="text-green-400 font-medium mb-1">{method.details}</p>
              <p className="text-gray-400 text-sm">{method.description}</p>
            </div>
          ))}
        </section>

        {/* FAQ Categories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {filteredCategories.map((category) => (
              <div key={category.id} className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden">
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-800/50 transition-colors"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center space-x-4">
                    <FontAwesomeIcon icon={category.icon} className="text-green-400 text-xl" />
                    <span className="text-xl font-semibold">{category.title}</span>
                  </div>
                  <FontAwesomeIcon 
                    icon={activeCategory === category.id ? faChevronUp : faChevronDown} 
                    className="text-gray-400"
                  />
                </button>
                
                {activeCategory === category.id && (
                  <div className="px-6 pb-4">
                    <div className="space-y-4">
                      {category.questions.map((item, index) => (
                        <div key={index} className="pt-4 border-t border-gray-800 first:border-t-0">
                          <h4 className="font-semibold text-lg mb-2 text-green-300">{item.question}</h4>
                          <p className="text-gray-300">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Additional Help Section */}
        <section className="bg-gradient-to-r from-green-600/10 to-emerald-600/10 p-8 rounded-2xl border border-green-500/20">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help you with any questions or issues.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/contact" 
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Contact Support
              </Link>
              <button className="border border-green-500 text-green-400 px-6 py-3 rounded-lg hover:bg-green-500/10 transition-colors">
                Schedule a Call
              </button>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="mt-12 text-center">
          <h3 className="text-lg font-semibold text-gray-400 mb-4">Quick Links</h3>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/faq" className="text-green-400 hover:text-green-300 transition-colors">FAQ</Link>
            <Link to="/privacy-policy" className="text-green-400 hover:text-green-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-green-400 hover:text-green-300 transition-colors">Terms of Service</Link>
            <Link to="/blog" className="text-green-400 hover:text-green-300 transition-colors">Blog</Link>
            <Link to="/about" className="text-green-400 hover:text-green-300 transition-colors">About Us</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HelpCenter;