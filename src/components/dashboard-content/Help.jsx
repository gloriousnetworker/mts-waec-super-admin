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

export default function Help({ setActiveSection }) {
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
                <div key={faq.id} className="border border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                    className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-surface-subtle transition-colors min-h-[44px]"
                  >
                    <span className="text-sm font-semibold text-content-primary pr-3">
                      {faq.question}
                    </span>
                    <span className="text-brand-primary text-lg flex-shrink-0">
                      {activeFaq === faq.id ? '−' : '+'}
                    </span>
                  </button>
                  {activeFaq === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 py-3 bg-surface-muted border-t border-border"
                    >
                      <p className="text-sm text-content-secondary leading-relaxed">
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
                <div
                  key={index}
                  className="p-4 bg-brand-primary-lt rounded-xl border border-brand-primary/10"
                >
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xl">{guide.icon}</span>
                    <h3 className="text-sm font-semibold text-brand-primary">
                      {guide.title}
                    </h3>
                  </div>
                  <p className="text-xs text-content-secondary leading-relaxed">
                    {guide.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 bg-gradient-to-br from-brand-primary to-brand-primary-dk rounded-xl p-6 text-white">
            <h3 className="text-lg font-bold mb-2 font-playfair">Need Personal Help?</h3>
            <p className="text-sm text-white/80 mb-4">
              Our support team is ready to assist you with any issues or questions.
            </p>
            <button
              onClick={() => setActiveSection('support')}
              className="w-full px-4 py-3 bg-white text-brand-primary rounded-lg hover:bg-white/90 transition-colors text-sm font-semibold min-h-[44px]"
            >
              Go to Support Tickets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}