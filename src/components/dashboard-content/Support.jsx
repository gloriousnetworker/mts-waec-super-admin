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

const PAGE_SIZE = 50;

export default function Support({ onOpenChat }) {
  const { fetchWithAuth } = useSuperAdminAuth();
  const [tickets, setTickets] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSchool, setFilterSchool] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [formData, setFormData] = useState({
    subject: '',
    category: 'technical',
    priority: 'medium',
    description: '',
    schoolId: ''
  });

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [page]);

  const fetchData = async () => {
    try {
      const [ticketsRes, schoolsRes] = await Promise.all([
        fetchWithAuth(`/super-admin/tickets?limit=${PAGE_SIZE}&page=${page}`),
        fetchWithAuth('/super-admin/schools')
      ]);

      if (ticketsRes.ok) {
        const ticketsData = await ticketsRes.json();
        const list = ticketsData.data || ticketsData.tickets || [];
        setTickets(list);
        setTotalCount(ticketsData.total || list.length);
        
        const unread = ticketsData.tickets?.filter(t => 
          t.messages?.some(msg => msg.sender === 'admin' && !msg.read)
        ).length || 0;
        setUnreadCount(unread);
      }
      
      if (schoolsRes.ok) {
        const schoolsData = await schoolsRes.json();
        setSchools(schoolsData.schools || []);
      }
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
        headers: {
          'Content-Type': 'application/json'
        },
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

  const handleViewTicket = (ticket) => {
    if (onOpenChat) {
      onOpenChat(ticket.id);
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
      case 'resolved': return 'bg-green-100 text-green-600';
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

  const hasUnreadMessages = (ticket) => {
    return ticket.messages?.some(msg => 
      msg.sender === 'admin' && !msg.read
    ) || false;
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesSchool = filterSchool === 'all' || ticket.schoolId === filterSchool;
    const matchesSearch = (ticket.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (ticket.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (ticket.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSchool && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const stats = {
    total: totalCount,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    closed: tickets.filter(t => t.status === 'closed').length,
    highPriority: tickets.filter(t => t.priority === 'high' && t.status !== 'closed' && t.status !== 'resolved').length
  };

  const schoolStats = schools.map(school => ({
    ...school,
    total: tickets.filter(t => t.schoolId === school.id).length,
    open: tickets.filter(t => t.schoolId === school.id && t.status === 'open').length,
    unread: tickets.filter(t => t.schoolId === school.id && t.messages?.some(msg => msg.sender === 'admin' && !msg.read)).length
  }));

  return (
    <div className={examsContainer}>
      <div className={examsHeader}>
        <div className="flex items-center gap-3">
          <h1 className={examsTitle}>Support Tickets</h1>
          {unreadCount > 0 && (
            <span className="px-2 py-1 bg-red-500 text-white rounded-full text-[10px] leading-[100%] font-[600]">
              {unreadCount} new
            </span>
          )}
        </div>
        <p className={examsSubtitle}>Manage and respond to school admin support requests</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
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
            <span className="text-[32px]">✅</span>
            <span className={superAdminStatValue}>{stats.resolved}</span>
          </div>
          <p className={superAdminStatLabel}>Resolved</p>
        </div>
        <div className={superAdminStatCard}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[32px]">🔴</span>
            <span className={superAdminStatValue}>{stats.highPriority}</span>
          </div>
          <p className={superAdminStatLabel}>High Priority</p>
        </div>
      </div>

      {/* School Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {schoolStats.map(school => (
          <div
            key={school.id}
            onClick={() => setFilterSchool(school.id)}
            className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${
              filterSchool === school.id 
                ? 'border-brand-primary bg-brand-primary-lt' 
                : 'border-border hover:border-brand-primary'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-[14px] leading-[120%] font-[600] text-content-primary">
                {school.name}
              </h3>
              {school.unread > 0 && (
                <span className="px-1.5 py-0.5 bg-red-500 text-white rounded-full text-[8px] font-[600]">
                  {school.unread} new
                </span>
              )}
            </div>
            <div className="flex gap-3 text-[11px] text-content-secondary">
              <span>Total: {school.total}</span>
              <span>Open: {school.open}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full lg:w-auto">
            <input
              type="text"
              placeholder="Search tickets by ID, subject, description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:border-brand-primary text-[13px]"
            />
          </div>
          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <select
              value={filterSchool}
              onChange={(e) => setFilterSchool(e.target.value)}
              className="px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:border-brand-primary text-[13px]"
            >
              <option value="all">All Schools</option>
              {schools.map(school => (
                <option key={school.id} value={school.id}>{school.name}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:border-brand-primary text-[13px]"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card p-12 text-center">
          <div className="spinner mx-auto mb-3" />
          <p className="text-[14px] text-content-secondary">Loading tickets...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredTickets.map((ticket) => {
            const hasUnread = hasUnreadMessages(ticket);
            const school = schools.find(s => s.id === ticket.schoolId);
            const lastMessage = ticket.messages?.[ticket.messages.length - 1];
            
            return (
              <motion.div
                key={ticket.id}
                whileHover={{ y: -2 }}
                className={`bg-white rounded-xl border ${hasUnread ? 'border-brand-primary border-2' : 'border-border'} p-6 cursor-pointer hover:shadow-md transition-all ${
                  ticket.status === 'closed' || ticket.status === 'resolved' ? 'opacity-75' : ''
                }`}
                onClick={() => handleViewTicket(ticket)}
              >
                {hasUnread && (
                  <div className="absolute right-6 top-6 w-3 h-3 bg-brand-primary rounded-full animate-pulse"></div>
                )}
                
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-[16px] leading-[120%] font-[600] text-content-primary">
                        {ticket.subject}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-[10px] leading-[100%] font-[500] ${getStatusColor(ticket.status)}`}>
                        {ticket.status === 'in_progress' ? 'In Progress' : ticket.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-[10px] leading-[100%] font-[500] ${getPriorityBadge(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <p className="text-[12px] leading-[100%] font-[400] text-content-secondary mb-1">
                      Ticket #{ticket.id} • {school?.name || 'Unknown School'}
                    </p>
                    <p className="text-[13px] leading-[140%] font-[400] text-content-primary line-clamp-2">
                      {ticket.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] leading-[100%] font-[400] text-content-muted">
                      Created: {formatDate(ticket.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[11px] leading-[100%] font-[400] text-content-secondary">
                  <span>📁 {ticket.category}</span>
                  <span>💬 {ticket.messages?.length || 0} messages</span>
                  {lastMessage && (
                    <span className="text-brand-primary">
                      Last: {formatDate(lastMessage.timestamp)}
                    </span>
                  )}
                </div>
                {hasUnread && (
                  <div className="mt-3 text-[12px] text-brand-primary font-[600]">
                    New message - Click to respond →
                  </div>
                )}
              </motion.div>
            );
          })}
          {filteredTickets.length === 0 && (
            <div className="card p-12 text-center">
              <p className="text-[14px] text-content-secondary">No tickets found</p>
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex items-center justify-between card px-6 py-4 mt-2">
              <p className="text-[12px] text-content-secondary">
                Page {page} of {totalPages} &mdash; {totalCount.toLocaleString()} total tickets
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-[12px] border border-border rounded-md hover:bg-surface-subtle disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-[12px] border border-border rounded-md hover:bg-surface-subtle disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
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
                  <label className="block mb-2 text-[12px] leading-[100%] font-[500] text-content-primary">Select School *</label>
                  <select
                    name="schoolId"
                    value={formData.schoolId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:border-brand-primary text-[13px]"
                  >
                    <option value="">Choose a school</option>
                    {schools.map(school => (
                      <option key={school.id} value={school.id}>{school.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block mb-2 text-[12px] leading-[100%] font-[500] text-content-primary">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:border-brand-primary text-[13px]"
                    placeholder="Brief description of the issue"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-[12px] leading-[100%] font-[500] text-content-primary">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:border-brand-primary text-[13px]"
                    >
                      <option value="technical">Technical Issue</option>
                      <option value="bug">Bug Report</option>
                      <option value="feature">Feature Request</option>
                      <option value="account">Account Issue</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-[12px] leading-[100%] font-[500] text-content-primary">Priority</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:border-brand-primary text-[13px]"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block mb-2 text-[12px] leading-[100%] font-[500] text-content-primary">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:border-brand-primary text-[13px]"
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
                  className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary-dk transition-colors text-[13px] leading-[100%] font-[600]"
                >
                  Create Ticket
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}