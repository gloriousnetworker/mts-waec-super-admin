'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  examsContainer,
  examsHeader,
  examsTitle,
  examsSubtitle,
  homeStatsGrid,
  homeStatCard,
  homeStatCardTop,
  homeStatCardIcon,
  homeStatCardValue,
  homeStatCardLabel,
  homeContentGrid,
  homeCard,
  homeCardTitle,
  superAdminStatsGrid,
  superAdminStatCard,
  superAdminStatCardTop,
  superAdminStatIcon,
  superAdminStatValue,
  superAdminStatLabel,
  superAdminStatChange
} from '../../styles/styles';

export default function Analytics({ setActiveSection }) {
  const [timeframe, setTimeframe] = useState('month');
  const [analytics, setAnalytics] = useState({
    totalStudents: 15234,
    totalSchools: 156,
    totalAdmins: 312,
    totalExams: 45678,
    averageScore: 68,
    passRate: 72,
    activeUsers: 8923,
    newRegistrations: 1234,
    topPerformingSchools: [
      { name: 'Kogi State College of Education', score: 78, students: 1245, trend: '+5%' },
      { name: 'Government Secondary School, Lokoja', score: 76, students: 987, trend: '+3%' },
      { name: 'St. Theresa\'s College, Okene', score: 75, students: 876, trend: '+4%' },
      { name: 'Federal Government College, Ankpa', score: 74, students: 934, trend: '+2%' },
      { name: 'Community Secondary School, Idah', score: 73, students: 789, trend: '+6%' },
    ],
    subjectPerformance: [
      { subject: 'Mathematics', average: 71, students: 12450, trend: '+2%' },
      { subject: 'English', average: 68, students: 15234, trend: '+1%' },
      { subject: 'Physics', average: 65, students: 8765, trend: '-1%' },
      { subject: 'Chemistry', average: 67, students: 8234, trend: '+3%' },
      { subject: 'Biology', average: 70, students: 9123, trend: '+4%' },
      { subject: 'Economics', average: 66, students: 7890, trend: '0%' },
    ],
    monthlyTrends: [
      { month: 'Jan', students: 14234, exams: 41234, passRate: 70 },
      { month: 'Feb', students: 14567, exams: 42345, passRate: 71 },
      { month: 'Mar', students: 14890, exams: 43456, passRate: 71 },
      { month: 'Apr', students: 15123, exams: 44567, passRate: 72 },
      { month: 'May', students: 15234, exams: 45678, passRate: 72 },
    ],
    lgaBreakdown: [
      { lga: 'Kogi East', schools: 42, students: 5234, passRate: 71, average: 67 },
      { lga: 'Kogi Central', schools: 38, students: 4876, passRate: 69, average: 66 },
      { lga: 'Kogi West', schools: 40, students: 5124, passRate: 73, average: 69 },
    ]
  });

  const timeframes = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' },
    { id: 'year', label: 'This Year' },
  ];

  return (
    <div className={examsContainer}>
      <div className={examsHeader}>
        <h1 className={examsTitle}>Advanced Analytics</h1>
        <p className={examsSubtitle}>Comprehensive insights and performance metrics across Kogi State</p>
      </div>

      <div className="flex justify-end mb-6">
        <div className="flex gap-2 bg-white rounded-lg border border-gray-200 p-1">
          {timeframes.map((tf) => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id)}
              className={`px-4 py-2 rounded-md text-[12px] leading-[100%] font-[500] transition-all font-playfair ${
                timeframe === tf.id
                  ? 'bg-[#7C3AED] text-white'
                  : 'text-[#626060] hover:bg-gray-100'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      <div className={superAdminStatsGrid}>
        {[
          { label: 'Total Students', value: analytics.totalStudents.toLocaleString(), icon: '🧑‍🎓', change: '+8.2%' },
          { label: 'Active Users', value: analytics.activeUsers.toLocaleString(), icon: '⚡', change: '+5.4%' },
          { label: 'New Registrations', value: analytics.newRegistrations.toLocaleString(), icon: '📈', change: '+12.3%' },
          { label: 'Total Exams', value: analytics.totalExams.toLocaleString(), icon: '📚', change: '+15.7%' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className={superAdminStatCard}
          >
            <div className={superAdminStatCardTop}>
              <span className={superAdminStatIcon}>{stat.icon}</span>
              <span className={superAdminStatValue}>{stat.value}</span>
            </div>
            <p className={superAdminStatLabel}>{stat.label}</p>
            <p className={superAdminStatChange}>{stat.change}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className={homeCard}>
          <h2 className={homeCardTitle}>Performance Overview</h2>
          <div className="space-y-4">
            <div className="p-4 bg-[#F5F3FF] rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[14px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair">Average Score</span>
                <span className="text-[20px] leading-[100%] font-[700] text-[#7C3AED] font-playfair">{analytics.averageScore}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#7C3AED] w-[68%]" />
              </div>
            </div>

            <div className="p-4 bg-[#F5F3FF] rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[14px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair">Pass Rate</span>
                <span className="text-[20px] leading-[100%] font-[700] text-[#7C3AED] font-playfair">{analytics.passRate}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#7C3AED] w-[72%]" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="text-[24px] leading-[100%] font-[700] text-[#1E1E1E] font-playfair">156</div>
                <div className="text-[11px] leading-[100%] font-[400] text-[#626060] font-playfair mt-1">Schools</div>
              </div>
              <div className="text-center">
                <div className="text-[24px] leading-[100%] font-[700] text-[#1E1E1E] font-playfair">312</div>
                <div className="text-[11px] leading-[100%] font-[400] text-[#626060] font-playfair mt-1">Admins</div>
              </div>
              <div className="text-center">
                <div className="text-[24px] leading-[100%] font-[700] text-[#1E1E1E] font-playfair">15.2k</div>
                <div className="text-[11px] leading-[100%] font-[400] text-[#626060] font-playfair mt-1">Students</div>
              </div>
            </div>
          </div>
        </div>

        <div className={homeCard}>
          <h2 className={homeCardTitle}>Monthly Trends</h2>
          <div className="space-y-3">
            {analytics.monthlyTrends.map((month, index) => (
              <div key={index} className="p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[13px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair">{month.month}</span>
                  <span className="text-[13px] leading-[100%] font-[600] text-[#7C3AED] font-playfair">{month.passRate}%</span>
                </div>
                <div className="flex justify-between text-[11px] leading-[100%] font-[400] text-[#626060] font-playfair mb-2">
                  <span>{month.students.toLocaleString()} students</span>
                  <span>{month.exams.toLocaleString()} exams</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#7C3AED]"
                    style={{ width: `${month.passRate}%` }}
                  />
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
                  <span className="w-6 h-6 rounded-full bg-[#7C3AED] text-white text-[11px] leading-[100%] font-[600] flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">{school.name}</p>
                    <p className="text-[10px] leading-[100%] font-[400] text-[#626060] mt-1 font-playfair">{school.students} students</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[14px] leading-[100%] font-[600] text-[#7C3AED] font-playfair">{school.score}%</span>
                  <p className="text-[9px] leading-[100%] font-[400] text-[#10B981] mt-1 font-playfair">{school.trend}</p>
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
                  <span className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">{subject.subject}</span>
                  <span className="text-[13px] leading-[100%] font-[600] text-[#7C3AED] font-playfair">{subject.average}%</span>
                </div>
                <div className="flex justify-between text-[10px] leading-[100%] font-[400] text-[#626060] font-playfair mb-2">
                  <span>{subject.students.toLocaleString()} students</span>
                  <span className={subject.trend.startsWith('+') ? 'text-[#10B981]' : subject.trend.startsWith('-') ? 'text-[#DC2626]' : 'text-[#626060]'}>
                    {subject.trend}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#7C3AED]"
                    style={{ width: `${subject.average}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={homeCard}>
        <h2 className={homeCardTitle}>Local Government Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analytics.lgaBreakdown.map((lga, index) => (
            <div key={index} className="p-4 bg-[#F5F3FF] rounded-lg">
              <h3 className="text-[16px] leading-[120%] font-[600] text-[#1E1E1E] mb-3 font-playfair">{lga.lga}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[11px] leading-[100%] font-[400] text-[#626060] font-playfair">Schools</span>
                  <span className="text-[13px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair">{lga.schools}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px] leading-[100%] font-[400] text-[#626060] font-playfair">Students</span>
                  <span className="text-[13px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair">{lga.students.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px] leading-[100%] font-[400] text-[#626060] font-playfair">Pass Rate</span>
                  <span className="text-[13px] leading-[100%] font-[600] text-[#7C3AED] font-playfair">{lga.passRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px] leading-[100%] font-[400] text-[#626060] font-playfair">Average</span>
                  <span className="text-[13px] leading-[100%] font-[600] text-[#7C3AED] font-playfair">{lga.average}%</span>
                </div>
                <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#7C3AED]"
                    style={{ width: `${lga.passRate}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setActiveSection('reports')}
          className="px-6 py-3 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors font-playfair text-[14px] leading-[100%] font-[600]"
        >
          Generate Detailed Report
        </button>
      </div>
    </div>
  );
}