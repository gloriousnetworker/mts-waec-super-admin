// components/dashboard-components/Sidebar.jsx
'use client';
import { useSuperAdminAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  School,
  Users,
  GraduationCap,
  BookOpen,
  FileBarChart2,
  LifeBuoy,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  MessageSquare,
} from 'lucide-react';
import {
  sidebarContainer,
  sidebarOverlay,
  sidebarHeader,
  sidebarHeaderLogo,
  sidebarHeaderTitle,
  sidebarHeaderSubtitle,
  sidebarNavGroup,
  sidebarNavGroupLabel,
  sidebarNav,
  sidebarNavItem,
  sidebarNavItemActive,
  sidebarNavItemInactive,
  sidebarNavItemIcon,
  sidebarNavItemLabel,
  sidebarFooter,
  sidebarLogout,
  sidebarHelpCard,
  sidebarHelpTitle,
  sidebarHelpButton,
} from '../../styles/styles';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', id: 'home' },
    ],
  },
  {
    label: 'Management',
    items: [
      { icon: School,          label: 'Schools',    id: 'schools'   },
      { icon: Users,           label: 'Admins',     id: 'admins'    },
      { icon: GraduationCap,   label: 'Students',   id: 'students'  },
      { icon: BookOpen,        label: 'Subjects',   id: 'subjects'  },
    ],
  },
  {
    label: 'Insights',
    items: [
      { icon: FileBarChart2,   label: 'Reports',    id: 'reports'   },
      { icon: BarChart3,       label: 'Analytics',  id: 'analytics' },
    ],
  },
  {
    label: 'System',
    items: [
      { icon: LifeBuoy,        label: 'Support',    id: 'support'   },
      { icon: Settings,        label: 'Settings',   id: 'settings'  },
      { icon: HelpCircle,      label: 'Help',       id: 'help'      },
    ],
  },
];

export default function SuperAdminSidebar({ isOpen, onClose, activeSection, setActiveSection, onChatClick }) {
  const { logout } = useSuperAdminAuth();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleNav = (id) => {
    setActiveSection(id);
    if (isMobile) onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={sidebarOverlay}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen || !isMobile ? 0 : -280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={sidebarContainer}
      >
        {/* Header */}
        <div className={sidebarHeader}>
          <div className={sidebarHeaderLogo}>
            <Image
              src="/logo.png"
              alt="Einstein's CBT"
              width={36}
              height={36}
              className="object-contain"
            />
          </div>
          <div>
            <h2 className={sidebarHeaderTitle}>Einstein's CBT</h2>
            <p className={sidebarHeaderSubtitle}>Super Admin Portal</p>
          </div>
        </div>

        {/* Nav */}
        <nav className={sidebarNav}>
          {navGroups.map((group) => (
            <div key={group.label} className={sidebarNavGroup}>
              <p className={sidebarNavGroupLabel}>{group.label}</p>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`${sidebarNavItem} ${isActive ? sidebarNavItemActive : sidebarNavItemInactive}`}
                  >
                    {/* Active accent bar */}
                    {isActive && (
                      <motion.span
                        layoutId="sidebar-active-bar"
                        className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r-full bg-brand-primary"
                      />
                    )}
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={sidebarNavItemIcon} />
                    <span className={sidebarNavItemLabel}>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className={sidebarFooter}>
          <button onClick={logout} className={sidebarLogout}>
            <LogOut size={18} strokeWidth={2} />
            <span className={sidebarNavItemLabel}>Sign Out</span>
          </button>

          <div className={sidebarHelpCard}>
            <p className={sidebarHelpTitle}>Need assistance?</p>
            <button
              onClick={() => { onChatClick?.(); if (isMobile) onClose(); }}
              className={sidebarHelpButton}
            >
              <MessageSquare size={12} className="inline mr-1" />
              Contact Support
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
