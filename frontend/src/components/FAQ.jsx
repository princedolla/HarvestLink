import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How do I register as a farmer?",
      answer: "Click on the Register button and select 'Farmer' account type. You'll need to provide basic information and farming details."
    },
    // Add more FAQs...
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-20">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h1>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-900/50 rounded-lg border border-gray-800">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-semibold">{faq.question}</span>
                <FontAwesomeIcon 
                  icon={activeIndex === index ? faChevronUp : faChevronDown} 
                  className="text-green-400"
                />
              </button>
              
              {activeIndex === index && (
                <div className="px-6 pb-4 text-gray-300">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;