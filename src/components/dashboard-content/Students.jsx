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

export default function Students({ setActiveSection }) {
  const { fetchWithAuth } = useSuperAdminAuth();
  const [students, setStudents] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSchool, setFilterSchool] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPerformance, setFilterPerformance] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentsRes, schoolsRes] = await Promise.all([
        fetchWithAuth('/super-admin/students'),
        fetchWithAuth('/super-admin/schools')
      ]);

      const studentsData = await studentsRes.json();
      const schoolsData = await schoolsRes.json();

      setStudents(studentsData.students || []);
      setSchools(schoolsData.schools || []);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentDetails = async (student) => {
    try {
      const response = await fetchWithAuth(`/admin/students/${student.id}`);
      const data = await response.json();
      setSelectedStudent({ ...student, ...data });
      setShowDetailsModal(true);
    } catch (error) {
      toast.error('Failed to load student details');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    if (timestamp._seconds) {
      return new Date(timestamp._seconds * 1000).toLocaleDateString();
    }
    return new Date(timestamp).toLocaleDateString();
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    if (timestamp._seconds) {
      return new Date(timestamp._seconds * 1000).toLocaleTimeString();
    }
    return new Date(timestamp).toLocaleTimeString();
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-600' 
      : 'bg-gray-100 text-gray-600';
  };

  const getPerformanceColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBadge = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-600';
    if (score >= 70) return 'bg-blue-100 text-blue-600';
    if (score >= 60) return 'bg-yellow-100 text-yellow-600';
    return 'bg-red-100 text-red-600';
  };

  const filteredStudents = students.filter(student => {
    const fullName = `${student.firstName || ''} ${student.lastName || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         (student.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (student.loginId || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSchool = filterSchool === 'all' || student.schoolId === filterSchool;
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    
    let matchesPerformance = true;
    const avgScore = student.avgScore || 0;
    if (filterPerformance === 'excellent') matchesPerformance = avgScore >= 80;
    if (filterPerformance === 'good') matchesPerformance = avgScore >= 70 && avgScore < 80;
    if (filterPerformance === 'average') matchesPerformance = avgScore >= 60 && avgScore < 70;
    if (filterPerformance === 'poor') matchesPerformance = avgScore < 60;
    
    return matchesSearch && matchesSchool && matchesStatus && matchesPerformance;
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortBy === 'name') {
      const nameA = `${a.firstName || ''} ${a.lastName || ''}`;
      const nameB = `${b.firstName || ''} ${b.lastName || ''}`;
      return nameA.localeCompare(nameB);
    }
    if (sortBy === 'score') return (b.avgScore || 0) - (a.avgScore || 0);
    if (sortBy === 'recent') {
      const dateA = a.updatedAt?._seconds || 0;
      const dateB = b.updatedAt?._seconds || 0;
      return dateB - dateA;
    }
    return 0;
  });

  const stats = {
    total: students.length,
    active: students.filter(s => s.status === 'active').length,
    avgScore: Math.round(students.reduce((acc, s) => acc + (s.avgScore || 0), 0) / (students.length || 1)),
    totalExams: students.reduce((acc, s) => acc + (s.examsTaken || 0), 0),
    excellent: students.filter(s => (s.avgScore || 0) >= 80).length,
    passRate: Math.round(students.filter(s => (s.avgScore || 0) >= 50).length / (students.length || 1) * 100)
  };

  return (
    <div className={examsContainer}>
      <div className={examsHeader}>
        <h1 className={examsTitle}>Student Overview</h1>
        <p className={examsSubtitle}>Track all students across Kogi State</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
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
        <div className={superAdminStatCard}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[32px]">📊</span>
            <span className={superAdminStatValue}>{stats.avgScore}%</span>
          </div>
          <p className={superAdminStatLabel}>Avg Score</p>
        </div>
        <div className={superAdminStatCard}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[32px]">⭐</span>
            <span className={superAdminStatValue}>{stats.excellent}</span>
          </div>
          <p className={superAdminStatLabel}>Excellent (80%+)</p>
        </div>
        <div className={superAdminStatCard}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[32px]">✅</span>
            <span className={superAdminStatValue}>{stats.passRate}%</span>
          </div>
          <p className={superAdminStatLabel}>Pass Rate</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full lg:w-auto">
            <input
              type="text"
              placeholder="Search students by name, email, login ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1565c0] text-[13px] font-playfair"
            />
          </div>
          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <select
              value={filterSchool}
              onChange={(e) => setFilterSchool(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1565c0] text-[13px] font-playfair"
            >
              <option value="all">All Schools</option>
              {schools.map(school => (
                <option key={school.id} value={school.id}>{school.name}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1565c0] text-[13px] font-playfair"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={filterPerformance}
              onChange={(e) => setFilterPerformance(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1565c0] text-[13px] font-playfair"
            >
              <option value="all">All Performance</option>
              <option value="excellent">Excellent (80%+)</option>
              <option value="good">Good (70-79%)</option>
              <option value="average">Average (60-69%)</option>
              <option value="poor">Poor (Below 60%)</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1565c0] text-[13px] font-playfair"
            >
              <option value="name">Sort by Name</option>
              <option value="score">Sort by Score</option>
              <option value="recent">Sort by Recent</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-12 h-12 border-4 border-[#1565c0] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[14px] text-[#626060] font-playfair">Loading students...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Student</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">School</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Class</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Login ID</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Email</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Status</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Created</th>
                  <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedStudents.map((student) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-[14px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair mb-1">
                          {student.firstName} {student.lastName}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">
                        {schools.find(s => s.id === student.schoolId)?.name || 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">{student.class || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">{student.loginId || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[12px] leading-[100%] font-[400] text-[#626060] font-playfair">{student.email || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] leading-[100%] font-[500] ${getStatusColor(student.status)} font-playfair`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[12px] leading-[100%] font-[400] text-[#626060] font-playfair">
                        {formatDate(student.createdAt)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => fetchStudentDetails(student)}
                        className="p-2 text-[#1565c0] hover:bg-[#E8F0FE] rounded-md transition-colors"
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
              <p className="text-[14px] leading-[100%] font-[400] text-[#9CA3AF] font-playfair">No students found</p>
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
                    <p className="text-[11px] leading-[100%] font-[500] text-[#626060] uppercase mb-2 font-playfair">Personal Information</p>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div>
                        <p className="text-[10px] leading-[100%] font-[400] text-[#9CA3AF] font-playfair">Full Name</p>
                        <p className="text-[14px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair mt-1">
                          {selectedStudent.firstName} {selectedStudent.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] leading-[100%] font-[400] text-[#9CA3AF] font-playfair">Email</p>
                        <p className="text-[13px] leading-[100%] font-[500] text-[#1565c0] font-playfair mt-1">{selectedStudent.email}</p>
                      </div>
                      <div>
                        <p className="text-[10px] leading-[100%] font-[400] text-[#9CA3AF] font-playfair">NIN</p>
                        <p className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair mt-1">{selectedStudent.nin || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] leading-[100%] font-[400] text-[#9CA3AF] font-playfair">Phone</p>
                        <p className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair mt-1">{selectedStudent.phone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[11px] leading-[100%] font-[500] text-[#626060] uppercase mb-2 font-playfair">Academic Information</p>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div>
                        <p className="text-[10px] leading-[100%] font-[400] text-[#9CA3AF] font-playfair">School</p>
                        <p className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair mt-1">
                          {schools.find(s => s.id === selectedStudent.schoolId)?.name || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] leading-[100%] font-[400] text-[#9CA3AF] font-playfair">Class</p>
                        <p className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair mt-1">{selectedStudent.class || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] leading-[100%] font-[400] text-[#9CA3AF] font-playfair">Login ID</p>
                        <p className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair mt-1">{selectedStudent.loginId}</p>
                      </div>
                      <div>
                        <p className="text-[10px] leading-[100%] font-[400] text-[#9CA3AF] font-playfair">Date of Birth</p>
                        <p className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair mt-1">
                          {selectedStudent.dateOfBirth ? new Date(selectedStudent.dateOfBirth).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] leading-[100%] font-[400] text-[#9CA3AF] font-playfair">Subjects</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedStudent.subjects?.map((subject, i) => (
                            <span key={i} className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-[9px] leading-[100%] font-[500]">
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
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