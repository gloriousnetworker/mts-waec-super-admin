// components/dashboard-content/Reports.jsx
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSuperAdminAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  examsContainer,
  examsHeader,
  examsTitle,
  examsSubtitle,
  homeCard,
  homeCardTitle
} from '../../styles/styles';

export default function Reports() {
  const { fetchWithAuth } = useSuperAdminAuth();
  const [reportType, setReportType] = useState('school');
  const [dateRange, setDateRange] = useState('month');
  const [format, setFormat] = useState('json');
  const [generating, setGenerating] = useState(false);
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [recentReports, setRecentReports] = useState([]);

  useEffect(() => {
    fetchSchools();
    loadRecentReports();
  }, []);

  const fetchSchools = async () => {
    try {
      const response = await fetchWithAuth('/super-admin/schools');
      if (response.ok) {
        const data = await response.json();
        setSchools(data.schools || []);
      }
    } catch (error) {
      console.error('Failed to fetch schools:', error);
    }
  };

  const loadRecentReports = () => {
    const saved = localStorage.getItem('recentReports');
    if (saved) {
      setRecentReports(JSON.parse(saved));
    }
  };

  const saveRecentReport = (report) => {
    const updated = [report, ...recentReports].slice(0, 5);
    setRecentReports(updated);
    localStorage.setItem('recentReports', JSON.stringify(updated));
  };

  const convertToCSV = (jsonData) => {
    if (!jsonData.schools || !jsonData.schools.length) return '';
    
    const headers = ['Name', 'Address', 'Phone', 'Email', 'Status', 'Students', 'Admins', 'Created'];
    const rows = jsonData.schools.map(school => [
      school.name,
      school.address,
      school.phone,
      school.email,
      school.status,
      school.studentCount || 0,
      school.adminCount || 0,
      school.createdAt ? new Date(school.createdAt._seconds * 1000).toLocaleDateString() : 'N/A'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    return csvContent;
  };

  const convertToHTML = (jsonData) => {
    if (!jsonData.schools) return '';
    
    const reportDate = new Date().toLocaleDateString();
    const reportTitle = jsonData.type || `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`;
    
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${reportTitle}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #7C3AED; }
          .header { margin-bottom: 30px; }
          .date { color: #666; font-size: 14px; }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          th { background-color: #7C3AED; color: white; padding: 12px; text-align: left; }
          td { padding: 10px; border-bottom: 1px solid #ddd; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .summary { background-color: #F5F3FF; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${reportTitle}</h1>
          <p class="date">Generated: ${reportDate}</p>
          <p class="date">Generated At: ${jsonData.generatedAt ? new Date(jsonData.generatedAt).toLocaleString() : reportDate}</p>
        </div>
    `;
    
    if (jsonData.schools && jsonData.schools.length > 0) {
      const totalStudents = jsonData.schools.reduce((sum, s) => sum + (s.studentCount || 0), 0);
      const totalAdmins = jsonData.schools.reduce((sum, s) => sum + (s.adminCount || 0), 0);
      
      html += `
        <div class="summary">
          <h3>Summary</h3>
          <p>Total Schools: ${jsonData.schools.length}</p>
          <p>Total Students: ${totalStudents}</p>
          <p>Total Admins: ${totalAdmins}</p>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>School Name</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Status</th>
              <th>Students</th>
              <th>Admins</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
      `;
      
      jsonData.schools.forEach(school => {
        const createdDate = school.createdAt ? new Date(school.createdAt._seconds * 1000).toLocaleDateString() : 'N/A';
        html += `
          <tr>
            <td>${school.name}</td>
            <td>${school.address || 'N/A'}</td>
            <td>${school.phone || 'N/A'}</td>
            <td>${school.email || 'N/A'}</td>
            <td>${school.status || 'N/A'}</td>
            <td>${school.studentCount || 0}</td>
            <td>${school.adminCount || 0}</td>
            <td>${createdDate}</td>
          </tr>
        `;
      });
      
      html += `
          </tbody>
        </table>
      `;
    }
    
    html += '</body></html>';
    return html;
  };

  const downloadFile = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadPDF = (html) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.onafterprint = () => printWindow.close();
  };

  const downloadWord = (html, fileName) => {
    const blob = new Blob([html], { type: 'application/msword' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleGenerateReport = async () => {
    setGenerating(true);
    const toastId = toast.loading('Generating report...');

    try {
      const requestBody = {
        type: reportType,
        format: 'json'
      };

      const response = await fetchWithAuth('/super-admin/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const data = await response.json();
      const fileName = `${reportType}-report-${new Date().toISOString().split('T')[0]}`;

      switch (format) {
        case 'json':
          const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const jsonUrl = window.URL.createObjectURL(jsonBlob);
          const jsonA = document.createElement('a');
          jsonA.href = jsonUrl;
          jsonA.download = `${fileName}.json`;
          jsonA.click();
          window.URL.revokeObjectURL(jsonUrl);
          break;
          
        case 'csv':
          const csvContent = convertToCSV(data);
          downloadFile(csvContent, `${fileName}.csv`, 'text/csv');
          break;
          
        case 'pdf':
          const pdfHtml = convertToHTML(data);
          downloadPDF(pdfHtml);
          break;
          
        case 'word':
          const wordHtml = convertToHTML(data);
          downloadWord(wordHtml, `${fileName}.doc`);
          break;
          
        default:
          break;
      }

      saveRecentReport({
        id: Date.now(),
        name: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
        date: new Date().toISOString().split('T')[0],
        type: reportType,
        format: format
      });

      toast.success('Report generated successfully!', { id: toastId });
    } catch (error) {
      toast.error('Failed to generate report', { id: toastId });
    } finally {
      setGenerating(false);
    }
  };

  const reportTypes = [
    { id: 'school', name: 'School Report', icon: '🏫', desc: 'Detailed information about schools with student and admin counts' },
    { id: 'admin', name: 'Admin Report', icon: '👥', desc: 'Admin activity and metrics across schools' },
    { id: 'student', name: 'Student Report', icon: '🧑‍🎓', desc: 'Student performance and enrollment data' },
    { id: 'performance', name: 'Performance Analytics', icon: '📊', desc: 'Academic performance metrics and analysis' },
    { id: 'revenue', name: 'Revenue Report', icon: '💰', desc: 'Subscription and payment analytics' },
    { id: 'ministry', name: 'Ministry Report', icon: '🏛️', desc: 'State-wide education statistics for ministry submission' }
  ];

  const dateRanges = [
    { id: 'today', name: 'Today' },
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' },
    { id: 'quarter', name: 'This Quarter' },
    { id: 'year', name: 'This Year' }
  ];

  return (
    <div className={examsContainer}>
      <div className={examsHeader}>
        <h1 className={examsTitle}>Report Generation</h1>
        <p className={examsSubtitle}>Generate comprehensive reports for analysis and ministry submissions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {reportTypes.slice(0, 3).map((type) => (
          <button
            key={type.id}
            onClick={() => setReportType(type.id)}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              reportType === type.id
                ? 'border-[#7C3AED] bg-[#F5F3FF]'
                : 'border-gray-200 bg-white hover:border-[#7C3AED]'
            }`}
          >
            <div className="text-[24px] mb-3">{type.icon}</div>
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
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              reportType === type.id
                ? 'border-[#7C3AED] bg-[#F5F3FF]'
                : 'border-gray-200 bg-white hover:border-[#7C3AED]'
            }`}
          >
            <div className="text-[24px] mb-3">{type.icon}</div>
            <h3 className="text-[16px] leading-[120%] font-[600] text-[#1E1E1E] mb-2 font-playfair">{type.name}</h3>
            <p className="text-[12px] leading-[140%] font-[400] text-[#626060] font-playfair">{type.desc}</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
        <h2 className="text-[18px] leading-[120%] font-[600] text-[#1E1E1E] mb-6 font-playfair">Report Configuration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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

          <div>
            <label className="block text-[13px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">Export Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
            >
              <option value="json">JSON (Raw Data)</option>
              <option value="csv">CSV (Excel Compatible)</option>
              <option value="pdf">PDF Document</option>
              <option value="word">Word Document</option>
            </select>
          </div>
        </div>

        <div className="bg-[#F5F3FF] rounded-lg p-4 mb-6">
          <h3 className="text-[14px] leading-[100%] font-[600] text-[#7C3AED] mb-3 font-playfair">Report Summary</h3>
          <div className="text-[12px] leading-[140%] font-[400] text-[#626060] font-playfair">
            <p>• Report Type: {reportTypes.find(t => t.id === reportType)?.name || reportType}</p>
            <p>• Date Range: {dateRanges.find(r => r.id === dateRange)?.name || dateRange}</p>
            {reportType === 'school' && selectedSchool !== 'all' && <p>• School: {schools.find(s => s.id === selectedSchool)?.name}</p>}
            <p>• Format: {format.toUpperCase()}</p>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => {
              setReportType('school');
              setDateRange('month');
              setSelectedSchool('all');
              setFormat('json');
            }}
            className="px-6 py-3 bg-white text-[#7C3AED] border border-[#7C3AED] rounded-lg hover:bg-[#F5F3FF] transition-colors font-playfair text-[14px] leading-[100%] font-[600]"
          >
            Reset Filters
          </button>
          <button
            onClick={handleGenerateReport}
            disabled={generating}
            className={`px-8 py-3 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors font-playfair text-[14px] leading-[100%] font-[600] ${
              generating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {generating ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={homeCard}>
          <h3 className={homeCardTitle}>Recent Reports</h3>
          <div className="space-y-3">
            {recentReports.length > 0 ? (
              recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-[20px]">📄</span>
                    <div>
                      <p className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">{report.name}</p>
                      <p className="text-[10px] leading-[100%] font-[400] text-[#626060] mt-1 font-playfair">{report.date} • {report.format.toUpperCase()}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[13px] text-[#626060] text-center py-4">No reports generated yet</p>
            )}
          </div>
        </div>

        <div className={homeCard}>
          <h3 className={homeCardTitle}>Quick Links</h3>
          <div className="space-y-3">
            <button 
              onClick={() => setReportType('performance')}
              className="w-full p-4 bg-[#F5F3FF] rounded-lg text-left hover:bg-[#EDE9FE] transition-colors"
            >
              <p className="text-[14px] leading-[100%] font-[600] text-[#7C3AED] mb-2 font-playfair">📊 Performance Analytics</p>
              <p className="text-[11px] leading-[140%] font-[400] text-[#626060] font-playfair">View detailed performance metrics across all schools</p>
            </button>
            <button 
              onClick={() => setReportType('revenue')}
              className="w-full p-4 bg-[#F5F3FF] rounded-lg text-left hover:bg-[#EDE9FE] transition-colors"
            >
              <p className="text-[14px] leading-[100%] font-[600] text-[#7C3AED] mb-2 font-playfair">💰 Revenue Summary</p>
              <p className="text-[11px] leading-[140%] font-[400] text-[#626060] font-playfair">Check subscription revenue and payment analytics</p>
            </button>
            <button 
              onClick={() => setReportType('student')}
              className="w-full p-4 bg-[#F5F3FF] rounded-lg text-left hover:bg-[#EDE9FE] transition-colors"
            >
              <p className="text-[14px] leading-[100%] font-[600] text-[#7C3AED] mb-2 font-playfair">📚 Student Enrollment</p>
              <p className="text-[11px] leading-[140%] font-[400] text-[#626060] font-playfair">Track student enrollment trends across the state</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}