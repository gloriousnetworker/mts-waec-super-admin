// components/dashboard-content/Home.jsx
'use client';
import { useSuperAdminAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  School, Users, GraduationCap, BookOpen, LifeBuoy,
  CheckCircle, FileBarChart2, BarChart3, TrendingUp, DollarSign,
} from 'lucide-react';
import {
  homeContainer,
  homeHeader,
  homeTitle,
  homeSubtitle,
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
  homeSubjectGrid,
  homeSubjectButton,
  homeSubjectInner,
  homeSubjectIcon,
  homeSubjectName,
  homeSubjectCount,
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
    activeAdmins: 0,
    totalStudents: 0,
    totalExams: 0,
    openTickets: 0,
    totalRevenue: 0
  });
  const [subscriptionStats, setSubscriptionStats] = useState({
    totalRevenue: 0,
    basic: 0,
    standard: 0,
    premium: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchSubscriptionStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetchWithAuth('/super-admin/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || {});
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptionStats = async () => {
    try {
      const response = await fetchWithAuth('/super-admin/subscription/stats');
      if (response.ok) {
        const data = await response.json();
        setSubscriptionStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch subscription stats:', error);
    }
  };

  const quickActions = [
    { title: 'Add New School', Icon: School,        action: () => setActiveSection('schools')  },
    { title: 'Create Admin',   Icon: Users,          action: () => setActiveSection('admins')   },
    { title: 'Generate Report',Icon: FileBarChart2,  action: () => setActiveSection('reports')  },
    { title: 'View Analytics', Icon: BarChart3,      action: () => setActiveSection('analytics')},
    { title: 'Manage Subjects',Icon: BookOpen,       action: () => setActiveSection('subjects') },
  ];

  const safeLocale = (val) => (Number(val) || 0).toLocaleString();

  return (
    <div className={homeContainer}>
      <div className={homeHeader}>
        <h1 className={homeTitle}>
          Welcome back, {user?.name || 'Super Admin'}! 👋
        </h1>
        <p className={homeSubtitle}>
          {stats.totalSchools} schools · {stats.totalAdmins} admins · {safeLocale(stats.totalStudents)} students
        </p>
      </div>

      {(() => {
        const statItems = [
          { Icon: School,          label: 'Total Schools',  value: stats.totalSchools },
          { Icon: CheckCircle,     label: 'Active Schools', value: stats.activeSchools },
          { Icon: Users,           label: 'Total Admins',   value: stats.totalAdmins },
          { Icon: GraduationCap,   label: 'Total Students', value: safeLocale(stats.totalStudents) },
          { Icon: BookOpen,        label: 'Exams Taken',    value: safeLocale(stats.totalExams) },
          { Icon: LifeBuoy,        label: 'Open Tickets',   value: stats.openTickets },
          { Icon: DollarSign,      label: 'Total Revenue',  value: `₦${safeLocale(stats.totalRevenue || subscriptionStats.totalRevenue)}` },
        ];
        return (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statItems.map(({ Icon, label, value }, i) => (
              <motion.div
                key={label}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.05 * (i + 1) }}
                className={homeStatCard}
              >
                <div className={homeStatCardTop}>
                  <span className={homeStatCardIcon}><Icon size={18} strokeWidth={2} /></span>
                  <span className={homeStatCardValue}>{value}</span>
                </div>
                <p className={homeStatCardLabel}>{label}</p>
              </motion.div>
            ))}
          </div>
        );
      })()}

      <div className={homeActionsGrid}>
        {quickActions.map(({ title, Icon, action }) => (
          <motion.button
            key={title}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={action}
            className={homeActionButton}
          >
            <div className={homeActionIcon}><Icon size={18} strokeWidth={2} /></div>
            <h3 className={homeActionTitle}>{title}</h3>
          </motion.button>
        ))}
      </div>

      <div className={homeContentGrid}>
        <div className={homeCard}>
          <h2 className={homeCardTitle}>Quick Access</h2>
          <div className={homeSubjectGrid}>
            {[
              { id: 'schools',  Icon: School,        name: 'Schools',        sub: 'Add & manage schools' },
              { id: 'admins',   Icon: Users,          name: 'Admins',         sub: 'Create school admins' },
              { id: 'subjects', Icon: BookOpen,       name: 'Subjects',       sub: 'Create & manage subjects' },
              { id: 'support',  Icon: LifeBuoy,       name: 'Support Tickets',sub: `${stats.openTickets} pending` },
            ].map(({ id, Icon, name, sub }) => (
              <button key={id} onClick={() => setActiveSection(id)} className={homeSubjectButton}>
                <div className={homeSubjectInner}>
                  <span className={homeSubjectIcon}><Icon size={18} strokeWidth={2} /></span>
                  <div>
                    <div className={homeSubjectName}>{name}</div>
                    <div className={homeSubjectCount}>{sub}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className={homeCard}>
          <h2 className={homeCardTitle}>Revenue Overview</h2>
          <div className="space-y-3">
            {[
              { label: 'Basic',    value: subscriptionStats.basic    },
              { label: 'Standard', value: subscriptionStats.standard },
              { label: 'Premium',  value: subscriptionStats.premium  },
            ].map(({ label, value }) => (
              <div key={label} className="p-4 bg-surface-subtle rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-content-primary">{label}</span>
                  <span className="text-sm font-semibold text-brand-primary">₦{(value || 0).toLocaleString()}</span>
                </div>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-brand-primary rounded-full w-full" />
                </div>
              </div>
            ))}
            <div className="p-4 bg-brand-primary-lt rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-content-primary">Total Revenue</span>
                <span className="text-xl font-bold text-brand-primary font-playfair">
                  ₦{safeLocale(stats.totalRevenue || subscriptionStats.totalRevenue)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={homeBanner}>
        <div className={homeBannerContent}>
          <div>
            <h3 className={homeBannerTitle}>Platform Overview</h3>
            <p className={homeBannerText}>
              Generate comprehensive reports and analytics across all schools on the platform.
            </p>
          </div>
          <div className={homeBannerActions}>
            <button onClick={() => setActiveSection('reports')} className={homeBannerButtonPrimary}>
              Generate Report
            </button>
            <button onClick={() => setActiveSection('analytics')} className={homeBannerButtonSecondary}>
              View Analytics
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