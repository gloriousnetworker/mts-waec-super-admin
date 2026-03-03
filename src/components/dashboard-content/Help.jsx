// components/dashboard-content/Help.jsx
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  examsContainer,
  examsHeader,
  examsTitle,
  examsSubtitle,
  homeCard,
  homeCardTitle
} from '../../styles/styles';

export default function Help() {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: 'How do I create a new school?',
      answer: 'Navigate to Schools Management, click "Add New School", fill in the school details including name, address, and contact information. The school will be created with active status.'
    },
    {
      id: 2,
      question: 'How do I create a school admin?',
      answer: 'Go to Admin Management, click "Add New Admin", select the school, fill in admin details, and choose a subscription plan. The admin will receive login credentials via email.'
    },
    {
      id: 3,
      question: 'How do I manage admin subscriptions?',
      answer: 'In Admin Management, click the 💳 icon next to any admin to manage their subscription. You can activate, deactivate, or change subscription plans.'
    },
    {
      id: 4,
      question: 'How do I generate reports?',
      answer: 'Navigate to Reports, select the report type, choose date range, and click "Generate Report". Reports can be downloaded in CSV or JSON format.'
    },
    {
      id: 5,
      question: 'How do I respond to support tickets?',
      answer: 'Go to Support Tickets, click on any ticket to open it, type your reply, and click "Send Reply". You can also update ticket status as needed.'
    }
  ];

  const guides = [
    {
      title: 'Quick Start Guide',
      description: 'Get started with the super admin dashboard in 5 minutes',
      icon: '🚀',
      link: '#'
    },
    {
      title: 'School Management',
      description: 'Complete guide to managing schools and their data',
      icon: '🏫',
      link: '#'
    },
    {
      title: 'Admin & Subscription Management',
      description: 'How to create admins and manage their subscriptions',
      icon: '👥',
      link: '#'
    },
    {
      title: 'Report Generation',
      description: 'Generate and export comprehensive reports',
      icon: '📊',
      link: '#'
    }
  ];

  return (
    <div className={examsContainer}>
      <div className={examsHeader}>
        <h1 className={examsTitle}>Help & Support</h1>
        <p className={examsSubtitle}>Find answers to common questions and learn how to use the dashboard</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className={homeCard}>
            <h2 className={homeCardTitle}>Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                    className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-[14px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair">
                      {faq.question}
                    </span>
                    <span className="text-[#7C3AED] text-[18px]">
                      {activeFaq === faq.id ? '−' : '+'}
                    </span>
                  </button>
                  {activeFaq === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 py-3 bg-gray-50 border-t border-gray-200"
                    >
                      <p className="text-[13px] leading-[140%] font-[400] text-[#626060] font-playfair">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className={homeCard}>
            <h2 className={homeCardTitle}>Quick Guides</h2>
            <div className="space-y-4">
              {guides.map((guide, index) => (
                <a
                  key={index}
                  href={guide.link}
                  className="block p-4 bg-[#F5F3FF] rounded-lg hover:bg-[#EDE9FE] transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[24px]">{guide.icon}</span>
                    <h3 className="text-[14px] leading-[100%] font-[600] text-[#7C3AED] font-playfair">
                      {guide.title}
                    </h3>
                  </div>
                  <p className="text-[12px] leading-[140%] font-[400] text-[#626060] font-playfair">
                    {guide.description}
                  </p>
                </a>
              ))}
            </div>
          </div>

          <div className="mt-6 bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] rounded-xl p-6 text-white">
            <h3 className="text-[18px] leading-[120%] font-[700] mb-3 font-playfair">Need Personal Help?</h3>
            <p className="text-[13px] leading-[140%] font-[400] mb-4 text-white/90 font-playfair">
              Our support team is ready to assist you with any issues or questions.
            </p>
            <button className="w-full px-4 py-3 bg-white text-[#7C3AED] rounded-lg hover:bg-gray-100 transition-colors font-playfair text-[14px] leading-[100%] font-[600]">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}