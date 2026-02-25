// components/dashboard-content/Support.jsx
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
  const { fetchWithAuth } = useSuperAdminAuth();
  const [tickets, setTickets] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
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
    schoolId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ticketsRes, schoolsRes] = await Promise.all([
        fetchWithAuth('/super-admin/tickets'),
        fetchWithAuth('/super-admin/schools')
      ]);

      const ticketsData = await ticketsRes.json();
      const schoolsData = await schoolsRes.json();

      setTickets(ticketsData.tickets || []);
      setSchools(schoolsData.schools || []);
    } catch (error) {
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateTicket = async () => {
    if (!formData.subject || !formData.description || !formData.schoolId) {
      toast.error('Please fill in all required fields');
      return;
    }

    const toastId = toast.loading('Creating ticket...');

    try {
      const response = await fetchWithAuth('/super-admin/tickets', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Support ticket created successfully!', { id: toastId });
        setShowCreateModal(false);
        setFormData({ subject: '', category: 'technical', priority: 'medium', description: '', schoolId: '' });
        fetchData();
        if (onOpenChat) {
          onOpenChat(data.ticket?.id);
        }
      } else {
        toast.error(data.message || 'Failed to create ticket', { id: toastId });
      }
    } catch (error) {
      toast.error('Network error', { id: toastId });
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedTicket) return;

    const toastId = toast.loading('Sending reply...');

    try {
      const response = await fetchWithAuth(`/super-admin/tickets/${selectedTicket.id}/respond`, {
        method: 'POST',
        body: JSON.stringify({ message: replyMessage })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Reply sent successfully', { id: toastId });
        setReplyMessage('');
        fetchData();
        setSelectedTicket(data.ticket);
      } else {
        toast.error(data.message || 'Failed to send reply', { id: toastId });
      }
    } catch (error) {
      toast.error('Network error', { id: toastId });
    }
  };

  const handleUpdateStatus = async (ticket, newStatus) => {
    const toastId = toast.loading(`Updating ticket status...`);

    try {
      const response = await fetchWithAuth(`/super-admin/tickets/${ticket.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        toast.success(`Ticket marked as ${newStatus}`, { id: toastId });
        fetchData();
        if (showTicketModal && selectedTicket?.id === ticket.id) {
          setSelectedTicket({ ...selectedTicket, status: newStatus });
        }
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to update status', { id: toastId });
      }
    } catch (error) {
      toast.error('Network error', { id: toastId });
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    if (timestamp._seconds) {
      return new Date(timestamp._seconds * 1000).toLocaleString();
    }
    return new Date(timestamp).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return 'bg-yellow-100 text-yellow-600';
      case 'in_progress': return 'bg-blue-100 text-blue-600';
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

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesSearch = (ticket.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (ticket.id || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
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
              placeholder="Search tickets by ID, subject..."
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
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2.5 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors font-[600] text-[13px] font-playfair whitespace-nowrap"
            >
              + New Ticket
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-12 h-12 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[14px] text-[#626060] font-playfair">Loading tickets...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredTickets.map((ticket) => (
            <motion.div
              key={ticket.id}
              whileHover={{ y: -2 }}
              className={`bg-white rounded-xl border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-all ${
                ticket.status === 'closed' ? 'opacity-75' : ''
              }`}
              onClick={() => {
                setSelectedTicket(ticket);
                setShowTicketModal(true);
              }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-[16px] leading-[120%] font-[600] text-[#1E1E1E] font-playfair">
                      {ticket.subject}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-[10px] leading-[100%] font-[500] ${getStatusColor(ticket.status)}`}>
                      {ticket.status === 'in_progress' ? 'In Progress' : ticket.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-[10px] leading-[100%] font-[500] ${getPriorityBadge(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <p className="text-[12px] leading-[100%] font-[400] text-[#626060] font-playfair mb-1">
                    Ticket #{ticket.id}
                  </p>
                  <p className="text-[13px] leading-[140%] font-[400] text-[#1E1E1E] font-playfair line-clamp-2">
                    {ticket.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] leading-[100%] font-[400] text-[#9CA3AF] font-playfair">
                    School: {schools.find(s => s.id === ticket.schoolId)?.name || 'Unknown'}
                  </p>
                  <p className="text-[11px] leading-[100%] font-[400] text-[#9CA3AF] font-playfair mt-1">
                    Created: {formatDate(ticket.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[11px] leading-[100%] font-[400] text-[#626060] font-playfair">
                <span>📁 {ticket.category}</span>
                <span>💬 {ticket.messages?.length || 0} messages</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

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
              <h3 className={modalTitle}>Create New Support Ticket</h3>
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
                    placeholder="Please provide detailed information..."
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
                  Create Ticket
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
                      {selectedTicket.status === 'in_progress' ? 'In Progress' : selectedTicket.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-[10px] leading-[100%] font-[500] ${getPriorityBadge(selectedTicket.priority)}`}>
                      {selectedTicket.priority}
                    </span>
                  </div>
                  <p className="text-[13px] leading-[100%] font-[400] text-[#626060] font-playfair mb-2">
                    Ticket #{selectedTicket.id}
                  </p>
                  <div className="flex gap-4 text-[11px] leading-[100%] font-[400] text-[#9CA3AF] font-playfair">
                    <span>School: {schools.find(s => s.id === selectedTicket.schoolId)?.name || 'Unknown'}</span>
                    <span>Created: {formatDate(selectedTicket.createdAt)}</span>
                  </div>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-[13px] leading-[140%] font-[400] text-[#1E1E1E] font-playfair">
                      {selectedTicket.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-6">
                <h4 className="text-[16px] leading-[120%] font-[600] text-[#1E1E1E] mb-4 font-playfair">Conversation</h4>
                <div className="space-y-4 max-h-96 overflow-y-auto p-2">
                  {selectedTicket.messages?.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'super_admin' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-lg ${
                        msg.sender === 'super_admin' 
                          ? 'bg-[#7C3AED] text-white' 
                          : 'bg-gray-100 text-[#1E1E1E]'
                      }`}>
                        <p className="text-[10px] leading-[100%] font-[500] mb-1 opacity-70">
                          {msg.sender === 'super_admin' ? 'You' : 'Admin'}
                        </p>
                        <p className="text-[13px] leading-[140%] font-[500] font-playfair">{msg.content}</p>
                        <p className={`text-[9px] leading-[100%] font-[400] mt-2 ${
                          msg.sender === 'super_admin' ? 'text-white/70' : 'text-[#626060]'
                        } font-playfair`}>
                          {msg.timestamp ? new Date(msg.timestamp).toLocaleString() : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedTicket.status !== 'closed' && (
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-[14px] leading-[100%] font-[600] text-[#1E1E1E] mb-4 font-playfair">Reply to Ticket</h4>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply here..."
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair mb-4"
                  />
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleUpdateStatus(selectedTicket, 'closed')}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-[13px] leading-[100%] font-[600]"
                    >
                      Close Ticket
                    </button>
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
              )}

              {selectedTicket.status === 'closed' && (
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleUpdateStatus(selectedTicket, 'open')}
                      className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors text-[13px] leading-[100%] font-[600]"
                    >
                      Reopen Ticket
                    </button>
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