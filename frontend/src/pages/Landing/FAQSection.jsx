import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How do I get started with your platform?",
    answer:
      "Getting started is easy! Simply create an account, choose your preferred plan, and follow our step-by-step onboarding guide. Our support team is available 24/7 to help you with any questions during the setup process.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely using industry-standard encryption.",
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer: "Yes, you can cancel your subscription at any time from your account settings. There are no cancellation fees, and you'll continue to have access to your account until the end of your current billing period.",
  },
  {
    question: "Do you offer customer support?",
    answer: "Absolutely! We provide 24/7 customer support through live chat, email, and phone. Our experienced support team is here to help you with any questions or technical issues you might encounter.",
  },
  {
    question: "Is my data secure with your platform?",
    answer: "Security is our top priority. We use enterprise-grade encryption, regular security audits, and comply with industry standards like SOC 2 and GDPR to ensure your data is always protected and private.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <section className="bg-gray-900 text-white px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-blue-400 text-sm font-semibold tracking-wider uppercase mb-3">
            Support
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Find answers to common questions about our platform, features, and services. 
            Can't find what you're looking for? Contact our support team.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-gray-800 rounded-xl border border-gray-700 transition-all duration-300 hover:border-blue-500/50 ${
                openIndex === index ? 'border-blue-500/50 shadow-lg shadow-blue-500/10' : ''
              }`}
            >
              <div
                className="flex justify-between items-center p-6 cursor-pointer group"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="font-semibold text-lg sm:text-xl text-white group-hover:text-blue-400 transition-colors duration-200 pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <Minus className="w-6 h-6 text-blue-400 transition-transform duration-200" />
                  ) : (
                    <Plus className="w-6 h-6 text-gray-400 group-hover:text-blue-400 transition-colors duration-200" />
                  )}
                </div>
              </div>
              
              {/* Animated Answer */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-6 pb-6">
                  <div className="border-t border-gray-700 pt-4">
                    <p className="text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-12 lg:mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8">
            <h3 className="text-xl font-semibold mb-3">Still have questions?</h3>
            <p className="text-blue-100 mb-6 max-w-md mx-auto">
              Our support team is here to help you with any additional questions you might have.
            </p>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;