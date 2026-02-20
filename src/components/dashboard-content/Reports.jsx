'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  examsContainer,
  examsHeader,
  examsTitle,
  examsSubtitle,
  examsTabsGrid,
  examsTabButton,
  examsTabButtonActive,
  examsTabButtonInactive,
  buttonPrimary
} from '../../styles/styles';

export default function Reports({ setActiveSection }) {
  const [reportType, setReportType] = useState('school');
  const [dateRange, setDateRange] = useState('month');
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [format, setFormat] = useState('csv');
  const [schools, setSchools] = useState([]);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const storedSchools = JSON.parse(localStorage.getItem('schools') || '[]');
    if (storedSchools.length === 0) {
      const demoSchools = [
        { id: 'SCH001', name: 'Kogi State College of Education', students: 1245, admins: 12 },
        { id: 'SCH002', name: 'Government Secondary School, Lokoja', students: 987, admins: 8 },
        { id: 'SCH003', name: 'St. Theresa\'s College, Okene', students: 876, admins: 7 },
        { id: 'SCH004', name: 'Federal Government College, Ankpa', students: 934, admins: 9 },
        { id: 'SCH005', name: 'Community Secondary School, Idah', students: 789, admins: 6 },
        { id: 'SCH006', name: 'King\'s College, Kabba', students: 845, admins: 7 },
        { id: 'SCH007', name: 'Queen\'s College, Dekina', students: 912, admins: 8 },
        { id: 'SCH008', name: 'Baptist High School, Ayingba', students: 678, admins: 5 },
      ];
      setSchools(demoSchools);
      localStorage.setItem('schools', JSON.stringify(demoSchools));
    } else {
      setSchools(storedSchools);
    }
  }, []);

  const generateReportData = () => {
    const students = JSON.parse(localStorage.getItem('all_students') || '[]');
    const admins = JSON.parse(localStorage.getItem('admins') || '[]');
    const schools = JSON.parse(localStorage.getItem('schools') || '[]');
    const exams = JSON.parse(localStorage.getItem('all_exams') || '[]');

    if (reportType === 'school') {
      return schools.map(school => ({
        'School Name': school.name,
        'Total Students': school.students || 0,
        'Total Admins': school.admins || 0,
        'Average Score': Math.floor(Math.random() * 30 + 60) + '%',
        'Pass Rate': Math.floor(Math.random() * 20 + 70) + '%',
        'Exams Taken': Math.floor(Math.random() * 500 + 200),
        'Active Students': Math.floor(school.students * 0.8),
        'Last Updated': new Date().toLocaleDateString()
      }));
    } else if (reportType === 'student') {
      return students.slice(0, 50).map(student => ({
        'Student ID': student.id || 'N/A',
        'Name': `${student.firstName || ''} ${student.lastName || ''}`,
        'School': student.school || 'Kogi State College of Education',
        'Class': student.class || 'SS3',
        'Exams Taken': student.examsTaken || Math.floor(Math.random() * 20 + 5),
        'Average Score': (student.avgScore || Math.floor(Math.random() * 30 + 60)) + '%',
        'Last Active': student.lastActive || new Date().toLocaleDateString(),
        'Status': (student.avgScore || 70) >= 50 ? 'Active' : 'Needs Improvement'
      }));
    } else if (reportType === 'performance') {
      return [
        { 'Metric': 'Overall Pass Rate', 'Value': '72%', 'Change': '+3%', 'Target': '75%' },
        { 'Metric': 'Average Score', 'Value': '68%', 'Change': '+2%', 'Target': '70%' },
        { 'Metric': 'Student Engagement', 'Value': '78%', 'Change': '+5%', 'Target': '80%' },
        { 'Metric': 'Exam Completion Rate', 'Value': '85%', 'Change': '+1%', 'Target': '90%' },
        { 'Metric': 'Support Resolution', 'Value': '92%', 'Change': '+4%', 'Target': '95%' },
      ];
    } else if (reportType === 'ministry') {
      return [
        { 'Local Government': 'Kogi East', 'Schools': 42, 'Students': 5234, 'Admins': 89, 'Pass Rate': '71%', 'Average Score': '67%' },
        { 'Local Government': 'Kogi Central', 'Schools': 38, 'Students': 4876, 'Admins': 76, 'Pass Rate': '69%', 'Average Score': '66%' },
        { 'Local Government': 'Kogi West', 'Schools': 40, 'Students': 5124, 'Admins': 82, 'Pass Rate': '73%', 'Average Score': '69%' },
        { 'Local Government': 'Total', 'Schools': 120, 'Students': 15234, 'Admins': 247, 'Pass Rate': '71%', 'Average Score': '67.3%' },
      ];
    }
    return [];
  };

  const downloadCSV = (data, filename) => {
    if (!data || data.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).map(value => 
      typeof value === 'string' && value.includes(',') ? `"${value}"` : value
    ).join(','));
    
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadJSON = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleGenerateReport = () => {
    setGenerating(true);
    
    setTimeout(() => {
      const data = generateReportData();
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${reportType}_report_${timestamp}`;
      
      if (format === 'csv') {
        downloadCSV(data, filename);
      } else if (format === 'json') {
        downloadJSON(data, filename);
      } else if (format === 'excel') {
        downloadCSV(data, filename);
        toast('Excel format not available, downloading as CSV instead');
      }
      
      setGenerating(false);
      toast.success(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report generated successfully!`);
    }, 2000);
  };

  const reportTypes = [
    { id: 'school', name: 'School Report', desc: 'Detailed information about schools' },
    { id: 'student', name: 'Student Report', desc: 'Student performance and activity' },
    { id: 'performance', name: 'Performance Analytics', desc: 'Academic performance metrics' },
    { id: 'ministry', name: 'Ministry Report', desc: 'State-wide education statistics' },
    { id: 'admin', name: 'Admin Activity', desc: 'Admin login and support metrics' },
    { id: 'exam', name: 'Exam Statistics', desc: 'Exam completion and results' },
  ];

  const dateRanges = [
    { id: 'today', name: 'Today' },
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' },
    { id: 'quarter', name: 'This Quarter' },
    { id: 'year', name: 'This Year' },
    { id: 'custom', name: 'Custom Range' },
  ];

  return (
    <div className={examsContainer}>
      <div className={examsHeader}>
        <h1 className={examsTitle}>Report Generation</h1>
        <p className={examsSubtitle}>Generate comprehensive reports for the Kogi State Ministry of Education</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {reportTypes.slice(0, 3).map((type) => (
          <button
            key={type.id}
            onClick={() => setReportType(type.id)}
            className={`p-6 rounded-xl border-2 transition-all ${
              reportType === type.id
                ? 'border-[#7C3AED] bg-[#F5F3FF]'
                : 'border-gray-200 bg-white hover:border-[#7C3AED]'
            }`}
          >
            <div className="text-[24px] mb-3">
              {type.id === 'school' && '🏫'}
              {type.id === 'student' && '🧑‍🎓'}
              {type.id === 'performance' && '📊'}
            </div>
            <h3 className="text-[16px] leading-[120%] font-[600] text-[#1E1E1E] mb-2 font-playfair">{type.name}</h3>
            <p className="text-[12px] leading-[140%] font-[400] text-[#626060] font-playfair">{type.desc}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {reportTypes.slice(3, 6).map((type) => (
          <button
            key={type.id}
            onClick={() => setReportType(type.id)}
            className={`p-6 rounded-xl border-2 transition-all ${
              reportType === type.id
                ? 'border-[#7C3AED] bg-[#F5F3FF]'
                : 'border-gray-200 bg-white hover:border-[#7C3AED]'
            }`}
          >
            <div className="text-[24px] mb-3">
              {type.id === 'ministry' && '🏛️'}
              {type.id === 'admin' && '👥'}
              {type.id === 'exam' && '📝'}
            </div>
            <h3 className="text-[16px] leading-[120%] font-[600] text-[#1E1E1E] mb-2 font-playfair">{type.name}</h3>
            <p className="text-[12px] leading-[140%] font-[400] text-[#626060] font-playfair">{type.desc}</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
        <h2 className="text-[18px] leading-[120%] font-[600] text-[#1E1E1E] mb-6 font-playfair">Report Configuration</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div>
            <label className="block text-[13px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
            >
              {dateRanges.map(range => (
                <option key={range.id} value={range.id}>{range.name}</option>
              ))}
            </select>
          </div>

          {reportType === 'school' && (
            <div>
              <label className="block text-[13px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">Select School</label>
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
              >
                <option value="all">All Schools</option>
                {schools.map(school => (
                  <option key={school.id} value={school.id}>{school.name}</option>
                ))}
              </select>
            </div>
          )}

          {reportType === 'student' && (
            <div>
              <label className="block text-[13px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
              >
                <option value="all">All Classes</option>
                <option value="JSS1">JSS 1</option>
                <option value="JSS2">JSS 2</option>
                <option value="JSS3">JSS 3</option>
                <option value="SS1">SS 1</option>
                <option value="SS2">SS 2</option>
                <option value="SS3">SS 3</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-[13px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">Export Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
            >
              <option value="csv">CSV (Excel Compatible)</option>
              <option value="json">JSON</option>
              <option value="excel">Excel (XLSX)</option>
            </select>
          </div>
        </div>

        <div className="bg-[#F5F3FF] rounded-lg p-4 mb-6">
          <h3 className="text-[14px] leading-[100%] font-[600] text-[#7C3AED] mb-3 font-playfair">Report Preview</h3>
          <div className="text-[12px] leading-[140%] font-[400] text-[#626060] font-playfair">
            <p>• Report Type: {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</p>
            <p>• Date Range: {dateRange === 'today' ? 'Today' : dateRange === 'week' ? 'This Week' : dateRange === 'month' ? 'This Month' : dateRange === 'quarter' ? 'This Quarter' : 'This Year'}</p>
            {selectedSchool !== 'all' && <p>• School: {schools.find(s => s.id === selectedSchool)?.name || 'Selected School'}</p>}
            {selectedClass !== 'all' && <p>• Class: {selectedClass}</p>}
            <p>• Format: {format.toUpperCase()}</p>
            <p>• Estimated Rows: {reportType === 'school' ? schools.length : reportType === 'student' ? '50' : reportType === 'ministry' ? '4' : '5'}</p>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => {
              setReportType('school');
              setDateRange('month');
              setSelectedSchool('all');
              setSelectedClass('all');
              setFormat('csv');
            }}
            className="px-6 py-3 bg-white text-[#7C3AED] border border-[#7C3AED] rounded-lg hover:bg-[#F5F3FF] transition-colors font-playfair text-[14px] leading-[100%] font-[600]"
          >
            Reset Filters
          </button>
          <button
            onClick={handleGenerateReport}
            disabled={generating}
            className={`px-8 py-3 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors font-playfair text-[14px] leading-[100%] font-[600] ${generating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {generating ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-[16px] leading-[120%] font-[600] text-[#1E1E1E] mb-4 font-playfair">Recent Reports</h3>
          <div className="space-y-3">
            {[
              { name: 'Monthly School Performance Report', date: '2024-01-15', size: '2.4 MB', type: 'CSV' },
              { name: 'Student Enrollment Statistics', date: '2024-01-14', size: '1.8 MB', type: 'CSV' },
              { name: 'Exam Results Analysis - Q4 2023', date: '2024-01-10', size: '3.2 MB', type: 'JSON' },
              { name: 'Ministry Quarterly Report', date: '2024-01-05', size: '4.1 MB', type: 'CSV' },
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-[20px]">📄</span>
                  <div>
                    <p className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">{report.name}</p>
                    <p className="text-[10px] leading-[100%] font-[400] text-[#626060] mt-1 font-playfair">{report.date} • {report.size}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-gray-100 rounded text-[10px] leading-[100%] font-[500] text-[#626060] font-playfair">
                    {report.type}
                  </span>
                  <button className="text-[#7C3AED] text-[12px] hover:underline">Download</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-[16px] leading-[120%] font-[600] text-[#1E1E1E] mb-4 font-playfair">Scheduled Reports</h3>
          <div className="space-y-3">
            {[
              { name: 'Weekly School Summary', frequency: 'Every Monday', nextRun: '2024-01-22' },
              { name: 'Monthly Ministry Report', frequency: '1st of each month', nextRun: '2024-02-01' },
              { name: 'Quarterly Performance Review', frequency: 'Every quarter', nextRun: '2024-04-01' },
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div>
                  <p className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">{report.name}</p>
                  <p className="text-[10px] leading-[100%] font-[400] text-[#626060] mt-1 font-playfair">{report.frequency} • Next: {report.nextRun}</p>
                </div>
                <button className="text-[#7C3AED] text-[12px] hover:underline">Edit</button>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-[#7C3AED] hover:bg-[#F5F3FF] transition-colors font-playfair text-[13px] leading-[100%] font-[600]">
            + Schedule New Report
          </button>
        </div>
      </div>
    </div>
  );
}