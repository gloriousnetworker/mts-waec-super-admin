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

export default function Students({ setActiveSection }) {
  const { user } = useSuperAdminAuth();
  const [students, setStudents] = useState([]);
  const [schools, setSchools] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSchool, setFilterSchool] = useState('all');
  const [filterLGA, setFilterLGA] = useState('all');
  const [filterPerformance, setFilterPerformance] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    const storedStudents = localStorage.getItem('all_students');
    const storedSchools = localStorage.getItem('schools');
    
    if (storedSchools) {
      setSchools(JSON.parse(storedSchools));
    } else {
      const demoSchools = [
        { id: 'SCH001', name: 'Kogi State College of Education', lga: 'Lokoja' },
        { id: 'SCH002', name: 'Government Secondary School, Lokoja', lga: 'Lokoja' },
        { id: 'SCH003', name: 'St. Theresa\'s College, Okene', lga: 'Okene' },
        { id: 'SCH004', name: 'Federal Government College, Ankpa', lga: 'Ankpa' },
        { id: 'SCH005', name: 'Community Secondary School, Idah', lga: 'Idah' },
        { id: 'SCH006', name: 'Kogi State University', lga: 'Anyigba' },
        { id: 'SCH007', name: 'Technical College, Anyigba', lga: 'Anyigba' }
      ];
      setSchools(demoSchools);
      localStorage.setItem('schools', JSON.stringify(demoSchools));
    }
    
    if (storedStudents) {
      setStudents(JSON.parse(storedStudents));
    } else {
      const demoStudents = [
        {
          id: 'STU001',
          name: 'Adebayo Oluwaseun',
          email: 'adebayo.oluwaseun@ksce.edu.ng',
          studentId: 'KSCE/2023/001',
          school: 'Kogi State College of Education',
          schoolId: 'SCH001',
          lga: 'Lokoja',
          class: 'Year 3',
          department: 'Computer Science',
          examsTaken: 24,
          avgScore: 78,
          passRate: 85,
          lastActive: '2024-01-15T10:30:00',
          status: 'active',
          registeredDate: '2023-09-01T00:00:00',
          performance: [
            { subject: 'Mathematics', score: 82 },
            { subject: 'English', score: 75 },
            { subject: 'Physics', score: 80 },
            { subject: 'Chemistry', score: 76 }
          ]
        },
        {
          id: 'STU002',
          name: 'Blessing Ochefu',
          email: 'blessing.ochefu@gssokoja.edu.ng',
          studentId: 'GSSL/2023/045',
          school: 'Government Secondary School, Lokoja',
          schoolId: 'SCH002',
          lga: 'Lokoja',
          class: 'SS 3',
          department: 'Science',
          examsTaken: 18,
          avgScore: 82,
          passRate: 92,
          lastActive: '2024-01-15T09:15:00',
          status: 'active',
          registeredDate: '2023-09-15T00:00:00',
          performance: [
            { subject: 'Mathematics', score: 88 },
            { subject: 'English', score: 79 },
            { subject: 'Biology', score: 85 },
            { subject: 'Chemistry', score: 77 }
          ]
        },
        {
          id: 'STU003',
          name: 'Chinedu Okonkwo',
          email: 'chinedu.okonkwo@sttheresas.edu.ng',
          studentId: 'STC/2023/089',
          school: 'St. Theresa\'s College, Okene',
          schoolId: 'SCH003',
          lga: 'Okene',
          class: 'SS 2',
          department: 'Science',
          examsTaken: 15,
          avgScore: 71,
          passRate: 68,
          lastActive: '2024-01-14T14:20:00',
          status: 'active',
          registeredDate: '2023-10-01T00:00:00',
          performance: [
            { subject: 'Mathematics', score: 68 },
            { subject: 'English', score: 72 },
            { subject: 'Physics', score: 70 },
            { subject: 'Chemistry', score: 74 }
          ]
        },
        {
          id: 'STU004',
          name: 'Fatima Abdullahi',
          email: 'fatima.abdullahi@fgcankpa.edu.ng',
          studentId: 'FGCA/2023/112',
          school: 'Federal Government College, Ankpa',
          schoolId: 'SCH004',
          lga: 'Ankpa',
          class: 'SS 3',
          department: 'Arts',
          examsTaken: 20,
          avgScore: 88,
          passRate: 95,
          lastActive: '2024-01-15T11:45:00',
          status: 'active',
          registeredDate: '2023-08-15T00:00:00',
          performance: [
            { subject: 'English', score: 92 },
            { subject: 'Literature', score: 89 },
            { subject: 'Government', score: 86 },
            { subject: 'Economics', score: 84 }
          ]
        },
        {
          id: 'STU005',
          name: 'Grace Eze',
          email: 'grace.eze@cssidah.edu.ng',
          studentId: 'CSSI/2023/067',
          school: 'Community Secondary School, Idah',
          schoolId: 'SCH005',
          lga: 'Idah',
          class: 'SS 1',
          department: 'Commercial',
          examsTaken: 10,
          avgScore: 65,
          passRate: 60,
          lastActive: '2024-01-13T16:30:00',
          status: 'inactive',
          registeredDate: '2023-11-01T00:00:00',
          performance: [
            { subject: 'Mathematics', score: 58 },
            { subject: 'English', score: 62 },
            { subject: 'Accounting', score: 70 },
            { subject: 'Commerce', score: 68 }
          ]
        },
        {
          id: 'STU006',
          name: 'Hassan Ibrahim',
          email: 'hassan.ibrahim@ksu.edu.ng',
          studentId: 'KSU/2023/234',
          school: 'Kogi State University',
          schoolId: 'SCH006',
          lga: 'Anyigba',
          class: '200 Level',
          department: 'Engineering',
          examsTaken: 32,
          avgScore: 91,
          passRate: 98,
          lastActive: '2024-01-15T08:20:00',
          status: 'active',
          registeredDate: '2022-09-01T00:00:00',
          performance: [
            { subject: 'Mathematics', score: 94 },
            { subject: 'Physics', score: 92 },
            { subject: 'Thermodynamics', score: 89 },
            { subject: 'Mechanics', score: 90 }
          ]
        },
        {
          id: 'STU007',
          name: 'Janet Okafor',
          email: 'janet.okafor@tcanyigba.edu.ng',
          studentId: 'TCA/2023/045',
          school: 'Technical College, Anyigba',
          schoolId: 'SCH007',
          lga: 'Anyigba',
          class: 'ND 2',
          department: 'Electrical Engineering',
          examsTaken: 28,
          avgScore: 76,
          passRate: 82,
          lastActive: '2024-01-14T13:10:00',
          status: 'active',
          registeredDate: '2023-05-18T00:00:00',
          performance: [
            { subject: 'Mathematics', score: 78 },
            { subject: 'Physics', score: 74 },
            { subject: 'Electronics', score: 80 },
            { subject: 'Workshop', score: 72 }
          ]
        },
        {
          id: 'STU008',
          name: 'Kingsley Obiora',
          email: 'kingsley.obiora@ksce.edu.ng',
          studentId: 'KSCE/2023/156',
          school: 'Kogi State College of Education',
          schoolId: 'SCH001',
          lga: 'Lokoja',
          class: 'Year 2',
          department: 'Biology',
          examsTaken: 16,
          avgScore: 69,
          passRate: 71,
          lastActive: '2024-01-12T11:30:00',
          status: 'active',
          registeredDate: '2023-09-01T00:00:00',
          performance: [
            { subject: 'Biology', score: 74 },
            { subject: 'Chemistry', score: 65 },
            { subject: 'Mathematics', score: 68 },
            { subject: 'English', score: 70 }
          ]
        },
        {
          id: 'STU009',
          name: 'Loveth Akpan',
          email: 'loveth.akpan@fgcankpa.edu.ng',
          studentId: 'FGCA/2023/201',
          school: 'Federal Government College, Ankpa',
          schoolId: 'SCH004',
          lga: 'Ankpa',
          class: 'SS 2',
          department: 'Science',
          examsTaken: 14,
          avgScore: 84,
          passRate: 90,
          lastActive: '2024-01-15T09:45:00',
          status: 'active',
          registeredDate: '2023-08-15T00:00:00',
          performance: [
            { subject: 'Mathematics', score: 86 },
            { subject: 'Physics', score: 82 },
            { subject: 'Chemistry', score: 84 },
            { subject: 'Biology', score: 83 }
          ]
        },
        {
          id: 'STU010',
          name: 'Michael Adams',
          email: 'michael.adams@ksu.edu.ng',
          studentId: 'KSU/2023/178',
          school: 'Kogi State University',
          schoolId: 'SCH006',
          lga: 'Anyigba',
          class: '300 Level',
          department: 'Computer Science',
          examsTaken: 42,
          avgScore: 94,
          passRate: 100,
          lastActive: '2024-01-15T10:05:00',
          status: 'active',
          registeredDate: '2022-09-01T00:00:00',
          performance: [
            { subject: 'Programming', score: 96 },
            { subject: 'Algorithms', score: 94 },
            { subject: 'Database', score: 92 },
            { subject: 'Networks', score: 93 }
          ]
        }
      ];
      setStudents(demoStudents);
      localStorage.setItem('all_students', JSON.stringify(demoStudents));
    }
  }, []);

  const lgas = ['Lokoja', 'Okene', 'Ankpa', 'Idah', 'Anyigba', 'Dekina', 'Kabba', 'Ogori-Magongo', 'Okehi', 'Olamaboro'];

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setShowDetailsModal(true);
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
    const matchesSearch = (student.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (student.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (student.studentId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (student.school || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSchool = filterSchool === 'all' || student.schoolId === filterSchool;
    const matchesLGA = filterLGA === 'all' || student.lga === filterLGA;
    
    let matchesPerformance = true;
    if (filterPerformance === 'excellent') matchesPerformance = (student.avgScore || 0) >= 80;
    if (filterPerformance === 'good') matchesPerformance = (student.avgScore || 0) >= 70 && (student.avgScore || 0) < 80;
    if (filterPerformance === 'average') matchesPerformance = (student.avgScore || 0) >= 60 && (student.avgScore || 0) < 70;
    if (filterPerformance === 'poor') matchesPerformance = (student.avgScore || 0) < 60;
    
    return matchesSearch && matchesSchool && matchesLGA && matchesPerformance;
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
    if (sortBy === 'score') return (b.avgScore || 0) - (a.avgScore || 0);
    if (sortBy === 'recent') return new Date(b.lastActive || 0) - new Date(a.lastActive || 0);
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
          <p className={superAdminStatLabel}>Active Today</p>
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
              placeholder="Search students by name, ID, email or school..."
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
              value={filterLGA}
              onChange={(e) => setFilterLGA(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1565c0] text-[13px] font-playfair"
            >
              <option value="all">All LGAs</option>
              {lgas.map(lga => (
                <option key={lga} value={lga}>{lga}</option>
              ))}
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

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Student</th>
                <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">School</th>
                <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Class/Dept</th>
                <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">LGA</th>
                <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Exams</th>
                <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Avg Score</th>
                <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Status</th>
                <th className="px-6 py-4 text-left text-[11px] leading-[100%] font-[600] text-[#626060] uppercase tracking-wider font-playfair">Last Active</th>
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
                      <p className="text-[14px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair mb-1">{student.name || ''}</p>
                      <p className="text-[11px] leading-[100%] font-[400] text-[#626060] font-playfair">{student.studentId || ''}</p>
                      <p className="text-[10px] leading-[100%] font-[400] text-[#9CA3AF] mt-1 font-playfair">{student.email || ''}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">{student.school || ''}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">{student.class || ''}</p>
                    <p className="text-[10px] leading-[100%] font-[400] text-[#9CA3AF] mt-1 font-playfair">{student.department || ''}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">{student.lga || ''}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[13px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair">{student.examsTaken || 0}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-[13px] leading-[100%] font-[600] ${getPerformanceColor(student.avgScore || 0)} font-playfair`}>
                        {student.avgScore || 0}%
                      </span>
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            (student.avgScore || 0) >= 80 ? 'bg-green-500' :
                            (student.avgScore || 0) >= 70 ? 'bg-blue-500' :
                            (student.avgScore || 0) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${student.avgScore || 0}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] leading-[100%] font-[500] ${getStatusColor(student.status)} font-playfair`}>
                      {student.status || 'inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[12px] leading-[100%] font-[400] text-[#626060] font-playfair">
                      {student.lastActive ? new Date(student.lastActive).toLocaleDateString() : 'N/A'}
                    </p>
                    <p className="text-[10px] leading-[100%] font-[400] text-[#9CA3AF] mt-1 font-playfair">
                      {student.lastActive ? new Date(student.lastActive).toLocaleTimeString() : ''}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleViewDetails(student)}
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

      <AnimatePresence>
        {showDetailsModal && selectedStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={modalOverlay}
            onClick={() => setShowDetailsModal(false)}
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
                        <p className="text-[14px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair mt-1">{selectedStudent.name}</p>
                      </div>
                      <div>
                        <p className="text-[10px] leading-[100%] font-[400] text-[#9CA3AF] font-playfair">Student ID</p>
                        <p className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair mt-1">{selectedStudent.studentId}</p>
                      </div>
                      <div>
                        <p className="text-[10px] leading-[100%] font-[400] text-[#9CA3AF] font-playfair">Email</p>
                        <p className="text-[13px] leading-[100%] font-[500] text-[#1565c0] font-playfair mt-1">{selectedStudent.email}</p>
                      </div>
                      <div>
                        <p className="text-[10px] leading-[100%] font-[400] text-[#9CA3AF] font-playfair">LGA</p>
                        <p className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair mt-1">{selectedStudent.lga}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] leading-[100%] font-[500] text-[#626060] uppercase mb-2 font-playfair">Academic Information</p>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div>
                        <p className="text-[10px] leading-[100%] font-[400] text-[#9CA3AF] font-playfair">School</p>
                        <p className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair mt-1">{selectedStudent.school}</p>
                      </div>
                      <div>
                        <p className="text-[10px] leading-[100%] font-[400] text-[#9CA3AF] font-playfair">Class/Level</p>
                        <p className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair mt-1">{selectedStudent.class}</p>
                      </div>
                      <div>
                        <p className="text-[10px] leading-[100%] font-[400] text-[#9CA3AF] font-playfair">Department</p>
                        <p className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair mt-1">{selectedStudent.department}</p>
                      </div>
                      <div>
                        <p className="text-[10px] leading-[100%] font-[400] text-[#9CA3AF] font-playfair">Registered Date</p>
                        <p className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair mt-1">
                          {new Date(selectedStudent.registeredDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[11px] leading-[100%] font-[500] text-[#626060] uppercase mb-2 font-playfair">Performance Overview</p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-3 bg-white rounded-lg">
                          <p className="text-[20px] leading-[100%] font-[700] text-[#1E1E1E] font-playfair">{selectedStudent.examsTaken}</p>
                          <p className="text-[10px] leading-[100%] font-[400] text-[#9CA3AF] mt-1 font-playfair">Exams Taken</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg">
                          <p className={`text-[20px] leading-[100%] font-[700] ${getPerformanceColor(selectedStudent.avgScore)} font-playfair`}>
                            {selectedStudent.avgScore}%
                          </p>
                          <p className="text-[10px] leading-[100%] font-[400] text-[#9CA3AF] mt-1 font-playfair">Average Score</p>
                        </div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <p className="text-[20px] leading-[100%] font-[700] text-green-600 font-playfair">{selectedStudent.passRate}%</p>
                        <p className="text-[10px] leading-[100%] font-[400] text-[#9CA3AF] mt-1 font-playfair">Pass Rate</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] leading-[100%] font-[500] text-[#626060] uppercase mb-2 font-playfair">Subject Performance</p>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      {selectedStudent.performance && selectedStudent.performance.map((subject, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-[12px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">{subject.subject}</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-[12px] leading-[100%] font-[600] ${getPerformanceColor(subject.score)} font-playfair`}>
                              {subject.score}%
                            </span>
                            <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  subject.score >= 80 ? 'bg-green-500' :
                                  subject.score >= 70 ? 'bg-blue-500' :
                                  subject.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${subject.score}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] leading-[100%] font-[500] text-[#626060] uppercase mb-2 font-playfair">Status Information</p>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[12px] leading-[100%] font-[400] text-[#626060] font-playfair">Current Status</span>
                        <span className={`px-2 py-1 rounded-full text-[10px] leading-[100%] font-[500] ${getStatusColor(selectedStudent.status)} font-playfair`}>
                          {selectedStudent.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[12px] leading-[100%] font-[400] text-[#626060] font-playfair">Last Active</span>
                        <span className="text-[12px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">
                          {new Date(selectedStudent.lastActive).toLocaleString()}
                        </span>
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
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    toast.success('Message sent to student');
                  }}
                  className="px-4 py-2 bg-[#1565c0] text-white rounded-md hover:bg-[#0d47a1] transition-colors text-[13px] leading-[100%] font-[600] font-playfair"
                >
                  Send Message
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}