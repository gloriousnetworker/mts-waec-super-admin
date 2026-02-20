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
  buttonPrimary,
  superAdminStatCard,
  superAdminStatValue,
  superAdminStatLabel
} from '../../styles/styles';

export default function Admins({ setActiveSection }) {
  const { user } = useSuperAdminAuth();
  const [admins, setAdmins] = useState([]);
  const [schools, setSchools] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSchool, setFilterSchool] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSubscription, setFilterSubscription] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    school: '',
    role: 'admin',
    password: '123456',
    permissions: ['manage_students', 'manage_exams', 'view_reports'],
    subscription: {
      plan: 'yearly',
      status: 'active',
      startDate: new Date().toISOString(),
      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
      amount: 120000,
      paymentMethod: 'bank_transfer'
    }
  });

  const subscriptionPlans = [
    { id: 'monthly', name: 'Monthly', price: 15000, duration: 30, badge: 'bg-blue-100 text-blue-600' },
    { id: 'termly', name: 'Termly', price: 42000, duration: 120, badge: 'bg-purple-100 text-purple-600' },
    { id: 'yearly', name: 'Yearly', price: 120000, duration: 365, badge: 'bg-green-100 text-green-600' },
    { id: 'unlimited', name: 'Unlimited', price: 500000, duration: null, badge: 'bg-yellow-100 text-yellow-600' }
  ];

  useEffect(() => {
    const storedAdmins = localStorage.getItem('admins');
    const storedSchools = localStorage.getItem('schools');
    
    if (storedAdmins) {
      const parsedAdmins = JSON.parse(storedAdmins);
      checkSubscriptionExpiry(parsedAdmins);
      setAdmins(parsedAdmins);
    } else {
      const demoAdmins = [
        {
          id: 'ADM001',
          name: 'Dr. Michael Adebayo',
          email: 'michael.adebayo@kogicollege.edu.ng',
          phone: '+234 801 234 5678',
          school: 'Kogi State College of Education',
          schoolId: 'SCH001',
          role: 'principal',
          password: '123456',
          permissions: ['full_access', 'manage_students', 'manage_exams', 'view_reports'],
          lastActive: '2024-01-15T10:30:00',
          status: 'active',
          studentsManaged: 1245,
          createdAt: '2023-09-01T00:00:00',
          subscription: {
            plan: 'unlimited',
            status: 'active',
            startDate: '2023-01-01T00:00:00',
            expiryDate: null,
            amount: 500000,
            paymentMethod: 'bank_transfer'
          }
        },
        {
          id: 'ADM002',
          name: 'Mrs. Sarah Ochefu',
          email: 'sarah.ochefu@gsalokoja.edu.ng',
          phone: '+234 802 345 6789',
          school: 'Government Secondary School, Lokoja',
          schoolId: 'SCH002',
          role: 'vice_principal',
          password: '123456',
          permissions: ['manage_students', 'manage_exams', 'view_reports'],
          lastActive: '2024-01-15T09:15:00',
          status: 'active',
          studentsManaged: 987,
          createdAt: '2023-09-15T00:00:00',
          subscription: {
            plan: 'yearly',
            status: 'active',
            startDate: '2024-01-01T00:00:00',
            expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
            amount: 120000,
            paymentMethod: 'bank_transfer'
          }
        },
        {
          id: 'ADM003',
          name: 'Mr. James Okonkwo',
          email: 'james.okonkwo@sttheresas.edu.ng',
          phone: '+234 803 456 7890',
          school: 'St. Theresa\'s College, Okene',
          schoolId: 'SCH003',
          role: 'admin',
          password: '123456',
          permissions: ['manage_students', 'view_reports'],
          lastActive: '2024-01-14T14:20:00',
          status: 'active',
          studentsManaged: 876,
          createdAt: '2023-10-01T00:00:00',
          subscription: {
            plan: 'termly',
            status: 'active',
            startDate: '2024-02-01T00:00:00',
            expiryDate: new Date(new Date().setDate(new Date().getDate() + 120)).toISOString(),
            amount: 42000,
            paymentMethod: 'card'
          }
        },
        {
          id: 'ADM004',
          name: 'Dr. Fatima Bello',
          email: 'fatima.bello@fgcankpa.edu.ng',
          phone: '+234 804 567 8901',
          school: 'Federal Government College, Ankpa',
          schoolId: 'SCH004',
          role: 'principal',
          password: '123456',
          permissions: ['full_access', 'manage_students', 'manage_exams', 'view_reports'],
          lastActive: '2024-01-15T11:45:00',
          status: 'active',
          studentsManaged: 934,
          createdAt: '2023-08-15T00:00:00',
          subscription: {
            plan: 'monthly',
            status: 'active',
            startDate: '2024-03-01T00:00:00',
            expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
            amount: 15000,
            paymentMethod: 'card'
          }
        },
        {
          id: 'ADM005',
          name: 'Mr. Paul Eze',
          email: 'paul.eze@cssidah.edu.ng',
          phone: '+234 805 678 9012',
          school: 'Community Secondary School, Idah',
          schoolId: 'SCH005',
          role: 'admin',
          password: '123456',
          permissions: ['manage_students'],
          lastActive: '2024-01-13T16:30:00',
          status: 'expired',
          studentsManaged: 789,
          createdAt: '2023-11-01T00:00:00',
          subscription: {
            plan: 'yearly',
            status: 'expired',
            startDate: '2023-01-01T00:00:00',
            expiryDate: '2024-01-01T00:00:00',
            amount: 120000,
            paymentMethod: 'bank_transfer'
          }
        }
      ];
      checkSubscriptionExpiry(demoAdmins);
      setAdmins(demoAdmins);
      localStorage.setItem('admins', JSON.stringify(demoAdmins));
    }

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
  }, []);

  const checkSubscriptionExpiry = (adminsList) => {
    const now = new Date();
    let updated = false;
    
    const updatedAdmins = adminsList.map(admin => {
      if (admin.subscription && admin.subscription.plan !== 'unlimited' && admin.subscription.expiryDate) {
        const expiryDate = new Date(admin.subscription.expiryDate);
        if (expiryDate < now && admin.status === 'active') {
          updated = true;
          return { ...admin, status: 'expired', subscription: { ...admin.subscription, status: 'expired' } };
        }
      }
      return admin;
    });

    if (updated) {
      setAdmins(updatedAdmins);
      localStorage.setItem('admins', JSON.stringify(updatedAdmins));
    }
  };

  const calculateDaysRemaining = (expiryDate) => {
    if (!expiryDate) return null;
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubscriptionChange = (field, value) => {
    let expiryDate = null;
    const now = new Date();
    
    if (field === 'plan') {
      const selectedPlan = subscriptionPlans.find(p => p.id === value);
      if (selectedPlan) {
        if (selectedPlan.id === 'unlimited') {
          expiryDate = null;
        } else {
          const expiry = new Date(now);
          expiry.setDate(expiry.getDate() + selectedPlan.duration);
          expiryDate = expiry.toISOString();
        }
        
        setFormData({
          ...formData,
          subscription: {
            ...formData.subscription,
            plan: value,
            expiryDate: expiryDate,
            amount: selectedPlan.price,
            status: 'active'
          }
        });
      }
    } else {
      setFormData({
        ...formData,
        subscription: {
          ...formData.subscription,
          [field]: value
        }
      });
    }
  };

  const handlePermissionChange = (permission) => {
    const updated = formData.permissions.includes(permission)
      ? formData.permissions.filter(p => p !== permission)
      : [...formData.permissions, permission];
    setFormData({ ...formData, permissions: updated });
  };

  const generateAdminId = () => {
    const prefix = 'ADM';
    const number = String(admins.length + 1).padStart(3, '0');
    return `${prefix}${number}`;
  };

  const handleCreateAdmin = () => {
    if (!formData.name || !formData.email || !formData.school) {
      toast.error('Please fill in all required fields');
      return;
    }

    const selectedSchool = schools.find(s => s.id === formData.school);
    
    const newAdmin = {
      id: generateAdminId(),
      ...formData,
      school: selectedSchool?.name || '',
      lastActive: new Date().toISOString(),
      status: 'active',
      studentsManaged: 0,
      createdAt: new Date().toISOString()
    };
    
    const updatedAdmins = [newAdmin, ...admins];
    setAdmins(updatedAdmins);
    localStorage.setItem('admins', JSON.stringify(updatedAdmins));
    
    setShowCreateModal(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      school: '',
      role: 'admin',
      password: '123456',
      permissions: ['manage_students', 'manage_exams', 'view_reports'],
      subscription: {
        plan: 'yearly',
        status: 'active',
        startDate: new Date().toISOString(),
        expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        amount: 120000,
        paymentMethod: 'bank_transfer'
      }
    });
    toast.success(`Admin created successfully! Default password: 123456`);
  };

  const handleEditAdmin = () => {
    if (!formData.name || !formData.email || !formData.school) {
      toast.error('Please fill in all required fields');
      return;
    }

    const selectedSchool = schools.find(s => s.id === formData.school);
    
    const updatedAdmins = admins.map(admin => 
      admin.id === selectedAdmin.id 
        ? { ...admin, ...formData, school: selectedSchool?.name || '' }
        : admin
    );
    
    setAdmins(updatedAdmins);
    localStorage.setItem('admins', JSON.stringify(updatedAdmins));
    
    setShowEditModal(false);
    setSelectedAdmin(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      school: '',
      role: 'admin',
      password: '123456',
      permissions: ['manage_students', 'manage_exams', 'view_reports'],
      subscription: {
        plan: 'yearly',
        status: 'active',
        startDate: new Date().toISOString(),
        expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        amount: 120000,
        paymentMethod: 'bank_transfer'
      }
    });
    toast.success('Admin updated successfully!');
  };

  const handleDeleteAdmin = () => {
    const updatedAdmins = admins.filter(admin => admin.id !== selectedAdmin.id);
    setAdmins(updatedAdmins);
    localStorage.setItem('admins', JSON.stringify(updatedAdmins));
    
    setShowDeleteModal(false);
    setSelectedAdmin(null);
    toast.success('Admin deleted successfully!');
  };

  const handleReactivateAdmin = (admin) => {
    const updatedAdmins = admins.map(a => 
      a.id === admin.id 
        ? { 
            ...a, 
            status: 'active', 
            subscription: { ...a.subscription, status: 'active' } 
          }
        : a
    );
    setAdmins(updatedAdmins);
    localStorage.setItem('admins', JSON.stringify(updatedAdmins));
    toast.success(`${admin.name} reactivated successfully!`);
  };

  const openEditModal = (admin) => {
    setSelectedAdmin(admin);
    const schoolId = schools.find(s => s.name === admin.school)?.id || '';
    setFormData({
      name: admin.name,
      email: admin.email,
      phone: admin.phone || '',
      school: schoolId,
      role: admin.role,
      password: admin.password || '123456',
      permissions: admin.permissions,
      subscription: admin.subscription || {
        plan: 'yearly',
        status: 'active',
        startDate: new Date().toISOString(),
        expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        amount: 120000,
        paymentMethod: 'bank_transfer'
      }
    });
    setShowEditModal(true);
  };

  const openSubscriptionModal = (admin) => {
    setSelectedAdmin(admin);
    setFormData({
      ...formData,
      subscription: admin.subscription || {
        plan: 'yearly',
        status: 'active',
        startDate: new Date().toISOString(),
        expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        amount: 120000,
        paymentMethod: 'bank_transfer'
      }
    });
    setShowSubscriptionModal(true);
  };

  const handleUpdateSubscription = () => {
    const updatedAdmins = admins.map(admin => 
      admin.id === selectedAdmin.id 
        ? { 
            ...admin, 
            subscription: formData.subscription,
            status: formData.subscription.status === 'active' ? 'active' : admin.status
          }
        : admin
    );
    
    setAdmins(updatedAdmins);
    localStorage.setItem('admins', JSON.stringify(updatedAdmins));
    setShowSubscriptionModal(false);
    setSelectedAdmin(null);
    toast.success('Subscription updated successfully!');
  };

  const openDeleteModal = (admin) => {
    setSelectedAdmin(admin);
    setShowDeleteModal(true);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-600';
      case 'expired': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getSubscriptionBadge = (subscription) => {
    if (!subscription) return 'bg-gray-100 text-gray-600';
    
    switch(subscription.plan) {
      case 'unlimited': return 'bg-yellow-100 text-yellow-600';
      case 'yearly': return 'bg-green-100 text-green-600';
      case 'termly': return 'bg-purple-100 text-purple-600';
      case 'monthly': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getRoleBadge = (role) => {
    switch(role) {
      case 'principal': return 'bg-purple-100 text-purple-600';
      case 'vice_principal': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getRoleDisplay = (role) => {
    switch(role) {
      case 'principal': return 'Principal';
      case 'vice_principal': return 'Vice Principal';
      default: return 'Admin';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.school.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSchool = filterSchool === 'all' || admin.schoolId === filterSchool;
    const matchesStatus = filterStatus === 'all' || admin.status === filterStatus;
    const matchesSubscription = filterSubscription === 'all' || admin.subscription?.plan === filterSubscription;
    return matchesSearch && matchesSchool && matchesStatus && matchesSubscription;
  });

  const stats = {
    total: admins.length,
    active: admins.filter(a => a.status === 'active').length,
    expired: admins.filter(a => a.status === 'expired').length,
    unlimited: admins.filter(a => a.subscription?.plan === 'unlimited').length,
    yearly: admins.filter(a => a.subscription?.plan === 'yearly').length,
    termly: admins.filter(a => a.subscription?.plan === 'termly').length,
    monthly: admins.filter(a => a.subscription?.plan === 'monthly').length,
    totalRevenue: admins.reduce((acc, a) => acc + (a.subscription?.amount || 0), 0)
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
            <span className="text-[32px]">💰</span>
            <span className={superAdminStatValue}>{formatCurrency(stats.totalRevenue)}</span>
          </div>
          <p className={superAdminStatLabel}>Total Revenue</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-[24px]">🌟</span>
            <div>
              <p className="text-[20px] leading-[100%] font-[700] text-[#1E1E1E] font-playfair">{stats.unlimited}</p>
              <p className="text-[11px] leading-[100%] font-[400] text-[#626060] font-playfair">Unlimited</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-[24px]">📅</span>
            <div>
              <p className="text-[20px] leading-[100%] font-[700] text-[#1E1E1E] font-playfair">{stats.yearly}</p>
              <p className="text-[11px] leading-[100%] font-[400] text-[#626060] font-playfair">Yearly</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-[24px]">📚</span>
            <div>
              <p className="text-[20px] leading-[100%] font-[700] text-[#1E1E1E] font-playfair">{stats.termly}</p>
              <p className="text-[11px] leading-[100%] font-[400] text-[#626060] font-playfair">Termly</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-[24px]">📆</span>
            <div>
              <p className="text-[20px] leading-[100%] font-[700] text-[#1E1E1E] font-playfair">{stats.monthly}</p>
              <p className="text-[11px] leading-[100%] font-[400] text-[#626060] font-playfair">Monthly</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full lg:w-auto">
            <input
              type="text"
              placeholder="Search admins by name, email or school..."
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
              <option value="expired">Expired</option>
            </select>
            <select
              value={filterSubscription}
              onChange={(e) => setFilterSubscription(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
            >
              <option value="all">All Plans</option>
              <option value="unlimited">Unlimited</option>
              <option value="yearly">Yearly</option>
              <option value="termly">Termly</option>
              <option value="monthly">Monthly</option>
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

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Admin</th>
                <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">School</th>
                <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Role</th>
                <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Status</th>
                <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Subscription</th>
                <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Expiry</th>
                <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Students</th>
                <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAdmins.map((admin) => {
                const daysRemaining = admin.subscription?.expiryDate ? calculateDaysRemaining(admin.subscription.expiryDate) : null;
                return (
                  <motion.tr
                    key={admin.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`hover:bg-gray-50 transition-colors ${admin.status === 'expired' ? 'bg-red-50' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-[14px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair mb-1">{admin.name}</p>
                        <p className="text-[11px] leading-[100%] font-[400] text-[#626060] font-playfair">{admin.email}</p>
                        <p className="text-[10px] leading-[100%] font-[400] text-[#9CA3AF] mt-1 font-playfair">ID: {admin.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">{admin.school}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] leading-[100%] font-[500] ${getRoleBadge(admin.role)} font-playfair`}>
                        {getRoleDisplay(admin.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] leading-[100%] font-[500] ${getStatusColor(admin.status)} font-playfair`}>
                        {admin.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className={`px-2 py-1 rounded-full text-[10px] leading-[100%] font-[500] ${getSubscriptionBadge(admin.subscription)} font-playfair`}>
                          {admin.subscription?.plan || 'N/A'}
                        </span>
                        {admin.subscription?.plan === 'unlimited' && (
                          <span className="ml-2 text-[10px] leading-[100%] font-[400] text-yellow-600">🌟</span>
                        )}
                        <p className="text-[10px] leading-[100%] font-[400] text-[#626060] mt-2 font-playfair">
                          {formatCurrency(admin.subscription?.amount || 0)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {admin.subscription?.plan !== 'unlimited' && admin.subscription?.expiryDate ? (
                        <div>
                          <p className="text-[11px] leading-[100%] font-[400] text-[#626060] font-playfair">
                            {new Date(admin.subscription.expiryDate).toLocaleDateString()}
                          </p>
                          {daysRemaining !== null && daysRemaining > 0 && (
                            <p className="text-[10px] leading-[100%] font-[400] text-green-600 mt-1 font-playfair">
                              {daysRemaining} days left
                            </p>
                          )}
                          {daysRemaining === 0 && (
                            <p className="text-[10px] leading-[100%] font-[400] text-red-600 mt-1 font-playfair">
                              Expires today
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-[11px] leading-[100%] font-[400] text-[#626060] font-playfair">Never</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[13px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair">{admin.studentsManaged}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(admin)}
                          className="p-2 text-[#7C3AED] hover:bg-[#F5F3FF] rounded-md transition-colors"
                          title="Edit Admin"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => openSubscriptionModal(admin)}
                          className="p-2 text-[#7C3AED] hover:bg-[#F5F3FF] rounded-md transition-colors"
                          title="Manage Subscription"
                        >
                          💳
                        </button>
                        {admin.status === 'expired' && (
                          <button
                            onClick={() => handleReactivateAdmin(admin)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                            title="Reactivate Admin"
                          >
                            🔄
                          </button>
                        )}
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
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredAdmins.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[14px] leading-[100%] font-[400] text-[#9CA3AF] font-playfair">No admins found</p>
          </div>
        )}
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
              className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className={modalTitle}>Create New Admin</h3>
              
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                      placeholder="Dr. Michael Adebayo"
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                      placeholder="+234 801 234 5678"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Role *</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                    >
                      <option value="admin">Admin</option>
                      <option value="vice_principal">Vice Principal</option>
                      <option value="principal">Principal</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">School *</label>
                  <select
                    name="school"
                    value={formData.school}
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
                  <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Default Password</label>
                  <input
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                  />
                  <p className="text-[9px] leading-[100%] font-[400] text-[#9CA3AF] mt-1 font-playfair">
                    Admin can change this after first login
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-[13px] leading-[100%] font-[600] text-[#1E1E1E] mb-3 font-playfair">Subscription Details</h4>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Plan *</label>
                      <select
                        value={formData.subscription.plan}
                        onChange={(e) => handleSubscriptionChange('plan', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                      >
                        {subscriptionPlans.map(plan => (
                          <option key={plan.id} value={plan.id}>{plan.name} - {formatCurrency(plan.price)}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Payment Method</label>
                      <select
                        value={formData.subscription.paymentMethod}
                        onChange={(e) => handleSubscriptionChange('paymentMethod', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                      >
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="card">Card Payment</option>
                        <option value="cash">Cash</option>
                      </select>
                    </div>
                  </div>

                  {formData.subscription.plan !== 'unlimited' && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-[11px] leading-[140%] font-[400] text-blue-800 font-playfair">
                        Subscription will expire on {new Date(formData.subscription.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {formData.subscription.plan === 'unlimited' && (
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-[11px] leading-[140%] font-[400] text-yellow-800 font-playfair flex items-center gap-2">
                        <span>🌟</span> Unlimited Version - Lifetime access with golden badge
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-[13px] leading-[100%] font-[600] text-[#1E1E1E] mb-3 font-playfair">Permissions</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes('full_access')}
                        onChange={() => handlePermissionChange('full_access')}
                        className="w-4 h-4 accent-[#7C3AED]"
                      />
                      <span className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">Full Access</span>
                    </label>
                    <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes('manage_students')}
                        onChange={() => handlePermissionChange('manage_students')}
                        className="w-4 h-4 accent-[#7C3AED]"
                      />
                      <span className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">Manage Students</span>
                    </label>
                    <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes('manage_exams')}
                        onChange={() => handlePermissionChange('manage_exams')}
                        className="w-4 h-4 accent-[#7C3AED]"
                      />
                      <span className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">Manage Exams</span>
                    </label>
                    <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes('view_reports')}
                        onChange={() => handlePermissionChange('view_reports')}
                        className="w-4 h-4 accent-[#7C3AED]"
                      />
                      <span className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">View Reports</span>
                    </label>
                  </div>
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
              className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className={modalTitle}>Edit Admin</h3>
              
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Role *</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                    >
                      <option value="admin">Admin</option>
                      <option value="vice_principal">Vice Principal</option>
                      <option value="principal">Principal</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">School *</label>
                  <select
                    name="school"
                    value={formData.school}
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
                  <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Reset Password</label>
                  <input
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                    placeholder="Leave blank to keep current"
                  />
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-[13px] leading-[100%] font-[600] text-[#1E1E1E] mb-3 font-playfair">Permissions</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes('full_access')}
                        onChange={() => handlePermissionChange('full_access')}
                        className="w-4 h-4 accent-[#7C3AED]"
                      />
                      <span className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">Full Access</span>
                    </label>
                    <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes('manage_students')}
                        onChange={() => handlePermissionChange('manage_students')}
                        className="w-4 h-4 accent-[#7C3AED]"
                      />
                      <span className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">Manage Students</span>
                    </label>
                    <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes('manage_exams')}
                        onChange={() => handlePermissionChange('manage_exams')}
                        className="w-4 h-4 accent-[#7C3AED]"
                      />
                      <span className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">Manage Exams</span>
                    </label>
                    <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes('view_reports')}
                        onChange={() => handlePermissionChange('view_reports')}
                        className="w-4 h-4 accent-[#7C3AED]"
                      />
                      <span className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">View Reports</span>
                    </label>
                  </div>
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
                  onClick={handleEditAdmin}
                  className="px-4 py-2 bg-[#7C3AED] text-white rounded-md hover:bg-[#6D28D9] transition-colors text-[13px] leading-[100%] font-[600] font-playfair"
                >
                  Update Admin
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showSubscriptionModal && (
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
              className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className={modalTitle}>Manage Subscription - {selectedAdmin?.name}</h3>
              
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Subscription Plan</label>
                    <select
                      value={formData.subscription.plan}
                      onChange={(e) => handleSubscriptionChange('plan', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                    >
                      {subscriptionPlans.map(plan => (
                        <option key={plan.id} value={plan.id}>{plan.name} - {formatCurrency(plan.price)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Status</label>
                    <select
                      value={formData.subscription.status}
                      onChange={(e) => handleSubscriptionChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                    >
                      <option value="active">Active</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Start Date</label>
                    <input
                      type="date"
                      value={formData.subscription.startDate ? formData.subscription.startDate.split('T')[0] : ''}
                      onChange={(e) => handleSubscriptionChange('startDate', new Date(e.target.value).toISOString())}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Expiry Date</label>
                    <input
                      type="date"
                      value={formData.subscription.expiryDate ? formData.subscription.expiryDate.split('T')[0] : ''}
                      onChange={(e) => handleSubscriptionChange('expiryDate', new Date(e.target.value).toISOString())}
                      disabled={formData.subscription.plan === 'unlimited'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Amount</label>
                    <input
                      type="number"
                      value={formData.subscription.amount}
                      onChange={(e) => handleSubscriptionChange('amount', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Payment Method</label>
                    <select
                      value={formData.subscription.paymentMethod}
                      onChange={(e) => handleSubscriptionChange('paymentMethod', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                    >
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="card">Card Payment</option>
                      <option value="cash">Cash</option>
                    </select>
                  </div>
                </div>

                {formData.subscription.plan === 'unlimited' && (
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-[11px] leading-[140%] font-[400] text-yellow-800 font-playfair flex items-center gap-2">
                      <span>🌟</span> Unlimited Version - No expiry date. Admin gets golden badge.
                    </p>
                  </div>
                )}

                {formData.subscription.plan !== 'unlimited' && formData.subscription.expiryDate && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-[11px] leading-[140%] font-[400] text-blue-800 font-playfair">
                      Days remaining: {calculateDaysRemaining(formData.subscription.expiryDate)} days
                    </p>
                  </div>
                )}
              </div>

              <div className={modalActions}>
                <button
                  onClick={() => setShowSubscriptionModal(false)}
                  className={modalButtonSecondary}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateSubscription}
                  className="px-4 py-2 bg-[#7C3AED] text-white rounded-md hover:bg-[#6D28D9] transition-colors text-[13px] leading-[100%] font-[600] font-playfair"
                >
                  Update Subscription
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