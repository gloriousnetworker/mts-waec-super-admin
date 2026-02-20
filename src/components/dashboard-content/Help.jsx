'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSuperAdminAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  examsContainer,
  examsHeader,
  examsTitle,
  examsSubtitle,
  homeCard,
  homeCardTitle,
  inputClass,
  selectClass,
  modalOverlay,
  modalContainer,
  modalTitle,
  modalText,
  modalActions,
  modalButtonSecondary,
  modalButtonDanger
} from '../../styles/styles';

export default function Help({ setActiveSection }) {
  const { user } = useSuperAdminAuth();
  const [activeTab, setActiveTab] = useState('view');
  const [activeFaq, setActiveFaq] = useState(null);
  const [selectedAudience, setSelectedAudience] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [resourceType, setResourceType] = useState('faq');
  
  const [faqs, setFaqs] = useState([
    { id: 1, question: 'How do I create a new school account?', answer: 'Navigate to Schools section, click "Add New School", fill in the school details including name, address, and contact information. The system will automatically generate admin credentials.', audience: 'admin', category: 'schools', views: 234, helpful: 89, createdAt: '2024-01-10' },
    { id: 2, question: 'How do I reset a student password?', answer: 'Go to Student Management, search for the student, click on their profile, and select "Reset Password". The system will generate a temporary password that the student can change upon next login.', audience: 'admin', category: 'students', views: 456, helpful: 92, createdAt: '2024-01-12' },
    { id: 3, question: 'How do I generate reports for the ministry?', answer: 'Visit the Reports section, select report type (school, student, performance), choose date range, and click "Generate Report". Reports can be exported in CSV or JSON format.', audience: 'admin', category: 'reports', views: 189, helpful: 95, createdAt: '2024-01-15' },
    { id: 4, question: 'How do I start a practice exam?', answer: 'Navigate to the "Practice Exams" section, select your subject, choose exam type, and click "Start Exam". You can choose between practice, timed, or mock exams.', audience: 'student', category: 'exams', views: 1234, helpful: 88, createdAt: '2024-01-05' },
    { id: 5, question: 'What happens if I switch tabs during an exam?', answer: 'The system detects tab switching and will warn you. Multiple violations may lead to automatic exam submission to maintain exam integrity.', audience: 'student', category: 'exams', views: 2341, helpful: 76, createdAt: '2024-01-06' },
    { id: 6, question: 'How do I view my performance analytics?', answer: 'Click on "Performance" in the dashboard to see your subject-wise breakdown, exam history, and performance insights with recommendations for improvement.', audience: 'student', category: 'performance', views: 1892, helpful: 94, createdAt: '2024-01-08' },
  ]);

  const [guides, setGuides] = useState([
    { id: 1, title: 'Quick Start Guide for Admins', description: 'Get started with school management in 5 minutes', icon: '🚀', audience: 'admin', downloads: 234, type: 'pdf', size: '2.4 MB', createdAt: '2024-01-01' },
    { id: 2, title: 'Video Tutorial: Adding Students', description: 'Step-by-step guide to register new students', icon: '🎥', audience: 'admin', views: 567, duration: '8:30', createdAt: '2024-01-03' },
    { id: 3, title: 'Student Exam Guide', description: 'How to navigate exams and maximize scores', icon: '📚', audience: 'student', views: 1234, type: 'pdf', size: '1.8 MB', createdAt: '2024-01-07' },
    { id: 4, title: 'Understanding Performance Reports', description: 'Interpret your analytics and improve', icon: '📊', audience: 'student', views: 891, type: 'video', duration: '12:15', createdAt: '2024-01-09' },
  ]);

  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'System Maintenance on Sunday', content: 'The platform will be unavailable on Sunday, Jan 28 from 2 AM to 4 AM for scheduled updates.', audience: 'all', priority: 'high', date: '2024-01-20', read: 456 },
    { id: 2, title: 'New Feature: Bulk Student Registration', content: 'Admins can now upload CSV files to register multiple students at once. Check the Students section for the new import option.', audience: 'admin', priority: 'medium', date: '2024-01-18', read: 234 },
    { id: 3, title: 'Exam Schedule Update', content: 'Practice exams for SS3 students now include the new WAEC syllabus. Review your subject list.', audience: 'student', priority: 'low', date: '2024-01-15', read: 1892 },
  ]);

  const [newResource, setNewResource] = useState({
    type: 'faq',
    question: '',
    answer: '',
    title: '',
    description: '',
    content: '',
    icon: '📌',
    audience: 'all',
    category: 'general',
    priority: 'medium'
  });

  const audiences = [
    { id: 'all', label: 'All Users', icon: '👥' },
    { id: 'admin', label: 'Admins Only', icon: '👤' },
    { id: 'student', label: 'Students Only', icon: '🧑‍🎓' },
  ];

  const categories = [
    'general', 'schools', 'students', 'exams', 'performance', 'reports', 'settings', 'support'
  ];

  const handleCreateResource = () => {
    if (resourceType === 'faq' && (!newResource.question || !newResource.answer)) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (resourceType === 'guide' && (!newResource.title || !newResource.description)) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (resourceType === 'announcement' && (!newResource.title || !newResource.content)) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newItem = {
      id: Date.now(),
      ...newResource,
      createdAt: new Date().toISOString().split('T')[0],
      views: 0,
      helpful: 0
    };

    if (resourceType === 'faq') {
      setFaqs([newItem, ...faqs]);
    } else if (resourceType === 'guide') {
      setGuides([newItem, ...guides]);
    } else if (resourceType === 'announcement') {
      setAnnouncements([newItem, ...announcements]);
    }

    setShowCreateModal(false);
    setNewResource({
      type: 'faq',
      question: '',
      answer: '',
      title: '',
      description: '',
      content: '',
      icon: '📌',
      audience: 'all',
      category: 'general',
      priority: 'medium'
    });
    toast.success('Resource created successfully!');
  };

  const handleDeleteResource = () => {
    if (selectedResource.type === 'faq') {
      setFaqs(faqs.filter(f => f.id !== selectedResource.id));
    } else if (selectedResource.type === 'guide') {
      setGuides(guides.filter(g => g.id !== selectedResource.id));
    } else if (selectedResource.type === 'announcement') {
      setAnnouncements(announcements.filter(a => a.id !== selectedResource.id));
    }
    setShowDeleteModal(false);
    setSelectedResource(null);
    toast.success('Resource deleted successfully!');
  };

  const filteredFaqs = faqs.filter(faq => 
    selectedAudience === 'all' || faq.audience === selectedAudience
  );

  const filteredGuides = guides.filter(guide => 
    selectedAudience === 'all' || guide.audience === selectedAudience
  );

  const filteredAnnouncements = announcements.filter(announcement => 
    selectedAudience === 'all' || announcement.audience === selectedAudience || announcement.audience === 'all'
  );

  const tabs = [
    { id: 'view', label: 'View Resources', icon: '👁️' },
    { id: 'faqs', label: 'FAQs', icon: '❓' },
    { id: 'guides', label: 'Guides & Tutorials', icon: '📚' },
    { id: 'announcements', label: 'Announcements', icon: '📢' },
    { id: 'create', label: 'Create New', icon: '➕' },
  ];

  return (
    <div className={examsContainer}>
      <div className={examsHeader}>
        <h1 className={examsTitle}>Help & Resources Management</h1>
        <p className={examsSubtitle}>Create and manage help content for students and admins</p>
      </div>

      <div className="flex gap-6">
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#F5F3FF] text-[#7C3AED] border-l-4 border-[#7C3AED]'
                    : 'hover:bg-gray-50 text-[#626060]'
                }`}
              >
                <span className="text-[18px]">{tab.icon}</span>
                <span className="text-[13px] leading-[100%] font-[500] font-playfair">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 p-4 bg-[#F5F3FF] rounded-lg">
            <h3 className="text-[13px] leading-[100%] font-[600] text-[#7C3AED] mb-2 font-playfair">Resource Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#626060] font-playfair">Total FAQs:</span>
                <span className="font-[600] text-[#1E1E1E] font-playfair">{faqs.length}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#626060] font-playfair">Guides:</span>
                <span className="font-[600] text-[#1E1E1E] font-playfair">{guides.length}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#626060] font-playfair">Announcements:</span>
                <span className="font-[600] text-[#1E1E1E] font-playfair">{announcements.length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          {activeTab === 'view' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className={homeCard}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className={homeCardTitle}>Help Center Overview</h2>
                  <div className="flex gap-2">
                    {audiences.map((audience) => (
                      <button
                        key={audience.id}
                        onClick={() => setSelectedAudience(audience.id)}
                        className={`px-3 py-1.5 rounded-md text-[11px] leading-[100%] font-[500] transition-colors ${
                          selectedAudience === audience.id
                            ? 'bg-[#7C3AED] text-white'
                            : 'bg-gray-100 text-[#626060] hover:bg-gray-200'
                        }`}
                      >
                        {audience.icon} {audience.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-[#F5F3FF] rounded-lg">
                    <div className="text-[24px] mb-2">❓</div>
                    <h3 className="text-[13px] leading-[100%] font-[600] text-[#1E1E1E] mb-1 font-playfair">FAQs</h3>
                    <p className="text-[24px] leading-[100%] font-[700] text-[#7C3AED] font-playfair">{filteredFaqs.length}</p>
                    <p className="text-[10px] leading-[100%] font-[400] text-[#626060] mt-1 font-playfair">{filteredFaqs.reduce((acc, f) => acc + f.views, 0).toLocaleString()} total views</p>
                  </div>
                  <div className="p-4 bg-[#F5F3FF] rounded-lg">
                    <div className="text-[24px] mb-2">📚</div>
                    <h3 className="text-[13px] leading-[100%] font-[600] text-[#1E1E1E] mb-1 font-playfair">Guides</h3>
                    <p className="text-[24px] leading-[100%] font-[700] text-[#7C3AED] font-playfair">{filteredGuides.length}</p>
                    <p className="text-[10px] leading-[100%] font-[400] text-[#626060] mt-1 font-playfair">{filteredGuides.reduce((acc, g) => acc + (g.views || g.downloads || 0), 0).toLocaleString()} engagements</p>
                  </div>
                  <div className="p-4 bg-[#F5F3FF] rounded-lg">
                    <div className="text-[24px] mb-2">📢</div>
                    <h3 className="text-[13px] leading-[100%] font-[600] text-[#1E1E1E] mb-1 font-playfair">Announcements</h3>
                    <p className="text-[24px] leading-[100%] font-[700] text-[#7C3AED] font-playfair">{filteredAnnouncements.length}</p>
                    <p className="text-[10px] leading-[100%] font-[400] text-[#626060] mt-1 font-playfair">{filteredAnnouncements.reduce((acc, a) => acc + a.read, 0).toLocaleString()} reads</p>
                  </div>
                </div>

                <h3 className="text-[14px] leading-[100%] font-[600] text-[#1E1E1E] mb-3 font-playfair">Recent Activity</h3>
                <div className="space-y-3">
                  {[...faqs.slice(0, 2), ...guides.slice(0, 2), ...announcements.slice(0, 2)]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 4)
                    .map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-[20px]">
                            {item.question ? '❓' : item.title ? '📚' : '📢'}
                          </span>
                          <div>
                            <p className="text-[12px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">
                              {item.question || item.title}
                            </p>
                            <p className="text-[10px] leading-[100%] font-[400] text-[#626060] mt-1 font-playfair">
                              {item.audience === 'all' ? 'All Users' : item.audience === 'admin' ? 'Admins' : 'Students'} • {item.createdAt}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] leading-[100%] font-[400] text-[#626060] font-playfair">
                          {item.views || item.downloads || item.read || 0} views
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'faqs' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={homeCard}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className={homeCardTitle}>Frequently Asked Questions</h2>
                <button
                  onClick={() => {
                    setResourceType('faq');
                    setShowCreateModal(true);
                  }}
                  className="px-4 py-2 bg-[#7C3AED] text-white rounded-md hover:bg-[#6D28D9] transition-colors text-[12px] leading-[100%] font-[500] font-playfair"
                >
                  + New FAQ
                </button>
              </div>

              <div className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between p-4 bg-white">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] leading-[100%] font-[500] ${
                            faq.audience === 'admin' ? 'bg-[#F5F3FF] text-[#7C3AED]' : 'bg-[#D1FAE5] text-[#10B981]'
                          }`}>
                            {faq.audience === 'admin' ? 'Admin' : 'Student'}
                          </span>
                          <span className="px-2 py-0.5 bg-gray-100 rounded-full text-[9px] leading-[100%] font-[500] text-[#626060]">
                            {faq.category}
                          </span>
                          <span className="text-[10px] leading-[100%] font-[400] text-[#626060]">
                            {faq.views} views • {faq.helpful}% helpful
                          </span>
                        </div>
                        <h3 className="text-[13px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair">{faq.question}</h3>
                        <p className="text-[11px] leading-[140%] font-[400] text-[#626060] mt-2 font-playfair">{faq.answer}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => {
                            setSelectedResource({ ...faq, type: 'faq' });
                            setShowEditModal(true);
                          }}
                          className="text-[#7C3AED] text-[11px] hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedResource({ ...faq, type: 'faq' });
                            setShowDeleteModal(true);
                          }}
                          className="text-[#DC2626] text-[11px] hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'guides' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={homeCard}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className={homeCardTitle}>Guides & Tutorials</h2>
                <button
                  onClick={() => {
                    setResourceType('guide');
                    setShowCreateModal(true);
                  }}
                  className="px-4 py-2 bg-[#7C3AED] text-white rounded-md hover:bg-[#6D28D9] transition-colors text-[12px] leading-[100%] font-[500] font-playfair"
                >
                  + New Guide
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {filteredGuides.map((guide) => (
                  <div key={guide.id} className="p-4 border border-gray-200 rounded-lg hover:border-[#7C3AED] transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[24px]">{guide.icon}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedResource({ ...guide, type: 'guide' });
                            setShowEditModal(true);
                          }}
                          className="text-[#7C3AED] text-[10px] hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedResource({ ...guide, type: 'guide' });
                            setShowDeleteModal(true);
                          }}
                          className="text-[#DC2626] text-[10px] hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <h3 className="text-[13px] leading-[100%] font-[600] text-[#1E1E1E] mb-1 font-playfair">{guide.title}</h3>
                    <p className="text-[11px] leading-[140%] font-[400] text-[#626060] mb-3 font-playfair">{guide.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] leading-[100%] font-[500] ${
                        guide.audience === 'admin' ? 'bg-[#F5F3FF] text-[#7C3AED]' : 'bg-[#D1FAE5] text-[#10B981]'
                      }`}>
                        {guide.audience === 'admin' ? 'Admin' : 'Student'}
                      </span>
                      <span className="text-[10px] leading-[100%] font-[400] text-[#626060]">
                        {guide.type === 'pdf' ? `${guide.size}` : `${guide.duration}`} • {guide.views || guide.downloads || 0} views
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'announcements' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={homeCard}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className={homeCardTitle}>Announcements</h2>
                <button
                  onClick={() => {
                    setResourceType('announcement');
                    setShowCreateModal(true);
                  }}
                  className="px-4 py-2 bg-[#7C3AED] text-white rounded-md hover:bg-[#6D28D9] transition-colors text-[12px] leading-[100%] font-[500] font-playfair"
                >
                  + New Announcement
                </button>
              </div>

              <div className="space-y-4">
                {filteredAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] leading-[100%] font-[500] ${
                          announcement.priority === 'high' ? 'bg-[#FEE2E2] text-[#DC2626]' :
                          announcement.priority === 'medium' ? 'bg-[#FEF3C7] text-[#F59E0B]' :
                          'bg-[#D1FAE5] text-[#10B981]'
                        }`}>
                          {announcement.priority}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] leading-[100%] font-[500] ${
                          announcement.audience === 'admin' ? 'bg-[#F5F3FF] text-[#7C3AED]' : 
                          announcement.audience === 'student' ? 'bg-[#D1FAE5] text-[#10B981]' :
                          'bg-gray-100 text-[#626060]'
                        }`}>
                          {announcement.audience === 'all' ? 'All Users' : announcement.audience}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedResource({ ...announcement, type: 'announcement' });
                            setShowEditModal(true);
                          }}
                          className="text-[#7C3AED] text-[11px] hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedResource({ ...announcement, type: 'announcement' });
                            setShowDeleteModal(true);
                          }}
                          className="text-[#DC2626] text-[11px] hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <h3 className="text-[14px] leading-[100%] font-[600] text-[#1E1E1E] mb-2 font-playfair">{announcement.title}</h3>
                    <p className="text-[12px] leading-[140%] font-[400] text-[#626060] mb-3 font-playfair">{announcement.content}</p>
                    <div className="flex justify-between items-center text-[10px] leading-[100%] font-[400] text-[#626060]">
                      <span>Posted: {announcement.date}</span>
                      <span>{announcement.read} reads</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'create' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={homeCard}
            >
              <h2 className={homeCardTitle}>Create New Resource</h2>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <button
                  onClick={() => setResourceType('faq')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    resourceType === 'faq'
                      ? 'border-[#7C3AED] bg-[#F5F3FF]'
                      : 'border-gray-200 hover:border-[#7C3AED]'
                  }`}
                >
                  <div className="text-[24px] mb-2">❓</div>
                  <h3 className="text-[13px] leading-[100%] font-[600] font-playfair">FAQ</h3>
                </button>
                <button
                  onClick={() => setResourceType('guide')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    resourceType === 'guide'
                      ? 'border-[#7C3AED] bg-[#F5F3FF]'
                      : 'border-gray-200 hover:border-[#7C3AED]'
                  }`}
                >
                  <div className="text-[24px] mb-2">📚</div>
                  <h3 className="text-[13px] leading-[100%] font-[600] font-playfair">Guide</h3>
                </button>
                <button
                  onClick={() => setResourceType('announcement')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    resourceType === 'announcement'
                      ? 'border-[#7C3AED] bg-[#F5F3FF]'
                      : 'border-gray-200 hover:border-[#7C3AED]'
                  }`}
                >
                  <div className="text-[24px] mb-2">📢</div>
                  <h3 className="text-[13px] leading-[100%] font-[600] font-playfair">Announcement</h3>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">Audience</label>
                    <select
                      value={newResource.audience}
                      onChange={(e) => setNewResource({...newResource, audience: e.target.value})}
                      className={selectClass}
                    >
                      <option value="all">All Users</option>
                      <option value="admin">Admins Only</option>
                      <option value="student">Students Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">Category</label>
                    <select
                      value={newResource.category}
                      onChange={(e) => setNewResource({...newResource, category: e.target.value})}
                      className={selectClass}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {resourceType === 'faq' && (
                  <>
                    <div>
                      <label className="block text-[12px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">Question</label>
                      <input
                        type="text"
                        value={newResource.question}
                        onChange={(e) => setNewResource({...newResource, question: e.target.value})}
                        className={inputClass}
                        placeholder="Enter the frequently asked question"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">Answer</label>
                      <textarea
                        rows="4"
                        value={newResource.answer}
                        onChange={(e) => setNewResource({...newResource, answer: e.target.value})}
                        className={`${inputClass} resize-none`}
                        placeholder="Provide a clear and helpful answer"
                      />
                    </div>
                  </>
                )}

                {resourceType === 'guide' && (
                  <>
                    <div>
                      <label className="block text-[12px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">Title</label>
                      <input
                        type="text"
                        value={newResource.title}
                        onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                        className={inputClass}
                        placeholder="e.g., Quick Start Guide for Admins"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">Description</label>
                      <textarea
                        rows="3"
                        value={newResource.description}
                        onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                        className={`${inputClass} resize-none`}
                        placeholder="Brief description of the guide"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[12px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">Icon</label>
                        <input
                          type="text"
                          value={newResource.icon}
                          onChange={(e) => setNewResource({...newResource, icon: e.target.value})}
                          className={inputClass}
                          placeholder="🚀"
                        />
                      </div>
                      <div>
                        <label className="block text-[12px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">Type</label>
                        <select
                          value={newResource.type}
                          onChange={(e) => setNewResource({...newResource, type: e.target.value})}
                          className={selectClass}
                        >
                          <option value="pdf">PDF</option>
                          <option value="video">Video</option>
                          <option value="article">Article</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {resourceType === 'announcement' && (
                  <>
                    <div>
                      <label className="block text-[12px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">Title</label>
                      <input
                        type="text"
                        value={newResource.title}
                        onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                        className={inputClass}
                        placeholder="Announcement title"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">Content</label>
                      <textarea
                        rows="4"
                        value={newResource.content}
                        onChange={(e) => setNewResource({...newResource, content: e.target.value})}
                        className={`${inputClass} resize-none`}
                        placeholder="Announcement details..."
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">Priority</label>
                      <select
                        value={newResource.priority}
                        onChange={(e) => setNewResource({...newResource, priority: e.target.value})}
                        className={selectClass}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setActiveTab('view')}
                    className={modalButtonSecondary}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateResource}
                    className="px-6 py-2 bg-[#7C3AED] text-white rounded-md hover:bg-[#6D28D9] transition-colors text-[13px] leading-[100%] font-[600] font-playfair"
                  >
                    Create Resource
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={modalOverlay}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className={modalContainer}
            >
              <h3 className={modalTitle}>Delete Resource</h3>
              <p className={modalText}>
                Are you sure you want to delete this resource? This action cannot be undone.
              </p>
              <div className={modalActions}>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className={modalButtonSecondary}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteResource}
                  className={modalButtonDanger}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}