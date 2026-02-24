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
  const { user, fetchWithAuth } = useSuperAdminAuth();
  const [stats, setStats] = useState({
    totalSchools: 0,
    activeSchools: 0,
    totalAdmins: 0,
    totalStudents: 0,
    totalExams: 0,
    openTickets: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetchWithAuth('/super-admin/dashboard/stats');
      const data = await response.json();
      setStats({
        totalSchools: 0,
        activeSchools: 0,
        totalAdmins: 0,
        totalStudents: 0,
        totalExams: 0,
        openTickets: 0,
        totalRevenue: 0,
        ...(data.stats || {})
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { title: 'Add New School', icon: '🏫', color: 'border-[#7C3AED] text-[#7C3AED] hover:bg-[#F5F3FF]', action: () => setActiveSection('schools') },
    { title: 'Create Admin', icon: '👤', color: 'border-[#10B981] text-[#10B981] hover:bg-[#D1FAE5]', action: () => setActiveSection('admins') },
    { title: 'Generate Report', icon: '📊', color: 'border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#EDE9FE]', action: () => setActiveSection('reports') },
    { title: 'View Analytics', icon: '📈', color: 'border-[#F59E0B] text-[#F59E0B] hover:bg-[#FEF3C7]', action: () => setActiveSection('analytics') },
  ];

  const safeLocale = (val) => (Number(val) || 0).toLocaleString();

  return (
    <div className={homeContainer}>
      <div className={homeHeader}>
        <h1 className={homeTitle}>
          Welcome back, {user?.name || 'Super Admin'}! 👋
        </h1>
        <p className={homeSubtitle}>
          {stats.totalSchools} schools • {stats.totalAdmins} admins • {safeLocale(stats.totalStudents)} students across Kogi State
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Schools', value: stats.totalSchools, icon: '🏫' },
          { label: 'Active Schools', value: stats.activeSchools, icon: '✅' },
          { label: 'Total Admins', value: stats.totalAdmins, icon: '👥' },
          { label: 'Total Students', value: safeLocale(stats.totalStudents), icon: '🧑‍🎓' },
          { label: 'Exams Taken', value: safeLocale(stats.totalExams), icon: '📚' },
          { label: 'Open Tickets', value: stats.openTickets, icon: '🎫' },
          { label: 'Total Revenue', value: `₦${safeLocale(stats.totalRevenue)}`, icon: '💰' },
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
          <h2 className={homeCardTitle}>Quick Access</h2>
          <div className={homeSubjectGrid}>
            <button onClick={() => setActiveSection('schools')} className={homeSubjectButton}>
              <div className={homeSubjectInner}>
                <span className={homeSubjectIcon}>🏫</span>
                <div>
                  <div className={homeSubjectName}>Schools Management</div>
                  <div className={homeSubjectCount}>Add new schools</div>
                </div>
              </div>
            </button>
            <button onClick={() => setActiveSection('admins')} className={homeSubjectButton}>
              <div className={homeSubjectInner}>
                <span className={homeSubjectIcon}>👤</span>
                <div>
                  <div className={homeSubjectName}>Admin Management</div>
                  <div className={homeSubjectCount}>Create school admins</div>
                </div>
              </div>
            </button>
            <button onClick={() => setActiveSection('support')} className={homeSubjectButton}>
              <div className={homeSubjectInner}>
                <span className={homeSubjectIcon}>🎫</span>
                <div>
                  <div className={homeSubjectName}>Support Tickets</div>
                  <div className={homeSubjectCount}>{stats.openTickets} pending</div>
                </div>
              </div>
            </button>
            <button onClick={() => setActiveSection('analytics')} className={homeSubjectButton}>
              <div className={homeSubjectInner}>
                <span className={homeSubjectIcon}>📊</span>
                <div>
                  <div className={homeSubjectName}>Analytics</div>
                  <div className={homeSubjectCount}>View insights</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className={homeCard}>
          <h2 className={homeCardTitle}>Revenue Overview</h2>
          <div className="space-y-4">
            <div className="p-4 bg-[#F5F3FF] rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[14px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair">Monthly</span>
                <span className="text-[14px] leading-[100%] font-[600] text-[#7C3AED] font-playfair">₦15,000</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#7C3AED] w-[100%]" />
              </div>
            </div>
            <div className="p-4 bg-[#F5F3FF] rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[14px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair">Termly</span>
                <span className="text-[14px] leading-[100%] font-[600] text-[#7C3AED] font-playfair">₦42,000</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#7C3AED] w-[100%]" />
              </div>
            </div>
            <div className="p-4 bg-[#F5F3FF] rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[14px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair">Yearly</span>
                <span className="text-[14px] leading-[100%] font-[600] text-[#7C3AED] font-playfair">₦120,000</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#7C3AED] w-[100%]" />
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-[14px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair">Total Revenue</span>
                <span className="text-[20px] leading-[100%] font-[700] text-[#7C3AED] font-playfair">
                  ₦{safeLocale(stats.totalRevenue)}
                </span>
              </div>
            </div>
          </div>
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
            <button onClick={() => setActiveSection('reports')} className={homeBannerButtonPrimary}>
              Generate Report
            </button>
            <button onClick={() => window.open('mailto:ministry@kogiedu.gov.ng')} className={homeBannerButtonSecondary}>
              Contact Ministry
            </button>
          </div>
        </div>

        <div className={homeBannerStats}>
          <div className={homeBannerStatItem}>
            <div className={homeBannerStatValue}>{stats.totalSchools}</div>
            <div className={homeBannerStatLabel}>Schools</div>
          </div>
          <div className={homeBannerStatItem}>
            <div className={homeBannerStatValue}>{stats.totalAdmins}</div>
            <div className={homeBannerStatLabel}>Admins</div>
          </div>
          <div className={homeBannerStatItem}>
            <div className={homeBannerStatValue}>{safeLocale(stats.totalStudents)}</div>
            <div className={homeBannerStatLabel}>Students</div>
          </div>
          <div className={homeBannerStatItem}>
            <div className={homeBannerStatValue}>{safeLocale(stats.totalExams)}</div>
            <div className={homeBannerStatLabel}>Exams</div>
          </div>
        </div>
      </div>
    </div>
  );
}