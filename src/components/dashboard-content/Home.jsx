'use client';

import { useSuperAdminAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  homeContainer,
  homeHeader,
  homeTitle,
  homeSubtitle,
  homeStatsGrid,
  homeStatCard,
  homeStatCardTop,
  homeStatCardIcon,
  homeStatCardValue,
  homeStatCardLabel,
  homeActionsGrid,
  homeActionButton,
  homeActionIcon,
  homeActionTitle,
  homeContentGrid,
  homeCard,
  homeCardTitle,
  homeActivityItem,
  homeActivityLeft,
  homeActivityIcon,
  homeActivitySubject,
  homeActivityTime,
  homeActivityContinue,
  homeSubjectGrid,
  homeSubjectButton,
  homeSubjectInner,
  homeSubjectIcon,
  homeSubjectName,
  homeSubjectCount,
  homeViewAllButton,
  homeBanner,
  homeBannerContent,
  homeBannerTitle,
  homeBannerText,
  homeBannerActions,
  homeBannerButtonPrimary,
  homeBannerButtonSecondary,
  homeBannerStats,
  homeBannerStatItem,
  homeBannerStatValue,
  homeBannerStatLabel
} from '../../styles/styles';

export default function SuperAdminHome({ setActiveSection }) {
  const { user } = useSuperAdminAuth();
  const [stats, setStats] = useState({
    totalSchools: 0,
    totalAdmins: 0,
    totalStudents: 0,
    activeToday: 0,
    pendingTickets: 0,
    totalExams: 0,
    avgPerformance: 0,
    passRate: 0
  });

  useEffect(() => {
    const schools = JSON.parse(localStorage.getItem('schools') || '[]');
    const admins = JSON.parse(localStorage.getItem('admins') || '[]');
    const students = JSON.parse(localStorage.getItem('all_students') || '[]');
    const tickets = JSON.parse(localStorage.getItem('support_tickets') || '[]');

    const active = students.filter(s => s.lastActive === new Date().toDateString()).length;
    const exams = students.reduce((acc, s) => acc + (s.examsTaken || 0), 0);
    const avg = students.reduce((acc, s) => acc + (s.avgScore || 0), 0) / (students.length || 1);
    const pass = students.filter(s => (s.avgScore || 0) >= 50).length;

    setStats({
      totalSchools: schools.length || 156,
      totalAdmins: admins.length || 312,
      totalStudents: students.length || 15234,
      activeToday: active || 8923,
      pendingTickets: tickets.filter(t => t.status !== 'closed').length || 23,
      totalExams: exams || 45678,
      avgPerformance: Math.round(avg) || 68,
      passRate: students.length ? Math.round((pass / students.length) * 100) : 72
    });
  }, []);

  const quickActions = [
    { title: 'Add New School', icon: '🏫', color: 'border-[#7C3AED] text-[#7C3AED] hover:bg-[#F5F3FF]', action: () => setActiveSection('schools') },
    { title: 'Create Admin', icon: '👤', color: 'border-[#10B981] text-[#10B981] hover:bg-[#D1FAE5]', action: () => setActiveSection('admins') },
    { title: 'Generate Report', icon: '📊', color: 'border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#EDE9FE]', action: () => setActiveSection('reports') },
    { title: 'View Analytics', icon: '📈', color: 'border-[#F59E0B] text-[#F59E0B] hover:bg-[#FEF3C7]', action: () => setActiveSection('analytics') },
  ];

  const recentActivities = [
    { action: 'New school registered', school: 'Kogi State College of Education', time: '10 mins ago', icon: '🏫' },
    { action: 'Admin account created', admin: 'Dr. Michael Adebayo', time: '25 mins ago', icon: '👤' },
    { action: 'Support ticket resolved', ticket: '#TKT045', time: '1 hour ago', icon: '✅' },
    { action: 'Monthly report generated', report: 'January 2024', time: '3 hours ago', icon: '📊' },
    { action: 'System update completed', version: 'v2.1.0', time: '5 hours ago', icon: '⚙️' },
  ];

  return (
    <div className={homeContainer}>
      <div className={homeHeader}>
        <h1 className={homeTitle}>
          Welcome back, {user?.name || 'Super Admin'}! 👋
        </h1>
        <p className={homeSubtitle}>
          {stats.totalSchools} schools • {stats.totalAdmins} admins • {stats.totalStudents.toLocaleString()} students across Kogi State
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Schools', value: stats.totalSchools, icon: '🏫', change: '+12 this month' },
          { label: 'Total Admins', value: stats.totalAdmins, icon: '👥', change: '+28 this month' },
          { label: 'Total Students', value: stats.totalStudents.toLocaleString(), icon: '🧑‍🎓', change: '+1,234 this month' },
          { label: 'Active Today', value: stats.activeToday.toLocaleString(), icon: '⚡', change: '78% engagement' },
          { label: 'Pending Tickets', value: stats.pendingTickets, icon: '🎫', change: '23 awaiting response' },
          { label: 'Exams Taken', value: stats.totalExams.toLocaleString(), icon: '📚', change: '+5,678 this week' },
          { label: 'Avg Performance', value: `${stats.avgPerformance}%`, icon: '📈', change: '+2.5% vs last month' },
          { label: 'Pass Rate', value: `${stats.passRate}%`, icon: '✅', change: 'State average' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className={homeStatCard}
          >
            <div className={homeStatCardTop}>
              <span className={homeStatCardIcon}>{stat.icon}</span>
              <span className={homeStatCardValue}>{stat.value}</span>
            </div>
            <p className={homeStatCardLabel}>{stat.label}</p>
            <p className="text-[10px] leading-[100%] font-[400] text-[#10B981] mt-1 font-playfair">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      <div className={homeActionsGrid}>
        {quickActions.map((action, index) => (
          <motion.button
            key={action.title}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.action}
            className={`${homeActionButton} ${action.color}`}
          >
            <div className={homeActionIcon}>{action.icon}</div>
            <h3 className={homeActionTitle}>{action.title}</h3>
          </motion.button>
        ))}
      </div>

      <div className={homeContentGrid}>
        <div className={homeCard}>
          <h2 className={homeCardTitle}>Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className={homeActivityItem}>
                <div className={homeActivityLeft}>
                  <div className={`${homeActivityIcon} bg-[#F5F3FF] text-[#7C3AED]`}>
                    {activity.icon}
                  </div>
                  <div>
                    <p className={homeActivitySubject}>
                      {activity.action}
                      {activity.school && <span className="font-[600]"> {activity.school}</span>}
                      {activity.admin && <span className="font-[600]"> {activity.admin}</span>}
                      {activity.ticket && <span className="font-[600]"> {activity.ticket}</span>}
                      {activity.report && <span className="font-[600]"> {activity.report}</span>}
                    </p>
                    <p className={homeActivityTime}>{activity.time}</p>
                  </div>
                </div>
                <button className={homeActivityContinue}>View →</button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setActiveSection('analytics')}
            className={homeViewAllButton}
          >
            View All Activity
          </button>
        </div>

        <div className={homeCard}>
          <h2 className={homeCardTitle}>State Overview</h2>
          <div className="space-y-4">
            <div className="p-4 bg-[#F5F3FF] rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[14px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair">Kogi East</span>
                <span className="text-[14px] leading-[100%] font-[600] text-[#7C3AED] font-playfair">5,234 students</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#7C3AED] w-[65%]" />
              </div>
              <p className="text-[11px] leading-[100%] font-[400] text-[#626060] mt-2 font-playfair">42 schools • 89 admins</p>
            </div>

            <div className="p-4 bg-[#F5F3FF] rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[14px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair">Kogi Central</span>
                <span className="text-[14px] leading-[100%] font-[600] text-[#7C3AED] font-playfair">4,876 students</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#7C3AED] w-[58%]" />
              </div>
              <p className="text-[11px] leading-[100%] font-[400] text-[#626060] mt-2 font-playfair">38 schools • 76 admins</p>
            </div>

            <div className="p-4 bg-[#F5F3FF] rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[14px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair">Kogi West</span>
                <span className="text-[14px] leading-[100%] font-[600] text-[#7C3AED] font-playfair">5,124 students</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#7C3AED] w-[62%]" />
              </div>
              <p className="text-[11px] leading-[100%] font-[400] text-[#626060] mt-2 font-playfair">40 schools • 82 admins</p>
            </div>
          </div>
          <button
            onClick={() => setActiveSection('analytics')}
            className={homeViewAllButton}
          >
            View Detailed Analytics
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={homeCard}>
          <h2 className={homeCardTitle}>Top Performing Schools</h2>
          <div className="space-y-3">
            {[
              { name: 'Kogi State College of Education', students: 1245, avgScore: 78, rank: 1 },
              { name: 'Government Secondary School, Lokoja', students: 987, avgScore: 76, rank: 2 },
              { name: 'St. Theresa\'s College, Okene', students: 876, avgScore: 75, rank: 3 },
              { name: 'Federal Government College, Ankpa', students: 934, avgScore: 74, rank: 4 },
              { name: 'Community Secondary School, Idah', students: 789, avgScore: 73, rank: 5 },
            ].map((school, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#7C3AED] text-white text-[11px] leading-[100%] font-[600] flex items-center justify-center">
                    {school.rank}
                  </span>
                  <div>
                    <p className="text-[13px] leading-[100%] font-[500] text-[#1E1E1E] font-playfair">{school.name}</p>
                    <p className="text-[10px] leading-[100%] font-[400] text-[#626060] mt-1 font-playfair">{school.students} students</p>
                  </div>
                </div>
                <span className="text-[14px] leading-[100%] font-[600] text-[#10B981] font-playfair">{school.avgScore}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className={homeCard}>
          <h2 className={homeCardTitle}>Support Ticket Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg">
              <div>
                <span className="text-[14px] leading-[100%] font-[600] text-[#F59E0B] font-playfair">Open</span>
                <p className="text-[11px] leading-[100%] font-[400] text-[#626060] mt-1 font-playfair">Awaiting response</p>
              </div>
              <span className="text-[20px] leading-[100%] font-[700] text-[#F59E0B] font-playfair">14</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
              <div>
                <span className="text-[14px] leading-[100%] font-[600] text-[#2563EB] font-playfair">In Progress</span>
                <p className="text-[11px] leading-[100%] font-[400] text-[#626060] mt-1 font-playfair">Being handled</p>
              </div>
              <span className="text-[20px] leading-[100%] font-[700] text-[#2563EB] font-playfair">7</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
              <div>
                <span className="text-[14px] leading-[100%] font-[600] text-[#10B981] font-playfair">Resolved Today</span>
                <p className="text-[11px] leading-[100%] font-[400] text-[#626060] mt-1 font-playfair">Closed in last 24h</p>
              </div>
              <span className="text-[20px] leading-[100%] font-[700] text-[#10B981] font-playfair">9</span>
            </div>
          </div>
          <button
            onClick={() => setActiveSection('support')}
            className={homeViewAllButton}
          >
            View All Tickets
          </button>
        </div>
      </div>

      <div className={homeBanner}>
        <div className={homeBannerContent}>
          <div>
            <h3 className={homeBannerTitle}>Kogi State Education Report 2024</h3>
            <p className={homeBannerText}>
              Generate comprehensive reports for the Ministry of Education with detailed analytics and insights.
            </p>
          </div>
          <div className={homeBannerActions}>
            <button
              onClick={() => setActiveSection('reports')}
              className={homeBannerButtonPrimary}
            >
              Generate Report
            </button>
            <button
              onClick={() => window.open('mailto:ministry@kogiedu.gov.ng')}
              className={homeBannerButtonSecondary}
            >
              Contact Ministry
            </button>
          </div>
        </div>
        
        <div className={homeBannerStats}>
          <div className={homeBannerStatItem}>
            <div className={homeBannerStatValue}>156</div>
            <div className={homeBannerStatLabel}>Schools</div>
          </div>
          <div className={homeBannerStatItem}>
            <div className={homeBannerStatValue}>312</div>
            <div className={homeBannerStatLabel}>Admins</div>
          </div>
          <div className={homeBannerStatItem}>
            <div className={homeBannerStatValue}>15.2k</div>
            <div className={homeBannerStatLabel}>Students</div>
          </div>
          <div className={homeBannerStatItem}>
            <div className={homeBannerStatValue}>72%</div>
            <div className={homeBannerStatLabel}>Pass Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}