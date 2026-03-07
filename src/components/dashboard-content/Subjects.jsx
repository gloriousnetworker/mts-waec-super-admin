// components/dashboard-content/Subjects.jsx
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

export default function Subjects() {
  const { fetchWithAuth } = useSuperAdminAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExamType, setFilterExamType] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    examType: 'WAEC',
    duration: 120,
    questionCount: 50
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth('/super-admin/subjects');
      if (response.ok) {
        const data = await response.json();
        setSubjects(data.subjects || []);
      } else {
        toast.error('Failed to load subjects');
      }
    } catch (error) {
      toast.error('Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateSubject = async () => {
    if (!formData.name || !formData.code) {
      toast.error('Please fill in all required fields');
      return;
    }

    const toastId = toast.loading('Creating subject...');

    try {
      const response = await fetchWithAuth('/super-admin/subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Subject created successfully!', { id: toastId });
        setShowCreateModal(false);
        setFormData({
          name: '',
          code: '',
          description: '',
          examType: 'WAEC',
          duration: 120,
          questionCount: 50
        });
        fetchSubjects();
      } else {
        toast.error(data.message || 'Failed to create subject', { id: toastId });
      }
    } catch (error) {
      toast.error('Network error', { id: toastId });
    }
  };

  const handleUpdateSubject = async () => {
    if (!formData.name || !formData.code || !selectedSubject) {
      toast.error('Please fill in all required fields');
      return;
    }

    const toastId = toast.loading('Updating subject...');

    try {
      const response = await fetchWithAuth(`/super-admin/subjects/${selectedSubject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Subject updated successfully!', { id: toastId });
        setShowEditModal(false);
        setSelectedSubject(null);
        setFormData({
          name: '',
          code: '',
          description: '',
          examType: 'WAEC',
          duration: 120,
          questionCount: 50
        });
        fetchSubjects();
      } else {
        toast.error(data.message || 'Failed to update subject', { id: toastId });
      }
    } catch (error) {
      toast.error('Network error', { id: toastId });
    }
  };

  const handleDeleteSubject = async () => {
    if (!selectedSubject) return;

    const toastId = toast.loading('Deleting subject...');

    try {
      const response = await fetchWithAuth(`/super-admin/subjects/${selectedSubject.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Subject deleted successfully!', { id: toastId });
        setShowDeleteModal(false);
        setSelectedSubject(null);
        fetchSubjects();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete subject', { id: toastId });
      }
    } catch (error) {
      toast.error('Network error', { id: toastId });
    }
  };

  const handleEditClick = (subject) => {
    setSelectedSubject(subject);
    setFormData({
      name: subject.name || '',
      code: subject.code || '',
      description: subject.description || '',
      examType: subject.examType || 'WAEC',
      duration: subject.duration || 120,
      questionCount: subject.questionCount || 0
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (subject) => {
    setSelectedSubject(subject);
    setShowDeleteModal(true);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    if (timestamp._seconds) {
      return new Date(timestamp._seconds * 1000).toLocaleDateString();
    }
    return new Date(timestamp).toLocaleDateString();
  };

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = (subject.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (subject.code || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExamType = filterExamType === 'all' || subject.examType === filterExamType;
    return matchesSearch && matchesExamType;
  });

  const stats = {
    total: subjects.length,
    waec: subjects.filter(s => s.examType === 'WAEC').length,
    neco: subjects.filter(s => s.examType === 'NECO').length,
    jamb: subjects.filter(s => s.examType === 'JAMB').length
  };

  return (
    <div className={examsContainer}>
      <div className={examsHeader}>
        <h1 className={examsTitle}>Subject Management</h1>
        <p className={examsSubtitle}>Create and manage examination subjects</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className={superAdminStatCard}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[32px]">📚</span>
            <span className={superAdminStatValue}>{stats.total}</span>
          </div>
          <p className={superAdminStatLabel}>Total Subjects</p>
        </div>
        <div className={superAdminStatCard}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[32px]">📖</span>
            <span className={superAdminStatValue}>{stats.waec}</span>
          </div>
          <p className={superAdminStatLabel}>WAEC Subjects</p>
        </div>
        <div className={superAdminStatCard}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[32px]">📘</span>
            <span className={superAdminStatValue}>{stats.neco}</span>
          </div>
          <p className={superAdminStatLabel}>NECO Subjects</p>
        </div>
        <div className={superAdminStatCard}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[32px]">📗</span>
            <span className={superAdminStatValue}>{stats.jamb}</span>
          </div>
          <p className={superAdminStatLabel}>JAMB Subjects</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full lg:w-auto">
            <input
              type="text"
              placeholder="Search subjects by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
            />
          </div>
          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <select
              value={filterExamType}
              onChange={(e) => setFilterExamType(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
            >
              <option value="all">All Exam Types</option>
              <option value="WAEC">WAEC</option>
              <option value="NECO">NECO</option>
              <option value="JAMB">JAMB</option>
            </select>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2.5 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors font-[600] text-[13px] font-playfair whitespace-nowrap"
            >
              + Create Subject
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-12 h-12 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[14px] text-[#626060] font-playfair">Loading subjects...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Subject Name</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Code</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Exam Type</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Duration</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Questions</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Status</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Created</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSubjects.map((subject) => (
                  <motion.tr
                    key={subject.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-[14px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair mb-1">
                          {subject.name}
                        </p>
                        {subject.description && (
                          <p className="text-[11px] leading-[100%] font-[400] text-[#626060] font-playfair">
                            {subject.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">{subject.code}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">{subject.examType || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">{subject.duration || 120} mins</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">{subject.questionCount || 0}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] leading-[100%] font-[500] ${
                        subject.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                      } font-playfair`}>
                        {subject.status || 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[12px] leading-[100%] font-[400] text-[#626060] font-playfair">
                        {formatDate(subject.createdAt)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(subject)}
                          className="p-2 text-[#7C3AED] hover:bg-[#F5F3FF] rounded-md transition-colors"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteClick(subject)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
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
          {filteredSubjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[14px] leading-[100%] font-[400] text-[#9CA3AF] font-playfair">No subjects found</p>
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
              <h3 className={modalTitle}>Create New Subject</h3>
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-[12px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">Subject Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                      placeholder="e.g., Mathematics"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-[12px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">Subject Code *</label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                      placeholder="e.g., MATH101"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block mb-2 text-[12px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                    placeholder="Brief description of the subject"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-2 text-[12px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">Exam Type</label>
                    <select
                      name="examType"
                      value={formData.examType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                    >
                      <option value="WAEC">WAEC</option>
                      <option value="NECO">NECO</option>
                      <option value="JAMB">JAMB</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-[12px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">Duration (mins)</label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                      min="30"
                      max="240"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-[12px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">Questions</label>
                    <input
                      type="number"
                      name="questionCount"
                      value={formData.questionCount}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                      min="10"
                      max="200"
                    />
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
                  onClick={handleCreateSubject}
                  className="px-4 py-2 bg-[#7C3AED] text-white rounded-md hover:bg-[#6D28D9] transition-colors text-[13px] leading-[100%] font-[600] font-playfair"
                >
                  Create Subject
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showEditModal && selectedSubject && (
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
              className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className={modalTitle}>Edit Subject</h3>
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-[12px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">Subject Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-[12px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">Subject Code *</label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block mb-2 text-[12px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-2 text-[12px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">Exam Type</label>
                    <select
                      name="examType"
                      value={formData.examType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                    >
                      <option value="WAEC">WAEC</option>
                      <option value="NECO">NECO</option>
                      <option value="JAMB">JAMB</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-[12px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">Duration (mins)</label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-[12px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">Questions</label>
                    <input
                      type="number"
                      name="questionCount"
                      value={formData.questionCount}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
                    />
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
                  onClick={handleUpdateSubject}
                  className="px-4 py-2 bg-[#7C3AED] text-white rounded-md hover:bg-[#6D28D9] transition-colors text-[13px] leading-[100%] font-[600] font-playfair"
                >
                  Update Subject
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showDeleteModal && selectedSubject && (
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
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className={modalTitle}>Delete Subject</h3>
              <p className={modalText}>
                Are you sure you want to delete "{selectedSubject.name}"? This action cannot be undone.
              </p>
              <div className={modalActions}>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className={modalButtonSecondary}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteSubject}
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