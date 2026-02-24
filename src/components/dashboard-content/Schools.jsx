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
  const { fetchWithAuth } = useSuperAdminAuth();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth('/super-admin/schools');
      const data = await response.json();
      setSchools(data.schools || []);
    } catch (error) {
      toast.error('Failed to load schools');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateSchool = async () => {
    if (!formData.name || !formData.address) {
      toast.error('School name and address are required');
      return;
    }

    const toastId = toast.loading('Creating school...');

    try {
      const response = await fetchWithAuth('/super-admin/schools', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('School created successfully!', { id: toastId });
        setShowCreateModal(false);
        setFormData({ name: '', address: '', phone: '', email: '' });
        fetchSchools();
      } else {
        toast.error(data.message || 'Failed to create school', { id: toastId });
      }
    } catch (error) {
      toast.error('Network error', { id: toastId });
    }
  };

  const handleEditSchool = async () => {
    if (!formData.name || !formData.address) {
      toast.error('School name and address are required');
      return;
    }

    const toastId = toast.loading('Updating school...');

    try {
      const response = await fetchWithAuth(`/super-admin/schools/${selectedSchool.id}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('School updated successfully!', { id: toastId });
        setShowEditModal(false);
        setSelectedSchool(null);
        setFormData({ name: '', address: '', phone: '', email: '' });
        fetchSchools();
      } else {
        toast.error(data.message || 'Failed to update school', { id: toastId });
      }
    } catch (error) {
      toast.error('Network error', { id: toastId });
    }
  };

  const handleDeleteSchool = async () => {
    const toastId = toast.loading('Deleting school...');

    try {
      const response = await fetchWithAuth(`/super-admin/schools/${selectedSchool.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('School deleted successfully!', { id: toastId });
        setShowDeleteModal(false);
        setSelectedSchool(null);
        fetchSchools();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete school', { id: toastId });
      }
    } catch (error) {
      toast.error('Network error', { id: toastId });
    }
  };

  const openEditModal = (school) => {
    setSelectedSchool(school);
    setFormData({
      name: school.name || '',
      address: school.address || '',
      phone: school.phone || '',
      email: school.email || ''
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (school) => {
    setSelectedSchool(school);
    setShowDeleteModal(true);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    if (timestamp._seconds) {
      return new Date(timestamp._seconds * 1000).toLocaleDateString();
    }
    return new Date(timestamp).toLocaleDateString();
  };

  const filteredSchools = schools.filter(school => {
    const q = searchTerm.toLowerCase();
    return (school.name || '').toLowerCase().includes(q) ||
           (school.email || '').toLowerCase().includes(q) ||
           (school.address || '').toLowerCase().includes(q);
  });

  const stats = {
    total: schools.length,
    active: schools.filter(s => s.status === 'active').length,
    totalStudents: schools.reduce((sum, s) => sum + (s.studentCount || 0), 0)
  };

  return (
    <div className={examsContainer}>
      <div className={examsHeader}>
        <h1 className={examsTitle}>Schools Management</h1>
        <p className={examsSubtitle}>Manage all schools across Kogi State</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
            <span className={superAdminStatValue}>{stats.totalStudents}</span>
          </div>
          <p className={superAdminStatLabel}>Total Students</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search schools by name, email or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1565c0] text-[13px] font-playfair"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2.5 bg-[#1565c0] text-white rounded-lg hover:bg-[#0d47a1] transition-colors font-[600] text-[13px] font-playfair whitespace-nowrap"
            >
              + Add New School
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-12 h-12 border-4 border-[#1565c0] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[14px] text-[#626060] font-playfair">Loading schools...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">School</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Address</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Contact</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Students</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Status</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Created</th>
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
                        <p className="text-[14px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair mb-1">{school.name}</p>
                        <p className="text-[10px] leading-[100%] font-[400] text-[#9CA3AF] font-playfair">ID: {school.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">{school.address}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[12px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair mb-1">{school.phone || 'N/A'}</p>
                      <p className="text-[10px] leading-[100%] font-[400] text-[#9CA3AF] font-playfair">{school.email || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[14px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair">{school.studentCount || 0}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] leading-[100%] font-[500] ${
                        school.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                      } font-playfair`}>
                        {school.status || 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[12px] leading-[100%] font-[400] text-[#626060] font-playfair">
                        {formatDate(school.createdAt)}
                      </p>
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
              <h3 className={modalTitle}>Add New School</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">School Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1565c0] text-[13px] font-playfair"
                    placeholder="e.g., Kogi State College"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1565c0] text-[13px] font-playfair"
                    placeholder="123 Education Road, Lokoja"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1565c0] text-[13px] font-playfair"
                    placeholder="08012345678"
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
                    placeholder="info@school.edu.ng"
                  />
                </div>
              </div>
              <div className={modalActions}>
                <button onClick={() => setShowCreateModal(false)} className={modalButtonSecondary}>
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
              className="bg-white rounded-xl p-6 max-w-lg w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className={modalTitle}>Edit School</h3>
              <div className="space-y-4 mb-6">
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
                  <label className="block mb-2 text-[11px] leading-[100%] font-[500] text-[#626060] font-playfair">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#1565c0] text-[13px] font-playfair"
                  />
                </div>
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
              <div className={modalActions}>
                <button onClick={() => setShowEditModal(false)} className={modalButtonSecondary}>
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
                Are you sure you want to delete {selectedSchool?.name}? This action cannot be undone.
              </p>
              <div className={modalActions}>
                <button onClick={() => setShowDeleteModal(false)} className={modalButtonSecondary}>
                  Cancel
                </button>
                <button onClick={handleDeleteSchool} className={modalButtonDanger}>
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