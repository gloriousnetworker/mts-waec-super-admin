// components/dashboard-content/Home.jsx
'use client';
import { useSuperAdminAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  School, Users, GraduationCap, BookOpen, LifeBuoy,
  CheckCircle, FileBarChart2, BarChart3, TrendingUp, DollarSign,
  ArrowRight, Zap,
} from 'lucide-react';

// Colorful gradient backgrounds for each stat card
const STAT_COLORS = [
  { bg: 'linear-gradient(135deg, #1F2A49 0%, #3A4F7A 100%)',   glow: 'rgba(31,42,73,0.3)'    },  // navy
  { bg: 'linear-gradient(135deg, #059669 0%, #047857 100%)',   glow: 'rgba(5,150,105,0.3)'    },  // emerald
  { bg: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',   glow: 'rgba(59,130,246,0.3)'   },  // blue
  { bg: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',   glow: 'rgba(124,58,237,0.3)'   },  // violet
  { bg: 'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)',   glow: 'rgba(245,158,11,0.3)'   },  // amber
  { bg: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',   glow: 'rgba(239,68,68,0.3)'    },  // red
  { bg: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)',   glow: 'rgba(13,148,136,0.3)'   },  // teal
];

const ACTION_COLORS = [
  'linear-gradient(135deg, #1F2A49 0%, #3A4F7A 100%)',
  'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
  'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
  'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)',
  'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)',
];

export default function SuperAdminHome({ setActiveSection }) {
  const { user, fetchWithAuth } = useSuperAdminAuth();
  const [stats, setStats] = useState({
    totalSchools: 0, activeSchools: 0, totalAdmins: 0, activeAdmins: 0,
    totalStudents: 0, totalExams: 0, openTickets: 0, totalRevenue: 0,
  });
  const [subscriptionStats, setSubscriptionStats] = useState({
    totalRevenue: 0, basic: 0, standard: 0, premium: 0,
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

  const safeLocale = (val) => (Number(val) || 0).toLocaleString();

  const statItems = [
    { Icon: School,        label: 'Total Schools',   value: stats.totalSchools },
    { Icon: CheckCircle,   label: 'Active Schools',  value: stats.activeSchools },
    { Icon: Users,         label: 'Total Admins',    value: stats.totalAdmins },
    { Icon: GraduationCap, label: 'Total Students',  value: safeLocale(stats.totalStudents) },
    { Icon: BookOpen,      label: 'Exams Taken',     value: safeLocale(stats.totalExams) },
    { Icon: LifeBuoy,      label: 'Open Tickets',    value: stats.openTickets },
    { Icon: DollarSign,    label: 'Total Revenue',   value: `₦${safeLocale(stats.totalRevenue || subscriptionStats.totalRevenue)}` },
  ];

  const quickActions = [
    { title: 'Add New School',   Icon: School,       action: () => setActiveSection('schools')   },
    { title: 'Create Admin',     Icon: Users,        action: () => setActiveSection('admins')    },
    { title: 'Generate Report',  Icon: FileBarChart2,action: () => setActiveSection('reports')   },
    { title: 'View Analytics',   Icon: BarChart3,    action: () => setActiveSection('analytics') },
    { title: 'Manage Subjects',  Icon: BookOpen,     action: () => setActiveSection('subjects')  },
  ];

  const totalRevenue = stats.totalRevenue || subscriptionStats.totalRevenue || 0;
  const revenuePlans = [
    { label: 'Basic',    value: subscriptionStats.basic    || 0, color: '#3B82F6' },
    { label: 'Standard', value: subscriptionStats.standard || 0, color: '#7C3AED' },
    { label: 'Premium',  value: subscriptionStats.premium  || 0, color: '#F59E0B' },
  ];
  const maxPlan = Math.max(...revenuePlans.map(p => p.value), 1);

  return (
    <div className="max-w-7xl mx-auto">

      {/* ── HERO BANNER ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl mb-6"
        style={{ background: 'linear-gradient(135deg, #1F2A49 0%, #1a2340 55%, #141C33 100%)' }}
      >
        {/* Ghost logo watermark */}
        <div className="absolute inset-y-0 right-0 pointer-events-none select-none flex items-center pr-6 sm:pr-12">
          <div style={{ position: 'relative', width: 240, height: 240, opacity: 0.06 }}>
            <Image src="/logo.png" alt="" fill className="object-contain" priority />
          </div>
        </div>
        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 700px 350px at 20% 50%, rgba(58,79,122,0.45) 0%, transparent 70%)' }}
        />
        {/* Dot pattern overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />

        <div className="relative z-10 p-6 sm:p-8">
          {/* Top row */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-2xs text-white/60 mb-3">
                <Zap size={10} className="text-brand-gold" />
                Super Admin Dashboard
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-playfair leading-tight">
                Welcome back,<br className="sm:hidden" />
                <span className="text-brand-gold"> {user?.name?.split(' ')[0] || 'Admin'}!</span>
              </h1>
              <p className="text-white/50 text-sm mt-2">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Ticket badge */}
            {stats.openTickets > 0 && (
              <motion.button
                onClick={() => setActiveSection('support')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="hidden sm:flex flex-shrink-0 items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/90 hover:bg-red-500 border border-red-400/40 text-white text-sm font-semibold transition-colors"
              >
                <LifeBuoy size={16} strokeWidth={2} />
                {stats.openTickets} Open Ticket{stats.openTickets !== 1 ? 's' : ''}
              </motion.button>
            )}
          </div>

          {/* Metric row inside banner */}
          <div className="grid grid-cols-3 gap-3 pt-5 border-t border-white/10">
            {[
              { label: 'Schools',  value: stats.totalSchools,                        Icon: School },
              { label: 'Admins',   value: stats.totalAdmins,                         Icon: Users },
              { label: 'Students', value: safeLocale(stats.totalStudents),            Icon: GraduationCap },
            ].map(({ label, value, Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="text-center"
              >
                <div className="text-xl sm:text-2xl font-bold text-white font-playfair">{value || 0}</div>
                <div className="flex items-center justify-center gap-1 text-2xs text-white/50 mt-0.5">
                  <Icon size={10} />
                  {label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── COLORFUL STAT CARDS ─────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {statItems.map(({ Icon, label, value }, i) => (
          <motion.div
            key={label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05 * (i + 1) }}
            className="relative overflow-hidden rounded-2xl p-4 flex flex-col justify-between min-h-[110px]"
            style={{ background: STAT_COLORS[i % STAT_COLORS.length].bg }}
          >
            {/* Inner glow */}
            <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full pointer-events-none"
              style={{ background: 'rgba(255,255,255,0.08)', filter: 'blur(16px)' }}
            />
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.15)' }}>
                <Icon size={18} strokeWidth={2} className="text-white" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white font-playfair leading-none">{value}</div>
              <div className="text-2xs text-white/60 mt-1">{label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── QUICK ACTIONS ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {quickActions.map(({ title, Icon, action }, i) => (
          <motion.button
            key={title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * (i + 1) }}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={action}
            className="relative overflow-hidden rounded-2xl p-4 text-left flex flex-col gap-3 min-h-[100px] group"
            style={{ background: ACTION_COLORS[i % ACTION_COLORS.length] }}
          >
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors rounded-2xl pointer-events-none" />
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.2)' }}>
              <Icon size={18} strokeWidth={2} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-tight">{title}</p>
              <div className="flex items-center gap-1 mt-1 text-white/50 text-2xs">
                Go <ArrowRight size={10} />
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* ── CONTENT GRID ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Quick Access */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-border p-5"
          style={{ boxShadow: '0 2px 16px rgba(31,42,73,0.06)' }}
        >
          <h2 className="text-lg font-bold text-content-primary font-playfair mb-4">Quick Access</h2>
          <div className="space-y-2">
            {[
              { id: 'schools',  Icon: School,   name: 'Schools',         sub: `${stats.totalSchools} registered`,         color: '#1F2A49' },
              { id: 'admins',   Icon: Users,    name: 'Admins',          sub: `${stats.totalAdmins} accounts`,            color: '#3B82F6' },
              { id: 'subjects', Icon: BookOpen, name: 'Subjects',        sub: 'Create & manage subjects',                 color: '#7C3AED' },
              { id: 'support',  Icon: LifeBuoy, name: 'Support Tickets', sub: `${stats.openTickets} pending`,             color: '#EF4444' },
            ].map(({ id, Icon, name, sub, color }) => (
              <motion.button
                key={id}
                whileHover={{ x: 4 }}
                onClick={() => setActiveSection(id)}
                className="w-full text-left p-3 rounded-xl hover:bg-surface-subtle transition-all min-h-[52px] group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                    style={{ background: color, }}>
                    <Icon size={17} strokeWidth={2} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-content-primary">{name}</div>
                    <div className="text-xs text-content-muted">{sub}</div>
                  </div>
                  <ArrowRight size={14} className="text-content-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Revenue Overview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl border border-border p-5"
          style={{ boxShadow: '0 2px 16px rgba(31,42,73,0.06)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-content-primary font-playfair">Revenue Overview</h2>
            <TrendingUp size={18} className="text-brand-primary" strokeWidth={2} />
          </div>
          <div className="space-y-4">
            {revenuePlans.map(({ label, value, color }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-content-primary">{label}</span>
                  <span className="text-sm font-bold" style={{ color }}>₦{(value || 0).toLocaleString()}</span>
                </div>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round((value / maxPlan) * 100)}%` }}
                    transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Total revenue */}
          <div className="mt-5 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-content-muted font-medium uppercase tracking-wider">Total Revenue</p>
                <p className="text-2xl font-bold text-brand-primary font-playfair mt-0.5">
                  ₦{safeLocale(totalRevenue)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #1F2A49, #3A4F7A)' }}>
                <DollarSign size={22} className="text-white" strokeWidth={2} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── PLATFORM OVERVIEW BANNER ────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative overflow-hidden rounded-2xl"
        style={{ background: 'linear-gradient(135deg, #1F2A49 0%, #1a2340 55%, #141C33 100%)' }}
      >
        {/* Ghost logo */}
        <div className="absolute inset-y-0 right-0 flex items-center justify-end pr-8 pointer-events-none select-none">
          <div style={{ position: 'relative', width: 180, height: 180, opacity: 0.05 }}>
            <Image src="/logo.png" alt="" fill className="object-contain" />
          </div>
        </div>

        <div className="relative z-10 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-6">
            <div>
              <h3 className="text-xl font-bold text-white font-playfair">Platform Overview</h3>
              <p className="text-sm text-white/60 mt-1">
                Generate comprehensive reports and analytics across all schools.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveSection('reports')}
                className="px-4 py-2.5 bg-white text-brand-primary text-sm font-semibold rounded-xl min-h-[44px] flex items-center gap-2 hover:bg-white/90 transition-colors"
              >
                <FileBarChart2 size={15} strokeWidth={2} />
                Generate Report
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveSection('analytics')}
                className="px-4 py-2.5 bg-white/10 border border-white/25 text-white text-sm font-semibold rounded-xl min-h-[44px] flex items-center gap-2 hover:bg-white/20 transition-colors"
              >
                <BarChart3 size={15} strokeWidth={2} />
                Analytics
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 border-t border-white/10">
            {[
              { label: 'Schools',  value: stats.totalSchools },
              { label: 'Admins',   value: stats.totalAdmins },
              { label: 'Students', value: safeLocale(stats.totalStudents) },
              { label: 'Exams',    value: safeLocale(stats.totalExams) },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-white font-playfair">{value || 0}</div>
                <div className="text-xs text-white/50 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

    </div>
  );
}
