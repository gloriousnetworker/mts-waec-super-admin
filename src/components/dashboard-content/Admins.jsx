// components/dashboard-content/Admins.jsx
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

export default function Admins({ setActiveSection }) {
  const { fetchWithAuth } = useSuperAdminAuth();
  const [admins, setAdmins] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSchool, setFilterSchool] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSubscription, setFilterSubscription] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    schoolId: '',
    password: 'Admin123!',
    subscription: {
      plan: 'monthly'
    }
  });

  const subscriptionPlans = [
    { id: 'monthly', name: 'Monthly', price: 15000 },
    { id: 'termly', name: 'Termly', price: 42000 },
    { id: 'yearly', name: 'Yearly', price: 120000 },
    { id: 'unlimited', name: 'Unlimited', price: 500000 }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [adminsRes, schoolsRes] = await Promise.all([
        fetchWithAuth('/super-admin/admins'),
        fetchWithAuth('/super-admin/schools')
      ]);

      const adminsData = await adminsRes.json();
      const schoolsData = await schoolsRes.json();

      setAdmins(adminsData.admins || []);
      setSchools(schoolsData.schools || []);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubscriptionChange = (value) => {
    setFormData(prev => ({
      ...prev,
      subscription: { plan: value }
    }));
  };

  const handleCreateAdmin = async () => {
    if (!formData.name || !formData.email || !formData.schoolId) {
      toast.error('Please fill in all required fields');
      return;
    }

    const toastId = toast.loading('Creating admin...');

    try {
      const response = await fetchWithAuth('/super-admin/admins', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Admin created successfully!', { id: toastId });
        setShowCreateModal(false);
        setFormData({
          name: '',
          email: '',
          schoolId: '',
          password: 'Admin123!',
          subscription: { plan: 'monthly' }
        });
        fetchData();
      } else {
        toast.error(data.message || 'Failed to create admin', { id: toastId });
      }
    } catch (error) {
      toast.error('Network error', { id: toastId });
    }
  };

  const handleUpdateAdmin = async () => {
    if (!formData.name || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    const toastId = toast.loading('Updating admin...');

    try {
      const response = await fetchWithAuth(`/super-admin/admins/${selectedAdmin.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subscription: formData.subscription
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Admin updated successfully!', { id: toastId });
        setShowEditModal(false);
        setSelectedAdmin(null);
        setFormData({
          name: '',
          email: '',
          schoolId: '',
          password: 'Admin123!',
          subscription: { plan: 'monthly' }
        });
        fetchData();
      } else {
        toast.error(data.message || 'Failed to update admin', { id: toastId });
      }
    } catch (error) {
      toast.error('Network error', { id: toastId });
    }
  };

  const handleDeleteAdmin = async () => {
    const toastId = toast.loading('Deleting admin...');

    try {
      const response = await fetchWithAuth(`/super-admin/admins/${selectedAdmin.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Admin deleted successfully!', { id: toastId });
        setShowDeleteModal(false);
        setSelectedAdmin(null);
        fetchData();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete admin', { id: toastId });
      }
    } catch (error) {
      toast.error('Network error', { id: toastId });
    }
  };

  const handleToggleStatus = async (admin) => {
    const newStatus = admin.status === 'active' ? 'suspended' : 'active';
    const toastId = toast.loading(`${newStatus === 'active' ? 'Activating' : 'Suspending'} admin...`);

    try {
      const response = await fetchWithAuth(`/super-admin/admins/${admin.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        toast.success(`Admin ${newStatus} successfully!`, { id: toastId });
        fetchData();
      } else {
        const data = await response.json();
        toast.error(data.message || `Failed to ${newStatus} admin`, { id: toastId });
      }
    } catch (error) {
      toast.error('Network error', { id: toastId });
    }
  };

  const openEditModal = (admin) => {
    setSelectedAdmin(admin);
    setFormData({
      name: admin.name || '',
      email: admin.email || '',
      schoolId: admin.schoolId || '',
      password: 'Admin123!',
      subscription: admin.subscription || { plan: 'monthly' }
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (admin) => {
    setSelectedAdmin(admin);
    setShowDeleteModal(true);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    if (timestamp._seconds) {
      return new Date(timestamp._seconds * 1000).toLocaleDateString();
    }
    return new Date(timestamp).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-600' 
      : status === 'expired'
      ? 'bg-yellow-100 text-yellow-600'
      : 'bg-gray-100 text-gray-600';
  };

  const getPlanColor = (plan) => {
    switch(plan) {
      case 'monthly': return 'bg-blue-100 text-blue-600';
      case 'termly': return 'bg-purple-100 text-purple-600';
      case 'yearly': return 'bg-green-100 text-green-600';
      case 'unlimited': return 'bg-indigo-100 text-indigo-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = (admin.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (admin.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSchool = filterSchool === 'all' || admin.schoolId === filterSchool;
    const matchesStatus = filterStatus === 'all' || admin.status === filterStatus;
    const matchesSubscription = filterSubscription === 'all' || admin.subscription?.plan === filterSubscription;
    return matchesSearch && matchesSchool && matchesStatus && matchesSubscription;
  });

  const stats = {
    total: admins.length,
    active: admins.filter(a => a.status === 'active').length,
    expired: admins.filter(a => a.status === 'expired').length,
    monthly: admins.filter(a => a.subscription?.plan === 'monthly').length,
    termly: admins.filter(a => a.subscription?.plan === 'termly').length,
    yearly: admins.filter(a => a.subscription?.plan === 'yearly').length
  };

  return (
    <div className={examsContainer}>
      <div className={examsHeader}>
        <h1 className={examsTitle}>Admin Management</h1>
        <p className={examsSubtitle}>Manage school administrators and their subscriptions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className={superAdminStatCard}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[32px]">👥</span>
            <span className={superAdminStatValue}>{stats.total}</span>
          </div>
          <p className={superAdminStatLabel}>Total Admins</p>
        </div>
        <div className={superAdminStatCard}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[32px]">✅</span>
            <span className={superAdminStatValue}>{stats.active}</span>
          </div>
          <p className={superAdminStatLabel}>Active</p>
        </div>
        <div className={superAdminStatCard}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[32px]">⏰</span>
            <span className={superAdminStatValue}>{stats.expired}</span>
          </div>
          <p className={superAdminStatLabel}>Expired</p>
        </div>
        <div className={superAdminStatCard}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[32px]">📅</span>
            <span className={superAdminStatValue}>{stats.yearly}</span>
          </div>
          <p className={superAdminStatLabel}>Yearly</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full lg:w-auto">
            <input
              type="text"
              placeholder="Search admins by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
            />
          </div>
          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <select
              value={filterSchool}
              onChange={(e) => setFilterSchool(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
            >
              <option value="all">All Schools</option>
              {schools.map(school => (
                <option key={school.id} value={school.id}>{school.name}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="expired">Expired</option>
            </select>
            <select
              value={filterSubscription}
              onChange={(e) => setFilterSubscription(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
            >
              <option value="all">All Plans</option>
              <option value="monthly">Monthly</option>
              <option value="termly">Termly</option>
              <option value="yearly">Yearly</option>
              <option value="unlimited">Unlimited</option>
            </select>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2.5 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors font-[600] text-[13px] font-playfair whitespace-nowrap"
            >
              + Add New Admin
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-12 h-12 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[14px] text-[#626060] font-playfair">Loading admins...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Admin</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">School</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Status</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Subscription</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Expiry</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Created</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAdmins.map((admin) => (
                  <motion.tr
                    key={admin.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-[14px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair mb-1">{admin.name}</p>
                        <p className="text-[11px] leading-[100%] font-[400] text-[#626060] font-playfair">{admin.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">
                        {schools.find(s => s.id === admin.schoolId)?.name || 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(admin)}
                        className={`px-2 py-1 rounded-full text-[10px] leading-[100%] font-[500] transition-colors ${
                          admin.status === 'active' 
                            ? 'bg-green-100 text-green-600 hover:bg-yellow-100 hover:text-yellow-600' 
                            : admin.status === 'expired'
                            ? 'bg-yellow-100 text-yellow-600 hover:bg-green-100 hover:text-green-600'
                            : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600'
                        } font-playfair`}
                      >
                        {admin.status}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] leading-[100%] font-[500] ${getPlanColor(admin.subscription?.plan)} font-playfair`}>
                        {admin.subscription?.plan || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-[12px] leading-[100%] font-[400] text-[#626060] font-playfair">
                          {formatDate(admin.subscription?.expiryDate)}
                        </p>
                        {admin.subscriptionStatus?.daysLeft > 0 && (
                          <p className="text-[10px] leading-[100%] font-[400] text-green-600 mt-1 font-playfair">
                            {admin.subscriptionStatus.daysLeft} days left
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[12px] leading-[100%] font-[400] text-[#626060] font-playfair">
                        {formatDate(admin.createdAt)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(admin)}
                          className="p-2 text-[#7C3AED] hover:bg-[#F5F3FF] rounded-md transition-colors"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => openDeleteModal(admin)}
                          className="p-2 text-[#DC2626] hover:bg-[#FEF2F2] rounded-md transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredAdmins.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[14px] leading-[100%] font-[400] text-[#9CA3AF] font-playfair">No admins found</p>
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
              className="bg-white rounded-xl p-6 max-w-lg w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className={modalTitle}>Create New Admin</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                    placeholder="John Admin"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                    placeholder="admin@school.edu.ng"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">School *</label>
                  <select
                    name="schoolId"
                    value={formData.schoolId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                  >
                    <option value="">Select School</option>
                    {schools.map(school => (
                      <option key={school.id} value={school.id}>{school.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Subscription Plan *</label>
                  <select
                    value={formData.subscription.plan}
                    onChange={(e) => handleSubscriptionChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                  >
                    {subscriptionPlans.map(plan => (
                      <option key={plan.id} value={plan.id}>{plan.name} - ₦{plan.price.toLocaleString()}</option>
                    ))}
                  </select>
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
                  onClick={handleCreateAdmin}
                  className="px-4 py-2 bg-[#7C3AED] text-white rounded-md hover:bg-[#6D28D9] transition-colors text-[13px] leading-[100%] font-[600] font-playfair"
                >
                  Create Admin
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={modalOverlay}
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl p-6 max-w-lg w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className={modalTitle}>Edit Admin</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Subscription Plan *</label>
                  <select
                    value={formData.subscription.plan}
                    onChange={(e) => handleSubscriptionChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                  >
                    {subscriptionPlans.map(plan => (
                      <option key={plan.id} value={plan.id}>{plan.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={modalActions}>
                <button
                  onClick={() => setShowEditModal(false)}
                  className={modalButtonSecondary}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateAdmin}
                  className="px-4 py-2 bg-[#7C3AED] text-white rounded-md hover:bg-[#6D28D9] transition-colors text-[13px] leading-[100%] font-[600] font-playfair"
                >
                  Update Admin
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={modalOverlay}
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className={modalContainer}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className={modalTitle}>Delete Admin</h3>
              <p className={modalText}>
                Are you sure you want to delete {selectedAdmin?.name}? This action cannot be undone.
              </p>
              <div className={modalActions}>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className={modalButtonSecondary}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAdmin}
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