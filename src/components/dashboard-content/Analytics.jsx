// components/dashboard-content/Analytics.jsx
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSuperAdminAuth } from '../../context/AuthContext';
import { GraduationCap, Zap, UserPlus, BookOpen } from 'lucide-react';
import {
  examsContainer,
  examsHeader,
  examsTitle,
  examsSubtitle,
  homeCard,
  homeCardTitle,
  superAdminStatCard,
  superAdminStatValue,
  superAdminStatLabel,
  superAdminStatChange
} from '../../styles/styles';

export default function Analytics() {
  const { fetchWithAuth } = useSuperAdminAuth();
  const [timeframe, setTimeframe] = useState('month');
  const [analytics, setAnalytics] = useState({
    totalStudents: 0,
    totalSchools: 0,
    totalAdmins: 0,
    totalExams: 0,
    averageScore: 0,
    passRate: 0,
    activeUsers: 0,
    newRegistrations: 0,
    topPerformingSchools: [],
    subjectPerformance: [],
    monthlyTrends: [],
    lgaBreakdown: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth('/super-admin/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        setAnalytics({
          totalStudents: data.stats?.totalStudents || 0,
          totalSchools: data.stats?.totalSchools || 0,
          totalAdmins: data.stats?.totalAdmins || 0,
          totalExams: data.stats?.totalExams || 0,
          averageScore: data.stats?.averageScore || 0,
          passRate: data.stats?.passRate || 0,
          activeUsers: data.stats?.activeUsers || 0,
          newRegistrations: data.stats?.newRegistrations || 0,
          topPerformingSchools: data.topSchools || [],
          subjectPerformance: data.subjectPerformance || [],
          monthlyTrends: data.monthlyTrends || [],
          lgaBreakdown: data.lgaBreakdown || []
        });
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const timeframes = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' },
    { id: 'year', label: 'This Year' }
  ];

  if (loading) {
    return (
      <div className={examsContainer}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className={examsContainer}>
      <div className={examsHeader}>
        <h1 className={examsTitle}>Advanced Analytics</h1>
        <p className={examsSubtitle}>Comprehensive insights and performance metrics across the platform</p>
      </div>

      <div className="flex justify-end mb-6">
        <div className="flex gap-2 bg-white rounded-lg border border-gray-200 p-1">
          {timeframes.map((tf) => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id)}
              className={`px-4 py-2 rounded-md text-[12px] leading-[100%] font-[500] transition-all ${
                timeframe === tf.id
                  ? 'bg-brand-primary text-white'
                  : 'text-[#626060] hover:bg-gray-100'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { Icon: GraduationCap, label: 'Total Students',    value: analytics.totalStudents.toLocaleString() },
          { Icon: Zap,           label: 'Active Users',      value: analytics.activeUsers.toLocaleString() },
          { Icon: UserPlus,      label: 'New Registrations', value: analytics.newRegistrations.toLocaleString() },
          { Icon: BookOpen,      label: 'Total Exams',       value: analytics.totalExams.toLocaleString() },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className={homeCard}>
          <h2 className={homeCardTitle}>Performance Overview</h2>
          <div className="space-y-4">
            <div className="p-4 bg-brand-primary-lt rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[14px] leading-[100%] font-[600] text-[#1E1E1E]">Average Score</span>
                <span className="text-[20px] leading-[100%] font-[700] text-brand-primary">{analytics.averageScore}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-brand-primary" style={{ width: `${analytics.averageScore}%` }} />
              </div>
            </div>

            <div className="p-4 bg-brand-primary-lt rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[14px] leading-[100%] font-[600] text-[#1E1E1E]">Pass Rate</span>
                <span className="text-[20px] leading-[100%] font-[700] text-brand-primary">{analytics.passRate}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-brand-primary" style={{ width: `${analytics.passRate}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="text-[24px] leading-[100%] font-[700] text-[#1E1E1E]">{analytics.totalSchools}</div>
                <div className="text-[11px] leading-[100%] font-[400] text-[#626060] mt-1">Schools</div>
              </div>
              <div className="text-center">
                <div className="text-[24px] leading-[100%] font-[700] text-[#1E1E1E]">{analytics.totalAdmins}</div>
                <div className="text-[11px] leading-[100%] font-[400] text-[#626060] mt-1">Admins</div>
              </div>
              <div className="text-center">
                <div className="text-[24px] leading-[100%] font-[700] text-[#1E1E1E]">{(analytics.totalStudents / 1000).toFixed(1)}k</div>
                <div className="text-[11px] leading-[100%] font-[400] text-[#626060] mt-1">Students</div>
              </div>
            </div>
          </div>
        </div>

        <div className={homeCard}>
          <h2 className={homeCardTitle}>Monthly Trends</h2>
          {analytics.monthlyTrends.length === 0 && (
            <p className="text-sm text-content-muted py-8 text-center">No trend data available</p>
          )}
          <div className="space-y-3">
            {analytics.monthlyTrends.map((month, index) => (
              <div key={index} className="p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[13px] leading-[100%] font-[600] text-[#1E1E1E]">{month.month}</span>
                  <span className="text-[13px] leading-[100%] font-[600] text-brand-primary">{month.passRate}%</span>
                </div>
                <div className="flex justify-between text-[11px] leading-[100%] font-[400] text-[#626060] mb-2">
                  <span>{month.students.toLocaleString()} students</span>
                  <span>{month.exams.toLocaleString()} exams</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-primary" style={{ width: `${month.passRate}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className={homeCard}>
          <h2 className={homeCardTitle}>Top Performing Schools</h2>
          <div className="space-y-3">
            {analytics.topPerformingSchools.map((school, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-primary text-white text-[11px] leading-[100%] font-[600] flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E]">{school.name}</p>
                    <p className="text-[10px] leading-[100%] font-[400] text-[#626060] mt-1">{school.students} students</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[14px] leading-[100%] font-[600] text-brand-primary">{school.score}%</span>
                  <p className="text-[9px] leading-[100%] font-[400] text-[#10B981] mt-1">{school.trend}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={homeCard}>
          <h2 className={homeCardTitle}>Subject Performance</h2>
          <div className="space-y-3">
            {analytics.subjectPerformance.map((subject, index) => (
              <div key={index} className="p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E]">{subject.subject}</span>
                  <span className="text-[13px] leading-[100%] font-[600] text-brand-primary">{subject.average}%</span>
                </div>
                <div className="flex justify-between text-[10px] leading-[100%] font-[400] text-[#626060] mb-2">
                  <span>{subject.students.toLocaleString()} students</span>
                  <span className={subject.trend.startsWith('+') ? 'text-[#10B981]' : subject.trend.startsWith('-') ? 'text-[#DC2626]' : 'text-[#626060]'}>
                    {subject.trend}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-primary" style={{ width: `${subject.average}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {analytics.lgaBreakdown.length > 0 && (
        <div className={homeCard}>
          <h2 className={homeCardTitle}>Regional Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analytics.lgaBreakdown.map((region, index) => (
              <div key={index} className="p-4 bg-brand-primary-lt rounded-xl">
                <h3 className="text-base font-semibold text-content-primary mb-3">{region.lga || region.region || region.name}</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Schools',   value: region.schools },
                    { label: 'Students',  value: (region.students || 0).toLocaleString() },
                    { label: 'Pass Rate', value: `${region.passRate || 0}%` },
                    { label: 'Average',   value: `${region.average || 0}%` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-xs text-content-muted">{label}</span>
                      <span className="text-sm font-semibold text-content-primary">{value}</span>
                    </div>
                  ))}
                  <div className="mt-2 h-1.5 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-brand-primary" style={{ width: `${region.passRate || 0}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}