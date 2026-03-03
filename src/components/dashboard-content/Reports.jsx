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
  homeCardTitle,
  modalButtonSecondary
} from '../../styles/styles';

export default function Reports() {
  const { fetchWithAuth } = useSuperAdminAuth();
  const [reportType, setReportType] = useState('school');
  const [dateRange, setDateRange] = useState('month');
  const [format, setFormat] = useState('csv');
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

  const handleGenerateReport = async () => {
    setGenerating(true);
    const toastId = toast.loading('Generating report...');

    try {
      const dates = {};
      if (dateRange === 'custom' && startDate && endDate) {
        dates.startDate = startDate;
        dates.endDate = endDate;
      }

      const response = await fetchWithAuth('/super-admin/reports/generate', {
        method: 'POST',
        body: JSON.stringify({
          type: reportType,
          format,
          ...dates,
          ...(selectedSchool !== 'all' && { schoolId: selectedSchool })
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const data = await response.json();
      
      if (format === 'csv') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      }

      saveRecentReport({
        id: Date.now(),
        name: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
        date: new Date().toISOString().split('T')[0],
        type: reportType,
        format
      });

      toast.success('Report generated successfully!', { id: toastId });
    } catch (error) {
      toast.error('Failed to generate report', { id: toastId });
    } finally {
      setGenerating(false);
    }
  };

  const reportTypes = [
    { id: 'school', name: 'School Report', icon: '🏫', desc: 'Detailed information about schools' },
    { id: 'admin', name: 'Admin Report', icon: '👥', desc: 'Admin activity and metrics' },
    { id: 'student', name: 'Student Report', icon: '🧑‍🎓', desc: 'Student performance and activity' },
    { id: 'performance', name: 'Performance Analytics', icon: '📊', desc: 'Academic performance metrics' },
    { id: 'revenue', name: 'Revenue Report', icon: '💰', desc: 'Subscription and payment analytics' },
    { id: 'ministry', name: 'Ministry Report', icon: '🏛️', desc: 'State-wide education statistics' }
  ];

  const dateRanges = [
    { id: 'today', name: 'Today' },
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' },
    { id: 'quarter', name: 'This Quarter' },
    { id: 'year', name: 'This Year' },
    { id: 'custom', name: 'Custom Range' }
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
            className={`p-6 rounded-xl border-2 transition-all ${
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
            className={`p-6 rounded-xl border-2 transition-all ${
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

          <div>
            <label className="block text-[13px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">Export Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
            >
              <option value="csv">CSV (Excel Compatible)</option>
              <option value="json">JSON</option>
            </select>
          </div>
        </div>

        {dateRange === 'custom' && (
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[13px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
              />
            </div>
            <div>
              <label className="block text-[13px] leading-[100%] font-[500] text-[#1E1E1E] mb-2 font-playfair">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair"
              />
            </div>
          </div>
        )}

        <div className="bg-[#F5F3FF] rounded-lg p-4 mb-6">
          <h3 className="text-[14px] leading-[100%] font-[600] text-[#7C3AED] mb-3 font-playfair">Report Summary</h3>
          <div className="text-[12px] leading-[140%] font-[400] text-[#626060] font-playfair">
            <p>• Report Type: {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</p>
            <p>• Date Range: {dateRange === 'custom' ? `${startDate || 'Start'} to ${endDate || 'End'}` : dateRange}</p>
            {selectedSchool !== 'all' && <p>• School: {schools.find(s => s.id === selectedSchool)?.name}</p>}
            <p>• Format: {format.toUpperCase()}</p>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => {
              setReportType('school');
              setDateRange('month');
              setSelectedSchool('all');
              setFormat('csv');
              setStartDate('');
              setEndDate('');
            }}
            className="px-6 py-3 bg-white text-[#7C3AED] border border-[#7C3AED] rounded-lg hover:bg-[#F5F3FF] transition-colors font-playfair text-[14px] leading-[100%] font-[600]"
          >
            Reset Filters
          </button>
          <button
            onClick={handleGenerateReport}
            disabled={generating || (dateRange === 'custom' && (!startDate || !endDate))}
            className={`px-8 py-3 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors font-playfair text-[14px] leading-[100%] font-[600] ${
              generating || (dateRange === 'custom' && (!startDate || !endDate)) ? 'opacity-50 cursor-not-allowed' : ''
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
            <button className="w-full p-4 bg-[#F5F3FF] rounded-lg text-left hover:bg-[#EDE9FE] transition-colors">
              <p className="text-[14px] leading-[100%] font-[600] text-[#7C3AED] mb-2 font-playfair">📊 Performance Analytics</p>
              <p className="text-[11px] leading-[140%] font-[400] text-[#626060] font-playfair">View detailed performance metrics across all schools</p>
            </button>
            <button className="w-full p-4 bg-[#F5F3FF] rounded-lg text-left hover:bg-[#EDE9FE] transition-colors">
              <p className="text-[14px] leading-[100%] font-[600] text-[#7C3AED] mb-2 font-playfair">💰 Revenue Summary</p>
              <p className="text-[11px] leading-[140%] font-[400] text-[#626060] font-playfair">Check subscription revenue and payment analytics</p>
            </button>
            <button className="w-full p-4 bg-[#F5F3FF] rounded-lg text-left hover:bg-[#EDE9FE] transition-colors">
              <p className="text-[14px] leading-[100%] font-[600] text-[#7C3AED] mb-2 font-playfair">📚 Student Enrollment</p>
              <p className="text-[11px] leading-[140%] font-[400] text-[#626060] font-playfair">Track student enrollment trends across the state</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}