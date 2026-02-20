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

export default function Schools({ setActiveSection }) {
  const { user } = useSuperAdminAuth();
  const [schools, setSchools] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLGA, setFilterLGA] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    lga: '',
    address: '',
    phone: '',
    email: '',
    principal: '',
    type: 'public',
    level: 'secondary',
    capacity: 0,
    students: 0,
    status: 'active'
  });

  useEffect(() => {
    const storedSchools = localStorage.getItem('schools');
    
    if (storedSchools) {
      setSchools(JSON.parse(storedSchools));
    } else {
      const demoSchools = [
        {
          id: 'SCH001',
          name: 'Kogi State College of Education',
          code: 'KSCE001',
          lga: 'Lokoja',
          address: 'P.M.B 123, Lokoja, Kogi State',
          phone: '+234 803 123 4567',
          email: 'info@ksce.edu.ng',
          principal: 'Dr. Michael Adebayo',
          type: 'public',
          level: 'tertiary',
          capacity: 2000,
          students: 1245,
          admins: 12,
          status: 'active',
          performance: 78,
          createdAt: '2023-01-15T00:00:00'
        },
        {
          id: 'SCH002',
          name: 'Government Secondary School, Lokoja',
          code: 'GSSL001',
          lga: 'Lokoja',
          address: 'Old Market Road, Lokoja',
          phone: '+234 803 234 5678',
          email: 'gsslokoja@kogiedu.gov.ng',
          principal: 'Mrs. Sarah Ochefu',
          type: 'public',
          level: 'secondary',
          capacity: 1500,
          students: 987,
          admins: 8,
          status: 'active',
          performance: 76,
          createdAt: '2023-02-10T00:00:00'
        },
        {
          id: 'SCH003',
          name: 'St. Theresa\'s College, Okene',
          code: 'STC001',
          lga: 'Okene',
          address: 'Ajaokuta Road, Okene',
          phone: '+234 803 345 6789',
          email: 'sttheresas@kogiedu.gov.ng',
          principal: 'Mr. James Okonkwo',
          type: 'mission',
          level: 'secondary',
          capacity: 1200,
          students: 876,
          admins: 7,
          status: 'active',
          performance: 75,
          createdAt: '2023-03-05T00:00:00'
        },
        {
          id: 'SCH004',
          name: 'Federal Government College, Ankpa',
          code: 'FGCA001',
          lga: 'Ankpa',
          address: 'Ankpa-Idah Road, Ankpa',
          phone: '+234 803 456 7890',
          email: 'fgcankpa@fed.gov.ng',
          principal: 'Dr. Fatima Bello',
          type: 'federal',
          level: 'secondary',
          capacity: 1300,
          students: 934,
          admins: 10,
          status: 'active',
          performance: 74,
          createdAt: '2023-01-20T00:00:00'
        },
        {
          id: 'SCH005',
          name: 'Community Secondary School, Idah',
          code: 'CSSI001',
          lga: 'Idah',
          address: 'Idah Main Town, Idah',
          phone: '+234 803 567 8901',
          email: 'cssidah@kogiedu.gov.ng',
          principal: 'Mr. Paul Eze',
          type: 'public',
          level: 'secondary',
          capacity: 1000,
          students: 789,
          admins: 5,
          status: 'inactive',
          performance: 73,
          createdAt: '2023-04-12T00:00:00'
        },
        {
          id: 'SCH006',
          name: 'Kogi State University',
          code: 'KSU001',
          lga: 'Anyigba',
          address: 'Anyigba, Kogi State',
          phone: '+234 803 678 9012',
          email: 'info@ksu.edu.ng',
          principal: 'Prof. Timothy Adeyemi',
          type: 'public',
          level: 'tertiary',
          capacity: 5000,
          students: 3245,
          admins: 25,
          status: 'active',
          performance: 82,
          createdAt: '2022-09-01T00:00:00'
        },
        {
          id: 'SCH007',
          name: 'Technical College, Anyigba',
          code: 'TCA001',
          lga: 'Anyigba',
          address: 'Anyigba Township, Anyigba',
          phone: '+234 803 789 0123',
          email: 'tcanyigba@kogiedu.gov.ng',
          principal: 'Engr. Joseph Okafor',
          type: 'public',
          level: 'technical',
          capacity: 800,
          students: 567,
          admins: 6,
          status: 'active',
          performance: 71,
          createdAt: '2023-05-18T00:00:00'
        }
      ];
      setSchools(demoSchools);
      localStorage.setItem('schools', JSON.stringify(demoSchools));
    }
  }, []);

  const lgas = ['Lokoja', 'Okene', 'Ankpa', 'Idah', 'Anyigba', 'Dekina', 'Kabba', 'Ogori-Magongo', 'Okehi', 'Olamaboro'];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateSchoolId = () => {
    const prefix = 'SCH';
    const number = String(schools.length + 1).padStart(3, '0');
    return `${prefix}${number}`;
  };

  const handleCreateSchool = () => {
    if (!formData.name || !formData.lga || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newSchool = {
      id: generateSchoolId(),
      code: formData.code || `${formData.name.substring(0, 3).toUpperCase()}${String(schools.length + 1).padStart(3, '0')}`,
      ...formData,
      students: 0,
      admins: 0,
      performance: 0,
      createdAt: new Date().toISOString()
    };
    
    const updatedSchools = [newSchool, ...schools];
    setSchools(updatedSchools);
    localStorage.setItem('schools', JSON.stringify(updatedSchools));
    
    setShowCreateModal(false);
    setFormData({
      name: '',
      code: '',
      lga: '',
      address: '',
      phone: '',
      email: '',
      principal: '',
      type: 'public',
      level: 'secondary',
      capacity: 0,
      students: 0,
      status: 'active'
    });
    toast.success('School created successfully!');
  };

  const handleEditSchool = () => {
    if (!formData.name || !formData.lga || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    const updatedSchools = schools.map(school => 
      school.id === selectedSchool.id 
        ? { ...school, ...formData }
        : school
    );
    
    setSchools(updatedSchools);
    localStorage.setItem('schools', JSON.stringify(updatedSchools));
    
    setShowEditModal(false);
    setSelectedSchool(null);
    setFormData({
      name: '',
      code: '',
      lga: '',
      address: '',
      phone: '',
      email: '',
      principal: '',
      type: 'public',
      level: 'secondary',
      capacity: 0,
      students: 0,
      status: 'active'
    });
    toast.success('School updated successfully!');
  };

  const handleDeleteSchool = () => {
    const updatedSchools = schools.filter(school => school.id !== selectedSchool.id);
    setSchools(updatedSchools);
    localStorage.setItem('schools', JSON.stringify(updatedSchools));
    
    setShowDeleteModal(false);
    setSelectedSchool(null);
    toast.success('School deleted successfully!');
  };

  const openEditModal = (school) => {
    setSelectedSchool(school);
    setFormData({
      name: school.name || '',
      code: school.code || '',
      lga: school.lga || '',
      address: school.address || '',
      phone: school.phone || '',
      email: school.email || '',
      principal: school.principal || '',
      type: school.type || 'public',
      level: school.level || 'secondary',
      capacity: school.capacity || 0,
      students: school.students || 0,
      status: school.status || 'active'
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (school) => {
    setSelectedSchool(school);
    setShowDeleteModal(true);
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-600' 
      : 'bg-gray-100 text-gray-600';
  };

  const getTypeBadge = (type) => {
    switch(type) {
      case 'public': return 'bg-blue-100 text-blue-600';
      case 'private': return 'bg-purple-100 text-purple-600';
      case 'mission': return 'bg-yellow-100 text-yellow-600';
      case 'federal': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getLevelBadge = (level) => {
    switch(level) {
      case 'primary': return 'bg-green-100 text-green-600';
      case 'secondary': return 'bg-blue-100 text-blue-600';
      case 'tertiary': return 'bg-purple-100 text-purple-600';
      case 'technical': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredSchools = schools.filter(school => {
    const matchesSearch = (school.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (school.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (school.lga || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLGA = filterLGA === 'all' || school.lga === filterLGA;
    return matchesSearch && matchesLGA;
  });

  const stats = {
    total: schools.length,
    active: schools.filter(s => s.status === 'active').length,
    totalStudents: schools.reduce((acc, s) => acc + (s.students || 0), 0),
    totalAdmins: schools.reduce((acc, s) => acc + (s.admins || 0), 0),
    avgPerformance: Math.round(schools.reduce((acc, s) => acc + (s.performance || 0), 0) / (schools.length || 1))
  };

  return (
    <div className={examsContainer}>
      <div className={examsHeader}>
        <h1 className={examsTitle}>Schools Management</h1>
        <p className={examsSubtitle}>Manage all schools across Kogi State</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className={superAdminStatCard}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[32px]">🏫</span>
            <span className={superAdminStatValue}>{stats.total}</span>
          </div>
          <p className={superAdminStatLabel}>Total Schools</p>
        </div>
        <div className={superAdminStatCard}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[32px]">✅</span>
            <span className={superAdminStatValue}>{stats.active}</span>
          </div>
          <p className={superAdminStatLabel}>Active Schools</p>
        </div>
        <div className={superAdminStatCard}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[32px]">🧑‍🎓</span>
            <span className={superAdminStatValue}>{stats.totalStudents.toLocaleString()}</span>
          </div>
          <p className={superAdminStatLabel}>Total Students</p>
        </div>
        <div className={superAdminStatCard}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[32px]">👥</span>
            <span className={superAdminStatValue}>{stats.totalAdmins}</span>
          </div>
          <p className={superAdminStatLabel}>Total Admins</p>
        </div>
        <div className={superAdminStatCard}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[32px]">📊</span>
            <span className={superAdminStatValue}>{stats.avgPerformance}%</span>
          </div>
          <p className={superAdminStatLabel}>Avg Performance</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search schools by name, code or LGA..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1565c0] text-[13px] font-playfair"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <select
              value={filterLGA}
              onChange={(e) => setFilterLGA(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1565c0] text-[13px] font-playfair"
            >
              <option value="all">All LGAs</option>
              {lgas.map(lga => (
                <option key={lga} value={lga}>{lga}</option>
              ))}
            </select>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2.5 bg-[#1565c0] text-white rounded-lg hover:bg-[#0d47a1] transition-colors font-[600] text-[13px] font-playfair whitespace-nowrap"
            >
              + Add New School
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">School</th>
                <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">LGA</th>
                <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Type</th>
                <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Level</th>
                <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Students</th>
                <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Admins</th>
                <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Performance</th>
                <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Status</th>
                <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSchools.map((school) => (
                <motion.tr
                  key={school.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-[14px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair mb-1">{school.name || ''}</p>
                      <p className="text-[11px] leading-[100%] font-[400] text-[#626060] font-playfair">{school.code || ''}</p>
                      <p className="text-[10px] leading-[100%] font-[400] text-[#9CA3AF] mt-1 font-playfair">{school.principal || ''}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">{school.lga || ''}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] leading-[100%] font-[500] ${getTypeBadge(school.type)} font-playfair`}>
                      {school.type || 'public'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] leading-[100%] font-[500] ${getLevelBadge(school.level)} font-playfair`}>
                      {school.level || 'secondary'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[13px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair">{(school.students || 0).toLocaleString()}</p>
                    <p className="text-[9px] leading-[100%] font-[400] text-[#9CA3AF] mt-1 font-playfair">Cap: {(school.capacity || 0).toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[13px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair">{school.admins || 0}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair">{school.performance || 0}%</span>
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#1565c0] rounded-full" 
                          style={{ width: `${school.performance || 0}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] leading-[100%] font-[500] ${getStatusColor(school.status)} font-playfair`}>
                      {school.status || 'inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(school)}
                        className="p-2 text-[#1565c0] hover:bg-[#E8F0FE] rounded-md transition-colors"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => openDeleteModal(school)}
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
        {filteredSchools.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[14px] leading-[100%] font-[400] text-[#9CA3AF] font-playfair">No schools found</p>
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
              <h3 className={modalTitle}>Add New School</h3>
              
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">School Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1565c0] text-[13px] font-playfair"
                      placeholder="e.g., Kogi State College of Education"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">School Code</label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1565c0] text-[13px] font-playfair"
                      placeholder="e.g., KSCE001"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">LGA *</label>
                    <select
                      name="lga"
                      value={formData.lga}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1565c0] text-[13px] font-playfair"
                    >
                      <option value="">Select LGA</option>
                      {lgas.map(lga => (
                        <option key={lga} value={lga}>{lga}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1565c0] text-[13px] font-playfair"
                      placeholder="Full address"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1565c0] text-[13px] font-playfair"
                      placeholder="+234 803 123 4567"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1565c0] text-[13px] font-playfair"
                      placeholder="school@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Principal's Name</label>
                  <input
                    type="text"
                    name="principal"
                    value={formData.principal}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1565c0] text-[13px] font-playfair"
                    placeholder="Dr. Michael Adebayo"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Type</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1565c0] text-[13px] font-playfair"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="mission">Mission</option>
                      <option value="federal">Federal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Level</label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1565c0] text-[13px] font-playfair"
                    >
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                      <option value="tertiary">Tertiary</option>
                      <option value="technical">Technical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Capacity</label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1565c0] text-[13px] font-playfair"
                      placeholder="2000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1565c0] text-[13px] font-playfair"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
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
                  onClick={handleCreateSchool}
                  className="px-4 py-2 bg-[#1565c0] text-white rounded-md hover:bg-[#0d47a1] transition-colors text-[13px] leading-[100%] font-[600] font-playfair"
                >
                  Create School
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
              <h3 className={modalTitle}>Edit School</h3>
              
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">School Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1565c0] text-[13px] font-playfair"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">School Code</label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1565c0] text-[13px] font-playfair"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">LGA *</label>
                    <select
                      name="lga"
                      value={formData.lga}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1565c0] text-[13px] font-playfair"
                    >
                      <option value="">Select LGA</option>
                      {lgas.map(lga => (
                        <option key={lga} value={lga}>{lga}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1565c0] text-[13px] font-playfair"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1565c0] text-[13px] font-playfair"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1565c0] text-[13px] font-playfair"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Principal's Name</label>
                  <input
                    type="text"
                    name="principal"
                    value={formData.principal}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1565c0] text-[13px] font-playfair"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Type</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1565c0] text-[13px] font-playfair"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="mission">Mission</option>
                      <option value="federal">Federal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Level</label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1565c0] text-[13px] font-playfair"
                    >
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                      <option value="tertiary">Tertiary</option>
                      <option value="technical">Technical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Capacity</label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1565c0] text-[13px] font-playfair"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1565c0] text-[13px] font-playfair"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
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
                  onClick={handleEditSchool}
                  className="px-4 py-2 bg-[#1565c0] text-white rounded-md hover:bg-[#0d47a1] transition-colors text-[13px] leading-[100%] font-[600] font-playfair"
                >
                  Update School
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
              <h3 className={modalTitle}>Delete School</h3>
              <p className={modalText}>
                Are you sure you want to delete {selectedSchool?.name || 'this school'}? This action cannot be undone.
              </p>
              <div className={modalActions}>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className={modalButtonSecondary}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteSchool}
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