// components/dashboard-components/Sidebar.jsx
'use client';
import { useSuperAdminAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
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
  ChevronRight,
  Activity as ActivityIcon,
} from 'lucide-react';

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
      { icon: School,          label: 'Schools',   id: 'schools'   },
      { icon: Users,           label: 'Admins',    id: 'admins'    },
      { icon: GraduationCap,   label: 'Students',  id: 'students'  },
      { icon: BookOpen,        label: 'Subjects',  id: 'subjects'  },
    ],
  },
  {
    label: 'Insights',
    items: [
      { icon: FileBarChart2,   label: 'Reports',   id: 'reports'   },
      { icon: BarChart3,       label: 'Analytics', id: 'analytics' },
      { icon: ActivityIcon,    label: 'Activity',  id: 'activity'  },
    ],
  },
  {
    label: 'System',
    items: [
      { icon: LifeBuoy,        label: 'Support',   id: 'support'   },
      { icon: Settings,        label: 'Settings',  id: 'settings'  },
      { icon: HelpCircle,      label: 'Help',      id: 'help'      },
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
      {/* Mobile overlay — CSS opacity transition, no Framer Motion needed */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen && isMobile ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Sidebar panel — CSS transform (GPU-accelerated, no JS animation) */}
      <aside
        className={`fixed inset-y-0 lg:top-16 left-0 z-50 lg:z-30 w-64 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
        style={{ background: 'linear-gradient(180deg, #1F2A49 0%, #141C33 100%)' }}
      >
        {/* Top gradient accent bar */}
        <div className="h-0.5 flex-shrink-0 bg-gradient-to-r from-brand-gold via-white/20 to-transparent" />

        {/* Mobile-only header */}
        <div className="flex lg:hidden items-center gap-3 px-5 py-4 border-b border-white/10 flex-shrink-0">
          <div className="w-9 h-9 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Einstein's CBT"
              width={36}
              height={36}
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight font-playfair">Einstein's CBT</h2>
            <p className="text-[10px] text-white/40 mt-0.5">Super Admin Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 hide-scrollbar">
          {navGroups.map((group) => (
            <div key={group.label} className="px-3 mb-1">
              {/* Group label */}
              <p className="px-3 mb-1 mt-3 text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: 'rgba(255,255,255,0.3)' }}>
                {group.label}
              </p>

              {/* Nav items */}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: '100%',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      marginBottom: '2px',
                      minHeight: '44px',
                      position: 'relative',
                      background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                      textAlign: 'left',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {/* Active left bar */}
                    {isActive && (
                      <motion.span
                        layoutId="sidebar-active-bar"
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: '6px',
                          bottom: '6px',
                          width: '3px',
                          borderRadius: '0 4px 4px 0',
                          background: '#FFB300',
                        }}
                      />
                    )}

                    {/* Icon */}
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      flexShrink: 0,
                      background: isActive ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)',
                    }}>
                      <Icon
                        size={16}
                        strokeWidth={isActive ? 2.5 : 2}
                        style={{ color: isActive ? '#ffffff' : 'rgba(255,255,255,0.55)' }}
                      />
                    </span>

                    {/* Label */}
                    <span style={{
                      fontSize: '13px',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? '#ffffff' : 'rgba(255,255,255,0.6)',
                      flex: 1,
                      fontFamily: 'Inter, sans-serif',
                    }}>
                      {item.label}
                    </span>

                    {/* Active chevron */}
                    {isActive && (
                      <ChevronRight
                        size={14}
                        style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-4 pt-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {/* Sign out */}
          <button
            onClick={logout}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '10px',
              minHeight: '44px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.15s',
              marginBottom: '8px',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            <span style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              flexShrink: 0,
              background: 'rgba(239,68,68,0.15)',
            }}>
              <LogOut size={16} strokeWidth={2} style={{ color: '#EF4444' }} />
            </span>
            <span style={{
              fontSize: '13px',
              fontWeight: 500,
              color: '#EF4444',
              fontFamily: 'Inter, sans-serif',
            }}>
              Sign Out
            </span>
          </button>

          {/* Help card */}
          <div style={{
            padding: '12px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginBottom: '8px', fontFamily: 'Inter, sans-serif' }}>
              Need assistance?
            </p>
            <button
              onClick={() => { onChatClick?.(); if (isMobile) onClose(); }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#FFB300',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <MessageSquare size={11} />
              Contact Support
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
