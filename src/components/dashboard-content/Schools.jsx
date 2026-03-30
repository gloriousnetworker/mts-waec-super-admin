// components/dashboard-content/Schools.jsx
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSuperAdminAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { School, CheckCircle, GraduationCap, Pencil, Trash2, Search, Plus, ExternalLink } from 'lucide-react';
import SchoolDetail from './SchoolDetail';
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

export default function Schools() {
  const { fetchWithAuth } = useSuperAdminAuth();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailSchool, setDetailSchool] = useState(null); // { id, name }
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
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
  }, [page]);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`/super-admin/schools?limit=${PAGE_SIZE}&page=${page}`);
      if (response.ok) {
        const data = await response.json();
        const list = data.data || data.schools || [];
        setSchools(list);
        setTotalCount(data.total || list.length);
      } else {
        toast.error('Failed to load schools');
      }
    } catch (error) {
      toast.error('Network error');
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

  const handleUpdateSchool = async () => {
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

  const handleToggleStatus = async (school) => {
    const newStatus = school.status === 'active' ? 'suspended' : 'active';
    const toastId = toast.loading(`${newStatus === 'active' ? 'Activating' : 'Suspending'} school...`);

    try {
      const response = await fetchWithAuth(`/super-admin/schools/${school.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        toast.success(`School ${newStatus} successfully!`, { id: toastId });
        fetchSchools();
      } else {
        const data = await response.json();
        toast.error(data.message || `Failed to ${newStatus} school`, { id: toastId });
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

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const stats = {
    total: totalCount,
    active: schools.filter(s => s.status === 'active').length,
    totalStudents: schools.reduce((sum, s) => sum + (s.studentCount || 0), 0)
  };

  // ── School detail drill-down ──────────────────────────────────────────────
  if (detailSchool) {
    return (
      <div className={examsContainer}>
        <SchoolDetail
          schoolId={detailSchool.id}
          schoolName={detailSchool.name}
          onBack={() => setDetailSchool(null)}
        />
      </div>
    );
  }

  return (
    <div className={examsContainer}>
      <div className={examsHeader}>
        <h1 className={examsTitle}>Schools Management</h1>
        <p className={examsSubtitle}>Manage all registered schools on the platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { Icon: School,       label: 'Total Schools',  value: stats.total },
          { Icon: CheckCircle,  label: 'Active Schools', value: stats.active },
          { Icon: GraduationCap,label: 'Total Students', value: stats.totalStudents.toLocaleString() },
        ].map(({ Icon, label, value }) => (
          <div key={label} className={superAdminStatCard}>
            <div className="flex items-center justify-between mb-2">
              <span className="w-10 h-10 rounded-lg bg-brand-primary-lt flex items-center justify-center text-brand-primary">
                <Icon size={20} strokeWidth={2} />
              </span>
              <span className={superAdminStatValue}>{value}</span>
            </div>
            <p className={superAdminStatLabel}>{label}</p>
          </div>
        ))}
      </div>

      <div className="card p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, email or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-9"
            />
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={16} strokeWidth={2.5} />
            Add School
          </button>
        </div>
      </div>

      {loading ? (
        <div className="card p-12 text-center">
          <div className="spinner mx-auto mb-3" />
          <p className="text-sm text-content-secondary">Loading schools...</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="table-header-cell">School</th>
                  <th className="table-header-cell">Address</th>
                  <th className="table-header-cell">Contact</th>
                  <th className="table-header-cell">Students</th>
                  <th className="table-header-cell">Status</th>
                  <th className="table-header-cell">Created</th>
                  <th className="table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredSchools.map((school) => (
                  <motion.tr
                    key={school.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="table-row"
                  >
                    <td className="table-cell">
                      <p className="text-sm font-semibold text-content-primary">{school.name}</p>
                      <p className="text-xs text-content-muted mt-0.5">ID: {school.id}</p>
                    </td>
                    <td className="table-cell">
                      <p className="text-sm text-content-secondary">{school.address}</p>
                    </td>
                    <td className="table-cell">
                      <p className="text-sm text-content-secondary">{school.phone || 'N/A'}</p>
                      <p className="text-xs text-content-muted mt-0.5">{school.email || 'N/A'}</p>
                    </td>
                    <td className="table-cell">
                      <p className="text-sm font-semibold text-content-primary">{school.studentCount || 0}</p>
                    </td>
                    <td className="table-cell">
                      <button
                        onClick={() => handleToggleStatus(school)}
                        className={school.status === 'active' ? 'badge-success' : 'badge-muted'}
                      >
                        {school.status === 'active' ? 'Active' : 'Suspended'}
                      </button>
                    </td>
                    <td className="table-cell">
                      <p className="text-sm text-content-muted">{formatDate(school.createdAt)}</p>
                    </td>
                    <td className="table-cell">
                      <div className="flex gap-1">
                        <button onClick={() => setDetailSchool({ id: school.id, name: school.name })} className="action-btn-edit" aria-label="View Details" title="View Details">
                          <ExternalLink size={15} strokeWidth={2} />
                        </button>
                        <button onClick={() => openEditModal(school)} className="action-btn-edit" aria-label="Edit">
                          <Pencil size={15} strokeWidth={2} />
                        </button>
                        <button onClick={() => openDeleteModal(school)} className="action-btn-danger" aria-label="Delete">
                          <Trash2 size={15} strokeWidth={2} />
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
              <p className="text-sm text-content-muted">No schools found</p>
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-border">
              <p className="text-xs text-content-muted">
                Page {page} of {totalPages} — {totalCount.toLocaleString()} total
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="pagination-btn"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="pagination-btn"
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
              className="modal-container p-6 w-full mx-4 max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className={modalTitle}>Add New School</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-content-secondary uppercase tracking-wider">School Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., Kogi State College"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-content-secondary uppercase tracking-wider">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="123 Education Road, Lokoja"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-content-secondary uppercase tracking-wider">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="08012345678"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-content-secondary uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-field"
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
                  className="btn-primary"
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
              className="modal-container p-6 w-full mx-4 max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className={modalTitle}>Edit School</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-content-secondary uppercase tracking-wider">School Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-content-secondary uppercase tracking-wider">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-content-secondary uppercase tracking-wider">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-content-secondary uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
              </div>
              <div className={modalActions}>
                <button onClick={() => setShowEditModal(false)} className={modalButtonSecondary}>
                  Cancel
                </button>
                <button
                  onClick={handleUpdateSchool}
                  className="btn-primary"
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