// components/dashboard-content/Students.jsx
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
  superAdminStatCard,
  superAdminStatValue,
  superAdminStatLabel
} from '../../styles/styles';

const PAGE_SIZE = 50;

export default function Students() {
  const { fetchWithAuth } = useSuperAdminAuth();
  const [students, setStudents] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSchool, setFilterSchool] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentsRes, schoolsRes] = await Promise.all([
        fetchWithAuth(`/super-admin/students?limit=${PAGE_SIZE}&page=${page}`),
        fetchWithAuth('/super-admin/schools')
      ]);

      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        const list = studentsData.data || studentsData.students || [];
        setStudents(list);
        setTotalCount(studentsData.total || list.length);
      } else {
        toast.error('Failed to load students');
      }

      if (schoolsRes.ok) {
        const schoolsData = await schoolsRes.json();
        setSchools(schoolsData.schools || []);
      } else {
        toast.error('Failed to load schools');
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentDetails = async (student) => {
    try {
      const response = await fetchWithAuth(`/super-admin/students/${student.id}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedStudent(data.student || data);
        setShowDetailsModal(true);
      } else {
        const studentData = students.find(s => s.id === student.id);
        setSelectedStudent(studentData);
        setShowDetailsModal(true);
      }
    } catch (error) {
      const studentData = students.find(s => s.id === student.id);
      setSelectedStudent(studentData);
      setShowDetailsModal(true);
    }
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
      : 'bg-gray-100 text-gray-600';
  };

  const filteredStudents = students.filter(student => {
    const fullName = `${student.firstName || ''} ${student.lastName || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         (student.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (student.loginId || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSchool = filterSchool === 'all' || student.schoolId === filterSchool;
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    
    return matchesSearch && matchesSchool && matchesStatus;
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortBy === 'name') {
      const nameA = `${a.firstName || ''} ${a.lastName || ''}`;
      const nameB = `${b.firstName || ''} ${b.lastName || ''}`;
      return nameA.localeCompare(nameB);
    }
    if (sortBy === 'recent') {
      const dateA = a.updatedAt?._seconds || 0;
      const dateB = b.updatedAt?._seconds || 0;
      return dateB - dateA;
    }
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const stats = {
    total: totalCount,
    active: students.filter(s => s.status === 'active').length,
    totalExams: students.reduce((acc, s) => acc + (s.examsTaken || 0), 0)
  };

  return (
    <div className={examsContainer}>
      <div className={examsHeader}>
        <h1 className={examsTitle}>Student Overview</h1>
        <p className={examsSubtitle}>Track all students on the platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className={superAdminStatCard}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[32px]">🧑‍🎓</span>
            <span className={superAdminStatValue}>{stats.total}</span>
          </div>
          <p className={superAdminStatLabel}>Total Students</p>
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
            <span className="text-[32px]">📚</span>
            <span className={superAdminStatValue}>{stats.totalExams.toLocaleString()}</span>
          </div>
          <p className={superAdminStatLabel}>Exams Taken</p>
        </div>
      </div>

      <div className="card p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full lg:w-auto">
            <input
              type="text"
              placeholder="Search students by name, email, login ID..."
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
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:border-brand-primary text-[13px]"
            >
              <option value="name">Sort by Name</option>
              <option value="recent">Sort by Recent</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card p-12 text-center">
          <div className="spinner mx-auto mb-3" />
          <p className="text-[14px] text-content-secondary">Loading students...</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-muted border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-content-secondary uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-content-secondary uppercase tracking-wider">School</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-content-secondary uppercase tracking-wider">Class</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-content-secondary uppercase tracking-wider">Login ID</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-content-secondary uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-content-secondary uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-content-secondary uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-content-secondary uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortedStudents.map((student) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-surface-subtle transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-[14px] leading-[100%] font-[600] text-content-primary mb-1">
                          {student.firstName} {student.lastName}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[13px] leading-[100%] font-[500] text-content-primary">
                        {schools.find(s => s.id === student.schoolId)?.name || 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[13px] leading-[100%] font-[500] text-content-primary">{student.class || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[13px] leading-[100%] font-[500] text-content-primary">{student.loginId || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[12px] leading-[100%] font-[400] text-content-secondary">{student.email || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] leading-[100%] font-[500] ${getStatusColor(student.status)}`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[12px] leading-[100%] font-[400] text-content-secondary">
                        {formatDate(student.createdAt)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => fetchStudentDetails(student)}
                        className="p-2 text-brand-primary hover:bg-brand-primary-lt rounded-md transition-colors"
                      >
                        👁️
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {sortedStudents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[14px] leading-[100%] font-[400] text-content-muted">No students found</p>
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-border">
              <p className="text-[12px] text-content-secondary">
                Page {page} of {totalPages} &mdash; {totalCount.toLocaleString()} total students
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
        {showDetailsModal && selectedStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={modalOverlay}
            onClick={() => {
              setShowDetailsModal(false);
              setSelectedStudent(null);
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
                <h3 className={modalTitle}>Student Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-[11px] leading-[100%] font-[500] text-content-secondary uppercase mb-2">Personal Information</p>
                    <div className="bg-surface-muted rounded-lg p-4 space-y-3">
                      <div>
                        <p className="text-[10px] leading-[100%] font-[400] text-content-muted">Full Name</p>
                        <p className="text-[14px] leading-[100%] font-[600] text-content-primary mt-1">
                          {selectedStudent.firstName} {selectedStudent.lastName}
                        </p>
                      </div>
                      {selectedStudent.middleName && (
                        <div>
                          <p className="text-[10px] leading-[100%] font-[400] text-content-muted">Middle Name</p>
                          <p className="text-[13px] leading-[100%] font-[500] text-content-primary mt-1">{selectedStudent.middleName}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-[10px] leading-[100%] font-[400] text-content-muted">Email</p>
                        <p className="text-[13px] leading-[100%] font-[500] text-brand-primary mt-1">{selectedStudent.email}</p>
                      </div>
                      <div>
                        <p className="text-[10px] leading-[100%] font-[400] text-content-muted">Phone</p>
                        <p className="text-[13px] leading-[100%] font-[500] text-content-primary mt-1">{selectedStudent.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] leading-[100%] font-[400] text-content-muted">Date of Birth</p>
                        <p className="text-[13px] leading-[100%] font-[500] text-content-primary mt-1">{selectedStudent.dateOfBirth || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[11px] leading-[100%] font-[500] text-content-secondary uppercase mb-2">Academic Information</p>
                    <div className="bg-surface-muted rounded-lg p-4 space-y-3">
                      <div>
                        <p className="text-[10px] leading-[100%] font-[400] text-content-muted">School</p>
                        <p className="text-[13px] leading-[100%] font-[500] text-content-primary mt-1">
                          {schools.find(s => s.id === selectedStudent.schoolId)?.name || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] leading-[100%] font-[400] text-content-muted">Class</p>
                        <p className="text-[13px] leading-[100%] font-[500] text-content-primary mt-1">{selectedStudent.class || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] leading-[100%] font-[400] text-content-muted">Login ID</p>
                        <p className="text-[13px] leading-[100%] font-[500] text-content-primary mt-1">{selectedStudent.loginId}</p>
                      </div>
                      <div>
                        <p className="text-[10px] leading-[100%] font-[400] text-content-muted">Status</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-[10px] leading-[100%] font-[500] mt-1 ${getStatusColor(selectedStudent.status)}`}>
                          {selectedStudent.status}
                        </span>
                      </div>
                      {selectedStudent.subjects && selectedStudent.subjects.length > 0 && (
                        <div>
                          <p className="text-[10px] leading-[100%] font-[400] text-content-muted">Subjects</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedStudent.subjects?.map((subject, i) => (
                              <span key={i} className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-[9px] leading-[100%] font-[500]">
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div>
                        <p className="text-[10px] leading-[100%] font-[400] text-content-muted">Exam Mode</p>
                        <p className="text-[13px] leading-[100%] font-[500] text-content-primary mt-1">{selectedStudent.examMode ? 'Enabled' : 'Disabled'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className={modalButtonSecondary}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}