// components/dashboard-content/Admins.jsx
'use client';
import { useState, useEffect, useCallback } from 'react';
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

export default function Admins() {
  const { fetchWithAuth } = useSuperAdminAuth();
  const [admins, setAdmins] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSchool, setFilterSchool] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPlan, setFilterPlan] = useState('all');
  const [subscriptionPlans] = useState([
    { id: 'monthly',   name: 'Monthly',   price: 15000, period: '/month', days: 30  },
    { id: 'termly',    name: 'Termly',    price: 35000, period: '/term',  days: 120 },
    { id: 'yearly',    name: 'Yearly',    price: 60000, period: '/year',  days: 365 },
    { id: 'unlimited', name: 'Unlimited', price: 0,     period: '/year',  days: 365 },
  ]);
  // Drill-down state
  const [drillDownAdmin, setDrillDownAdmin] = useState(null);
  const [drillDownData, setDrillDownData] = useState(null);
  const [drillDownLoading, setDrillDownLoading] = useState(false);
  const [drillDownStudentSearch, setDrillDownStudentSearch] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    schoolId: '',
    password: '',
    subscription: {
      plan: 'monthly'
    }
  });

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [adminsRes, schoolsRes] = await Promise.all([
        fetchWithAuth(`/super-admin/admins?limit=${PAGE_SIZE}&page=${page}`),
        fetchWithAuth('/super-admin/schools')
      ]);

      if (adminsRes.ok) {
        const adminsData = await adminsRes.json();
        const list = adminsData.data || adminsData.admins || [];
        setAdmins(list);
        setTotalCount(adminsData.total || list.length);
      }

      if (schoolsRes.ok) {
        const schoolsData = await schoolsRes.json();
        setSchools(schoolsData.schools || []);
      }
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
    if (!formData.name || !formData.email || !formData.schoolId || !formData.password) {
      toast.error('Please fill in all required fields including password');
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
          password: '',
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
          password: '',
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

  const handleActivateSubscription = async (admin) => {
    const selectedPlan = formData.subscription?.plan;
    if (!selectedPlan) {
      toast.error('Please select a subscription plan first');
      return;
    }

    const toastId = toast.loading('Activating subscription...');

    try {
      const response = await fetchWithAuth(`/super-admin/admins/${admin.id}/subscription/activate`, {
        method: 'POST',
        body: JSON.stringify({ plan: selectedPlan })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Subscription activated successfully!', { id: toastId });
        setShowSubscriptionModal(false);
        fetchData();
      } else {
        toast.error(data.message || 'Failed to activate subscription', { id: toastId });
      }
    } catch (error) {
      toast.error('Network error', { id: toastId });
    }
  };

  const handleDeactivateSubscription = async (admin) => {
    const toastId = toast.loading('Deactivating subscription...');

    try {
      const response = await fetchWithAuth(`/super-admin/admins/${admin.id}/subscription/deactivate`, {
        method: 'POST'
      });

      if (response.ok) {
        toast.success('Subscription deactivated successfully!', { id: toastId });
        fetchData();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to deactivate subscription', { id: toastId });
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
      password: '',
      subscription: admin.subscription || { plan: 'basic' }
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (admin) => {
    setSelectedAdmin(admin);
    setShowDeleteModal(true);
  };

  const openSubscriptionModal = (admin) => {
    setSelectedAdmin(admin);
    setFormData(prev => ({
      ...prev,
      subscription: admin.subscription || { plan: 'monthly' }  // already correct key
    }));
    setShowSubscriptionModal(true);
  };

  const openDrillDown = useCallback(async (admin) => {
    setDrillDownAdmin(admin);
    setDrillDownData(null);
    setDrillDownLoading(true);
    setDrillDownStudentSearch('');
    try {
      const res = await fetchWithAuth(`/super-admin/admins/${admin.id}/drill-down`);
      if (res.ok) {
        const data = await res.json();
        setDrillDownData(data);
      } else {
        toast.error('Failed to load admin details');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setDrillDownLoading(false);
    }
  }, [fetchWithAuth]);

  const exportCSV = useCallback(() => {
    if (!drillDownData) return;
    const rows = [
      ['First Name', 'Last Name', 'Class', 'Login ID', 'Status', 'Exams Taken', 'Avg Score (%)'],
      ...drillDownData.students.map(s => [
        s.firstName, s.lastName, s.class, s.loginId, s.status,
        s.examCount, s.avgScore ?? 'N/A',
      ]),
    ];
    const csv = rows.map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${drillDownAdmin?.name?.replace(/\s+/g, '_') || 'admin'}_students.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [drillDownData, drillDownAdmin]);

  const printReport = useCallback(() => {
    window.print();
  }, []);

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
      case 'monthly':   return 'badge-brand';
      case 'termly':    return 'badge-info';
      case 'yearly':    return 'badge-gold';
      case 'unlimited': return 'badge-success';
      default:          return 'badge-muted';
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount);

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = (admin.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (admin.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSchool = filterSchool === 'all' || admin.schoolId === filterSchool;
    const matchesStatus = filterStatus === 'all' || admin.status === filterStatus;
    const matchesPlan = filterPlan === 'all' || admin.subscription?.plan === filterPlan;
    return matchesSearch && matchesSchool && matchesStatus && matchesPlan;
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const stats = {
    total:     totalCount,
    active:    admins.filter(a => a.status === 'active').length,
    expired:   admins.filter(a => a.status === 'expired').length,
    yearly:    admins.filter(a => ['yearly', 'unlimited'].includes(a.subscription?.plan)).length,
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
            <span className="text-[32px]">⭐</span>
            <span className={superAdminStatValue}>{stats.premium}</span>
          </div>
          <p className={superAdminStatLabel}>Yearly / Unlimited</p>
        </div>
      </div>

      <div className="card p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full lg:w-auto">
            <input
              type="text"
              placeholder="Search admins by name or email..."
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
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="expired">Expired</option>
            </select>
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:border-brand-primary text-[13px]"
            >
              <option value="all">All Plans</option>
              <option value="monthly">Monthly</option>
              <option value="termly">Termly</option>
              <option value="yearly">Yearly</option>
              <option value="unlimited">Unlimited</option>
            </select>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2.5 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-dk transition-colors font-[600] text-[13px] whitespace-nowrap"
            >
              + Add New Admin
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card p-12 text-center">
          <div className="spinner mx-auto mb-3" />
          <p className="text-[14px] text-content-secondary">Loading admins...</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-muted border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-content-secondary uppercase tracking-wider">Admin</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-content-secondary uppercase tracking-wider">School</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-content-secondary uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-content-secondary uppercase tracking-wider">Subscription</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-content-secondary uppercase tracking-wider">Expiry</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-content-secondary uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-content-secondary uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAdmins.map((admin) => (
                  <motion.tr
                    key={admin.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-surface-subtle transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-[14px] leading-[100%] font-[600] text-content-primary mb-1">{admin.name}</p>
                        <p className="text-[11px] leading-[100%] font-[400] text-content-secondary">{admin.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[13px] leading-[100%] font-[500] text-content-primary">
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
                        }`}
                      >
                        {admin.status}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] leading-[100%] font-[500] ${getPlanColor(admin.subscription?.plan)}`}>
                        {admin.subscription?.plan || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-[12px] leading-[100%] font-[400] text-content-secondary">
                          {formatDate(admin.subscription?.expiryDate)}
                        </p>
                        {admin.subscriptionStatus?.daysLeft > 0 && (
                          <p className="text-[10px] leading-[100%] font-[400] text-green-600 mt-1">
                            {admin.subscriptionStatus.daysLeft} days left
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[12px] leading-[100%] font-[400] text-content-secondary">
                        {formatDate(admin.createdAt)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openDrillDown(admin)}
                          className="p-2 text-[#6366F1] hover:bg-[#EEF2FF] rounded-md transition-colors"
                          title="View Students & Performance"
                        >
                          👁
                        </button>
                        <button
                          onClick={() => openSubscriptionModal(admin)}
                          className="p-2 text-[#10B981] hover:bg-[#D1FAE5] rounded-md transition-colors"
                          title="Manage Subscription"
                        >
                          💳
                        </button>
                        <button
                          onClick={() => openEditModal(admin)}
                          className="p-2 text-brand-primary hover:bg-brand-primary-lt rounded-md transition-colors"
                          title="Edit Admin"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => openDeleteModal(admin)}
                          className="p-2 text-[#DC2626] hover:bg-[#FEF2F2] rounded-md transition-colors"
                          title="Delete Admin"
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
              <p className="text-[14px] leading-[100%] font-[400] text-content-muted">No admins found</p>
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-border">
              <p className="text-[12px] text-content-secondary">
                Page {page} of {totalPages} &mdash; {totalCount.toLocaleString()} total admins
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
              className="bg-white rounded-xl p-6 max-w-lg w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className={modalTitle}>Create New Admin</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-content-secondary">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:border-brand-primary text-[13px]"
                    placeholder="John Admin"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-content-secondary">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:border-brand-primary text-[13px]"
                    placeholder="admin@school.edu.ng"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-content-secondary">School *</label>
                  <select
                    name="schoolId"
                    value={formData.schoolId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:border-brand-primary text-[13px]"
                  >
                    <option value="">Select School</option>
                    {schools.map(school => (
                      <option key={school.id} value={school.id}>{school.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-content-secondary">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:border-brand-primary text-[13px]"
                    placeholder="Minimum 8 characters"
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-content-secondary">Subscription Plan *</label>
                  <select
                    value={formData.subscription.plan}
                    onChange={(e) => handleSubscriptionChange(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:border-brand-primary text-[13px]"
                  >
                    {subscriptionPlans.map(plan => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name}{plan.price > 0 ? ` — ${formatCurrency(plan.price)}${plan.period}` : ' — Custom pricing'}
                      </option>
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
                  className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary-dk transition-colors text-[13px] leading-[100%] font-[600]"
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
                  <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-content-secondary">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:border-brand-primary text-[13px]"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-content-secondary">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:border-brand-primary text-[13px]"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-content-secondary">Subscription Plan *</label>
                  <select
                    value={formData.subscription.plan}
                    onChange={(e) => handleSubscriptionChange(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:border-brand-primary text-[13px]"
                  >
                    {subscriptionPlans.map(plan => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name}{plan.price > 0 ? ` — ${formatCurrency(plan.price)}${plan.period}` : ' — Custom pricing'}
                      </option>
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
                  className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary-dk transition-colors text-[13px] leading-[100%] font-[600]"
                >
                  Update Admin
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showSubscriptionModal && selectedAdmin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={modalOverlay}
            onClick={() => setShowSubscriptionModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className={modalTitle}>Manage Subscription</h3>
              <p className="text-[13px] leading-[140%] text-content-secondary mb-4">
                {selectedAdmin.name} - {selectedAdmin.email}
              </p>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-content-secondary">Current Plan</label>
                  <p className="text-[14px] leading-[100%] font-[600] text-content-primary">
                    {selectedAdmin.subscription?.plan || 'No active plan'}
                  </p>
                </div>
                
                <div>
                  <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-content-secondary">New Plan</label>
                  <select
                    value={formData.subscription.plan}
                    onChange={(e) => handleSubscriptionChange(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:border-brand-primary text-[13px]"
                  >
                    {subscriptionPlans.map(plan => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name}{plan.price > 0 ? ` — ${formatCurrency(plan.price)}${plan.period}` : ' — Custom pricing'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                {selectedAdmin.subscription?.active ? (
                  <button
                    onClick={() => handleDeactivateSubscription(selectedAdmin)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-[13px] leading-[100%] font-[600]"
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    onClick={() => handleActivateSubscription(selectedAdmin)}
                    className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary-dk transition-colors text-[13px] leading-[100%] font-[600]"
                  >
                    Activate
                  </button>
                )}
                <button
                  onClick={() => setShowSubscriptionModal(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-md hover:bg-surface-subtle text-[13px]"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ── FEAT-3: Drill-Down Modal ── */}
        {drillDownAdmin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={modalOverlay}
            onClick={() => setDrillDownAdmin(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-muted print:hidden">
                <div>
                  <h3 className="text-[16px] font-[700] text-content-primary">{drillDownAdmin.name}</h3>
                  <p className="text-[12px] text-content-secondary mt-0.5">{drillDownAdmin.email}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={exportCSV}
                    disabled={!drillDownData}
                    className="px-3 py-1.5 text-[12px] font-[600] bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-40 transition-colors"
                    title="Export student list as CSV"
                  >
                    ⬇ CSV
                  </button>
                  <button
                    onClick={printReport}
                    disabled={!drillDownData}
                    className="px-3 py-1.5 text-[12px] font-[600] bg-brand-primary text-white rounded-lg hover:bg-brand-primary-dk disabled:opacity-40 transition-colors"
                    title="Print / Save as PDF"
                  >
                    🖨 PDF
                  </button>
                  <button
                    onClick={() => setDrillDownAdmin(null)}
                    className="p-2 hover:bg-surface-subtle rounded-lg transition-colors text-content-secondary"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="overflow-y-auto flex-1 p-6 space-y-6">
                {drillDownLoading ? (
                  <div className="py-20 text-center">
                    <div className="spinner mx-auto mb-3" />
                    <p className="text-[14px] text-content-secondary">Loading admin details...</p>
                  </div>
                ) : drillDownData ? (
                  <>
                    {/* Stat Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { label: 'Students', value: drillDownData.stats.studentCount, icon: '👥' },
                        { label: 'Exams Taken', value: drillDownData.stats.totalExams, icon: '📝' },
                        { label: 'Avg Score', value: drillDownData.stats.avgScore != null ? `${drillDownData.stats.avgScore}%` : 'N/A', icon: '📊' },
                        { label: 'Pass Rate', value: drillDownData.stats.passRate != null ? `${drillDownData.stats.passRate}%` : 'N/A', icon: '✅' },
                      ].map(card => (
                        <div key={card.label} className={superAdminStatCard}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[28px]">{card.icon}</span>
                            <span className={superAdminStatValue}>{card.value}</span>
                          </div>
                          <p className={superAdminStatLabel}>{card.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Students Table */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-[14px] font-[700] text-content-primary">Students ({drillDownData.students.length})</h4>
                        <input
                          type="text"
                          placeholder="Search students..."
                          value={drillDownStudentSearch}
                          onChange={e => setDrillDownStudentSearch(e.target.value)}
                          className="px-3 py-1.5 text-[12px] border border-border rounded-lg focus:outline-none focus:border-brand-primary w-48"
                        />
                      </div>
                      <div className="border border-border rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-[13px]">
                            <thead className="bg-surface-muted">
                              <tr>
                                {['Name', 'Class', 'Login ID', 'Status', 'Exams', 'Avg Score', 'Last Exam'].map(h => (
                                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-[600] text-content-secondary uppercase tracking-wider whitespace-nowrap">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {drillDownData.students
                                .filter(s => {
                                  const q = drillDownStudentSearch.toLowerCase();
                                  return !q || `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) || (s.loginId || '').toLowerCase().includes(q);
                                })
                                .map(s => (
                                  <tr key={s.id} className="hover:bg-surface-subtle transition-colors">
                                    <td className="px-4 py-2.5 font-[500] text-content-primary whitespace-nowrap">{s.firstName} {s.lastName}</td>
                                    <td className="px-4 py-2.5 text-content-secondary">{s.class || 'N/A'}</td>
                                    <td className="px-4 py-2.5 text-content-secondary font-mono text-[11px]">{s.loginId || 'N/A'}</td>
                                    <td className="px-4 py-2.5">
                                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-[500] ${s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {s.status || 'N/A'}
                                      </span>
                                    </td>
                                    <td className="px-4 py-2.5 text-center text-content-secondary">{s.examCount}</td>
                                    <td className="px-4 py-2.5 text-center">
                                      {s.avgScore != null ? (
                                        <span className={`font-[600] ${s.avgScore >= 50 ? 'text-green-600' : 'text-red-500'}`}>{s.avgScore}%</span>
                                      ) : <span className="text-content-muted">—</span>}
                                    </td>
                                    <td className="px-4 py-2.5 text-content-secondary text-[11px] whitespace-nowrap">
                                      {s.lastExamAt ? formatDate(s.lastExamAt) : '—'}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                        {drillDownData.students.length === 0 && (
                          <p className="text-center py-8 text-[13px] text-content-muted">No students found for this school</p>
                        )}
                      </div>
                    </div>

                    {/* Recent Exams */}
                    {drillDownData.recentExams.length > 0 && (
                      <div>
                        <h4 className="text-[14px] font-[700] text-content-primary mb-3">Recent Exams (last 10)</h4>
                        <div className="border border-border rounded-lg overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full text-[13px]">
                              <thead className="bg-surface-muted">
                                <tr>
                                  {['Subject', 'Score', 'Percentage', 'Date'].map(h => (
                                    <th key={h} className="px-4 py-2.5 text-left text-[11px] font-[600] text-content-secondary uppercase tracking-wider">{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border">
                                {drillDownData.recentExams.map(e => (
                                  <tr key={e.id} className="hover:bg-surface-subtle transition-colors">
                                    <td className="px-4 py-2.5 font-[500] text-content-primary">{e.subject}</td>
                                    <td className="px-4 py-2.5 text-content-secondary">{e.score}/{e.totalMarks}</td>
                                    <td className="px-4 py-2.5">
                                      <span className={`font-[600] ${e.percentage >= 50 ? 'text-green-600' : 'text-red-500'}`}>{e.percentage}%</span>
                                    </td>
                                    <td className="px-4 py-2.5 text-content-secondary text-[11px]">{formatDate(e.submittedAt)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="py-20 text-center">
                    <p className="text-[14px] text-content-muted">No data available</p>
                  </div>
                )}
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