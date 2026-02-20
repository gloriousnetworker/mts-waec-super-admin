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
  modalOverlay,
  modalContainer,
  modalTitle,
  modalText,
  modalActions,
  modalButtonSecondary,
  modalButtonDanger,
  superAdminStatCard,
  superAdminStatValue,
  superAdminStatLabel
} from '../../styles/styles';

export default function Support({ setActiveSection, onOpenChat }) {
  const { user } = useSuperAdminAuth();
  const [tickets, setTickets] = useState([]);
  const [schools, setSchools] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    subject: '',
    category: 'technical',
    priority: 'medium',
    description: '',
    schoolId: '',
    schoolName: ''
  });

  useEffect(() => {
    const storedTickets = localStorage.getItem('super_admin_tickets');
    const storedSchools = localStorage.getItem('schools');
    
    if (storedSchools) {
      setSchools(JSON.parse(storedSchools));
    } else {
      const demoSchools = [
        { id: 'SCH001', name: 'Kogi State College of Education' },
        { id: 'SCH002', name: 'Government Secondary School, Lokoja' },
        { id: 'SCH003', name: 'St. Theresa\'s College, Okene' },
        { id: 'SCH004', name: 'Federal Government College, Ankpa' },
        { id: 'SCH005', name: 'Community Secondary School, Idah' },
        { id: 'SCH006', name: 'Kogi State University' },
        { id: 'SCH007', name: 'Technical College, Anyigba' }
      ];
      setSchools(demoSchools);
      localStorage.setItem('schools', JSON.stringify(demoSchools));
    }
    
    if (storedTickets) {
      setTickets(JSON.parse(storedTickets));
    } else {
      const demoTickets = [
        {
          id: 'TKT001',
          subject: 'Cannot add new students - Student ID error',
          category: 'technical',
          priority: 'high',
          status: 'open',
          school: 'Kogi State College of Education',
          schoolId: 'SCH001',
          adminName: 'Dr. Michael Adebayo',
          adminEmail: 'michael.adebayo@ksce.edu.ng',
          createdAt: '2024-01-15T10:30:00',
          updatedAt: '2024-01-15T11:15:00',
          closedAt: null,
          messages: [
            { sender: 'admin', senderName: 'Dr. Michael Adebayo', message: 'Getting error when adding students - says Student ID already exists even for new students', timestamp: '2024-01-15T10:30:00' },
            { sender: 'support', senderName: 'Support Team', message: 'Checking this issue now. Can you share a screenshot?', timestamp: '2024-01-15T11:15:00' }
          ]
        },
        {
          id: 'TKT002',
          subject: 'Student results not showing in dashboard',
          category: 'bug',
          priority: 'medium',
          status: 'in-progress',
          school: 'Government Secondary School, Lokoja',
          schoolId: 'SCH002',
          adminName: 'Mrs. Sarah Ochefu',
          adminEmail: 'sarah.ochefu@gssokoja.edu.ng',
          createdAt: '2024-01-14T09:00:00',
          updatedAt: '2024-01-14T14:30:00',
          closedAt: null,
          messages: [
            { sender: 'admin', senderName: 'Mrs. Sarah Ochefu', message: 'Some student results are missing from the dashboard. About 15 students from SS3 are affected.', timestamp: '2024-01-14T09:00:00' },
            { sender: 'support', senderName: 'Support Team', message: 'We are investigating this issue. Which specific students?', timestamp: '2024-01-14T10:15:00' },
            { sender: 'admin', senderName: 'Mrs. Sarah Ochefu', message: 'Students with IDs GSSL/2023/045 to GSSL/2023/060', timestamp: '2024-01-14T11:30:00' },
            { sender: 'support', senderName: 'Support Team', message: 'Found the issue. Results were recorded under wrong class. Fixing now.', timestamp: '2024-01-14T14:30:00' }
          ]
        },
        {
          id: 'TKT003',
          subject: 'Need to increase student capacity',
          category: 'feature',
          priority: 'low',
          status: 'closed',
          school: 'St. Theresa\'s College, Okene',
          schoolId: 'SCH003',
          adminName: 'Mr. James Okonkwo',
          adminEmail: 'james.okonkwo@sttheresas.edu.ng',
          createdAt: '2024-01-13T14:20:00',
          updatedAt: '2024-01-13T16:45:00',
          closedAt: '2024-01-13T16:45:00',
          messages: [
            { sender: 'admin', senderName: 'Mr. James Okonkwo', message: 'We need to increase our student capacity from 1200 to 1500 for the new session.', timestamp: '2024-01-13T14:20:00' },
            { sender: 'support', senderName: 'Support Team', message: 'Capacity increased to 1500. Please verify.', timestamp: '2024-01-13T15:30:00' },
            { sender: 'admin', senderName: 'Mr. James Okonkwo', message: 'Confirmed working. Thank you!', timestamp: '2024-01-13T16:45:00' }
          ]
        }
      ];
      setTickets(demoTickets);
      localStorage.setItem('super_admin_tickets', JSON.stringify(demoTickets));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'schoolId') {
      const selectedSchool = schools.find(s => s.id === value);
      setFormData({
        ...formData,
        schoolId: value,
        schoolName: selectedSchool ? selectedSchool.name : ''
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const generateTicketId = () => {
    const prefix = 'TKT';
    const number = String(tickets.length + 1).padStart(3, '0');
    return `${prefix}${number}`;
  };

  const handleCreateTicket = () => {
    if (!formData.subject || !formData.description || !formData.schoolId) {
      toast.error('Please fill in all required fields');
      return;
    }

    const selectedSchool = schools.find(s => s.id === formData.schoolId);
    const adminName = selectedSchool ? `Admin of ${selectedSchool.name}` : 'School Admin';
    const adminEmail = selectedSchool ? `admin@${selectedSchool.name.toLowerCase().replace(/\s+/g, '')}.edu.ng` : 'admin@school.edu.ng';

    const newTicket = {
      id: generateTicketId(),
      subject: formData.subject,
      category: formData.category,
      priority: formData.priority,
      status: 'open',
      school: selectedSchool?.name || '',
      schoolId: formData.schoolId,
      adminName: adminName,
      adminEmail: adminEmail,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      closedAt: null,
      messages: [
        { 
          sender: 'support', 
          senderName: user?.name || 'Support Team', 
          message: formData.description, 
          timestamp: new Date().toISOString() 
        }
      ]
    };
    
    const updatedTickets = [newTicket, ...tickets];
    setTickets(updatedTickets);
    localStorage.setItem('super_admin_tickets', JSON.stringify(updatedTickets));
    
    setShowCreateModal(false);
    setFormData({
      subject: '',
      category: 'technical',
      priority: 'medium',
      description: '',
      schoolId: '',
      schoolName: ''
    });
    toast.success('Support ticket sent to school admin!');
  };

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
    setShowTicketModal(true);
  };

  const handleSendReply = () => {
    if (!replyMessage.trim() || !selectedTicket) return;

    const newMessage = {
      sender: 'support',
      senderName: user?.name || 'Support Team',
      message: replyMessage,
      timestamp: new Date().toISOString()
    };

    const updatedTicket = {
      ...selectedTicket,
      messages: [...selectedTicket.messages, newMessage],
      updatedAt: new Date().toISOString(),
      status: selectedTicket.status === 'open' ? 'in-progress' : selectedTicket.status
    };

    const updatedTickets = tickets.map(t => 
      t.id === selectedTicket.id ? updatedTicket : t
    );

    setTickets(updatedTickets);
    localStorage.setItem('super_admin_tickets', JSON.stringify(updatedTickets));
    setSelectedTicket(updatedTicket);
    setReplyMessage('');
    toast.success('Reply sent');
  };

  const handleCloseTicket = () => {
    if (!selectedTicket) return;

    const updatedTicket = {
      ...selectedTicket,
      status: 'closed',
      closedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedTickets = tickets.map(t => 
      t.id === selectedTicket.id ? updatedTicket : t
    );

    setTickets(updatedTickets);
    localStorage.setItem('super_admin_tickets', JSON.stringify(updatedTickets));
    setSelectedTicket(updatedTicket);
    toast.success('Ticket closed');
  };

  const handleReopenTicket = () => {
    if (!selectedTicket) return;

    const updatedTicket = {
      ...selectedTicket,
      status: 'in-progress',
      closedAt: null,
      updatedAt: new Date().toISOString()
    };

    const updatedTickets = tickets.map(t => 
      t.id === selectedTicket.id ? updatedTicket : t
    );

    setTickets(updatedTickets);
    localStorage.setItem('super_admin_tickets', JSON.stringify(updatedTickets));
    setSelectedTicket(updatedTicket);
    toast.success('Ticket reopened');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return 'bg-yellow-100 text-yellow-600';
      case 'in-progress': return 'bg-blue-100 text-blue-600';
      case 'closed': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-600';
      case 'medium': return 'bg-yellow-100 text-yellow-600';
      case 'low': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString();
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesSearch = (ticket.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (ticket.school || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (ticket.id || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in-progress').length,
    closed: tickets.filter(t => t.status === 'closed').length,
    highPriority: tickets.filter(t => t.priority === 'high' && t.status !== 'closed').length
  };

  return (
    <div className={examsContainer}>
      <div className={examsHeader}>
        <h1 className={examsTitle}>Support Tickets</h1>
        <p className={examsSubtitle}>Manage and respond to school admin support requests</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className={superAdminStatCard}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[32px]">🎫</span>
            <span className={superAdminStatValue}>{stats.total}</span>
          </div>
          <p className={superAdminStatLabel}>Total Tickets</p>
        </div>
        <div className={superAdminStatCard}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[32px]">🟡</span>
            <span className={superAdminStatValue}>{stats.open}</span>
          </div>
          <p className={superAdminStatLabel}>Open</p>
        </div>
        <div className={superAdminStatCard}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[32px]">🔵</span>
            <span className={superAdminStatValue}>{stats.inProgress}</span>
          </div>
          <p className={superAdminStatLabel}>In Progress</p>
        </div>
        <div className={superAdminStatCard}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[32px]">🔴</span>
            <span className={superAdminStatValue}>{stats.highPriority}</span>
          </div>
          <p className={superAdminStatLabel}>High Priority</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full lg:w-auto">
            <input
              type="text"
              placeholder="Search tickets by ID, school, subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
            />
          </div>
          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2.5 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors font-[600] text-[13px] font-playfair whitespace-nowrap"
            >
              + New Ticket to School
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredTickets.map((ticket) => (
          <motion.div
            key={ticket.id}
            whileHover={{ y: -2 }}
            className={`bg-white rounded-xl border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-all ${
              ticket.status === 'closed' ? 'opacity-75' : ''
            }`}
            onClick={() => handleTicketClick(ticket)}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-[16px] leading-[120%] font-[600] text-[#1E1E1E] font-playfair">
                    {ticket.subject}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-[10px] leading-[100%] font-[500] ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-[10px] leading-[100%] font-[500] ${getPriorityBadge(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </div>
                <p className="text-[12px] leading-[100%] font-[400] text-[#626060] font-playfair mb-1">
                  Ticket #{ticket.id} • {ticket.school}
                </p>
                <p className="text-[11px] leading-[100%] font-[400] text-[#7C3AED] font-playfair">
                  {ticket.adminName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] leading-[100%] font-[400] text-[#9CA3AF] font-playfair">
                  Created: {new Date(ticket.createdAt).toLocaleDateString()}
                </p>
                <p className="text-[11px] leading-[100%] font-[400] text-[#9CA3AF] font-playfair mt-1">
                  Updated: {new Date(ticket.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[11px] leading-[100%] font-[400] text-[#626060] font-playfair">
              <span>📁 {ticket.category}</span>
              <span>💬 {ticket.messages.length} messages</span>
              <span>🏫 {ticket.school}</span>
            </div>

            {ticket.status === 'closed' && (
              <div className="mt-3">
                <span className="text-[10px] leading-[100%] font-[400] text-gray-400">
                  Ticket closed at {formatDateTime(ticket.closedAt)}. Click to view history.
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={modalOverlay}
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className={modalTitle}>Create New Support Ticket for School</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block mb-2 text-[12px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">Select School *</label>
                  <select
                    name="schoolId"
                    value={formData.schoolId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                  >
                    <option value="">Choose a school</option>
                    {schools.map(school => (
                      <option key={school.id} value={school.id}>{school.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block mb-2 text-[12px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                    placeholder="Brief description of the issue"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-[12px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                    >
                      <option value="technical">Technical Issue</option>
                      <option value="bug">Bug Report</option>
                      <option value="feature">Feature Request</option>
                      <option value="account">Account Issue</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-[12px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">Priority</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block mb-2 text-[12px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                    placeholder="Please provide detailed information for the school admin..."
                  />
                </div>
              </div>
              
              <div className={modalActions}>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className={modalButtonSecondary}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTicket}
                  className="px-4 py-2 bg-[#7C3AED] text-white rounded-md hover:bg-[#6D28D9] transition-colors text-[13px] leading-[100%] font-[600] font-playfair"
                >
                  Send to School Admin
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showTicketModal && selectedTicket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={modalOverlay}
            onClick={() => {
              setShowTicketModal(false);
              setSelectedTicket(null);
              setReplyMessage('');
            }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-[20px] leading-[120%] font-[700] text-[#1E1E1E] font-playfair">
                      {selectedTicket.subject}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-[10px] leading-[100%] font-[500] ${getStatusColor(selectedTicket.status)}`}>
                      {selectedTicket.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-[10px] leading-[100%] font-[500] ${getPriorityBadge(selectedTicket.priority)}`}>
                      {selectedTicket.priority}
                    </span>
                  </div>
                  <p className="text-[13px] leading-[100%] font-[400] text-[#626060] font-playfair mb-2">
                    Ticket #{selectedTicket.id} • {selectedTicket.school}
                  </p>
                  <p className="text-[12px] leading-[100%] font-[400] text-[#7C3AED] font-playfair mb-2">
                    {selectedTicket.adminName} • {selectedTicket.adminEmail}
                  </p>
                  <div className="flex gap-4 text-[11px] leading-[100%] font-[400] text-[#9CA3AF] font-playfair">
                    <span>Created: {formatDateTime(selectedTicket.createdAt)}</span>
                    <span>Updated: {formatDateTime(selectedTicket.updatedAt)}</span>
                  </div>
                  {selectedTicket.closedAt && (
                    <p className="text-[11px] leading-[100%] font-[400] text-gray-400 mt-2">
                      Closed at: {formatDateTime(selectedTicket.closedAt)}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {selectedTicket.status === 'closed' ? (
                    <button
                      onClick={handleReopenTicket}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-[12px] font-[600]"
                    >
                      Reopen Ticket
                    </button>
                  ) : (
                    <button
                      onClick={handleCloseTicket}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-[12px] font-[600]"
                    >
                      Close Ticket
                    </button>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-6">
                <h4 className="text-[16px] leading-[120%] font-[600] text-[#1E1E1E] mb-4 font-playfair">Conversation</h4>
                <div className="space-y-4 max-h-96 overflow-y-auto p-2">
                  {selectedTicket.messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'support' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-lg ${
                        msg.sender === 'support' 
                          ? 'bg-[#7C3AED] text-white' 
                          : 'bg-gray-100 text-[#1E1E1E]'
                      }`}>
                        {msg.sender !== 'support' && (
                          <p className="text-[10px] leading-[100%] font-[600] text-[#7C3AED] mb-2 uppercase">
                            {msg.senderName}
                          </p>
                        )}
                        <p className="text-[13px] leading-[140%] font-[500] font-playfair mb-2">{msg.message}</p>
                        <p className={`text-[9px] leading-[100%] font-[400] ${
                          msg.sender === 'support' ? 'text-white/70' : 'text-[#626060]'
                        } font-playfair`}>
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedTicket.status !== 'closed' ? (
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-[14px] leading-[100%] font-[600] text-[#1E1E1E] mb-4 font-playfair">Reply to Ticket</h4>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply here..."
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair mb-4"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleSendReply}
                      disabled={!replyMessage.trim()}
                      className={`px-6 py-3 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors text-[13px] leading-[100%] font-[600] ${
                        !replyMessage.trim() ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      Send Reply
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-6">
                  <div className="bg-gray-100 rounded-lg p-4 text-center">
                    <p className="text-[13px] leading-[100%] font-[500] text-[#626060] font-playfair">
                      This ticket is closed. Reopen the ticket to continue the conversation.
                    </p>
                    <p className="text-[11px] leading-[100%] font-[400] text-gray-400 mt-2">
                      Closed at: {formatDateTime(selectedTicket.closedAt)}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}