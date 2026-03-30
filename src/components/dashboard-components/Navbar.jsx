// components/dashboard-components/Navbar.jsx
'use client';
import { useSuperAdminAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Menu, Settings, MessageSquare, LogOut, ChevronDown, Shield } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import {
  navbarContainer,
  navbarInner,
  navbarContent,
  navbarLeft,
  navbarMenuButton,
  navbarLogo,
  navbarLogoImage,
  navbarLogoText,
  navbarLogoSubtext,
  navbarRight,
  navbarProfileButton,
  navbarProfileAvatar,
  navbarProfileAvatarText,
  navbarProfileInfo,
  navbarProfileName,
  navbarProfileRole,
  navbarDropdown,
  navbarDropdownHeader,
  navbarDropdownHeaderName,
  navbarDropdownHeaderEmail,
  navbarDropdownMenu,
  navbarDropdownItem,
  navbarDropdownItemDanger,
  modalOverlay,
  modalContainer,
  modalTitle,
  modalSubtitle,
  modalActions,
  modalButtonSecondary,
  modalButtonDanger,
} from '../../styles/styles';

export default function SuperAdminNavbar({ activeSection, setActiveSection, onMenuClick, onChatClick }) {
  // Use user directly from AuthContext — no redundant /me fetch
  const { user, logout, fetchWithAuth } = useSuperAdminAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const notifRef = useRef(null);
  const { notifications, unreadCount, permissionState, requestPermission, markRead, markAllRead } = useNotifications(fetchWithAuth, '/super-admin');

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!showNotifDropdown) return;
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifDropdown]);

  const getInitials = (name) => {
    if (!name) return 'SA';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  const formatNotifTime = (ts) => {
    if (!ts) return '';
    const d = ts._seconds ? new Date(ts._seconds * 1000) : new Date(ts);
    const diff = Date.now() - d.getTime();
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString();
  };

  return (
    <>
      <nav className={navbarContainer}>
        <div className={navbarInner}>
          <div className={navbarContent}>
            {/* Left: Hamburger + Logo */}
            <div className={navbarLeft}>
              {/* Hamburger visible on ALL screen sizes per design spec */}
              <button onClick={onMenuClick} className={navbarMenuButton} aria-label="Toggle sidebar">
                <Menu size={20} />
              </button>

              <div className={navbarLogo}>
                <Image
                  src="/logo.png"
                  alt="Einstein's CBT App"
                  width={36}
                  height={36}
                  className={navbarLogoImage}
                />
                <div>
                  <h1 className={navbarLogoText}>Einstein's CBT</h1>
                  <p className={navbarLogoSubtext}>Super Admin Portal</p>
                </div>
              </div>
            </div>

            {/* Right: Profile dropdown */}
            <div className={navbarRight}>
              {/* Admin role badge */}
              <span className="hidden sm:flex badge-danger items-center gap-1 text-2xs font-semibold">
                <Shield size={11} strokeWidth={2.5} />
                Super Admin
              </span>

              {/* Notification bell */}
              <div ref={notifRef} className="relative">
                <button
                  onClick={() => setShowNotifDropdown(prev => !prev)}
                  className="relative p-2 text-content-secondary hover:text-content-primary hover:bg-surface-subtle rounded-lg transition-colors"
                  aria-label="Notifications"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {showNotifDropdown && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-border shadow-card-lg z-50 overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                      <p className="text-sm font-bold text-content-primary">Notifications</p>
                      <div className="flex items-center gap-2">
                        {permissionState !== 'granted' && (
                          <button onClick={requestPermission} className="text-xs text-brand-primary hover:underline font-medium">
                            Enable push
                          </button>
                        )}
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} className="text-xs text-content-muted hover:text-brand-primary transition-colors">
                            Mark all read
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="py-10 text-center">
                          <p className="text-2xl mb-2">🔔</p>
                          <p className="text-xs text-content-muted">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <button
                            key={notif.id}
                            onClick={() => markRead(notif.id)}
                            className={`w-full text-left px-4 py-3 border-b border-border last:border-0 hover:bg-surface-subtle transition-colors ${!notif.read ? 'bg-brand-primary-lt/40' : ''}`}
                          >
                            <div className="flex items-start gap-2">
                              {!notif.read && <span className="w-2 h-2 bg-brand-primary rounded-full flex-shrink-0 mt-1.5" />}
                              <div className={`flex-1 min-w-0 ${notif.read ? 'pl-4' : ''}`}>
                                <p className="text-xs font-semibold text-content-primary truncate">{notif.title}</p>
                                <p className="text-xs text-content-muted mt-0.5 line-clamp-2">{notif.body}</p>
                                <p className="text-[10px] text-content-muted mt-1">{formatNotifTime(notif.createdAt)}</p>
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </div>

              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setShowDropdown(prev => !prev)}
                  className={navbarProfileButton}
                  aria-label="Profile menu"
                >
                  <div className={navbarProfileAvatar}>
                    <span className={navbarProfileAvatarText}>
                      {getInitials(user?.name)}
                    </span>
                  </div>
                  <div className={navbarProfileInfo}>
                    <p className={navbarProfileName}>{user?.name || 'Super Admin'}</p>
                    <p className={navbarProfileRole}>{user?.email || ''}</p>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-content-muted transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className={navbarDropdown}
                    >
                      <div className={navbarDropdownHeader}>
                        <p className={navbarDropdownHeaderName}>{user?.name || 'Super Admin'}</p>
                        <p className={navbarDropdownHeaderEmail}>{user?.email || ''}</p>
                      </div>
                      <div className={navbarDropdownMenu}>
                        <button
                          onClick={() => { setActiveSection('settings'); setShowDropdown(false); }}
                          className={navbarDropdownItem}
                        >
                          <Settings size={15} strokeWidth={2} />
                          Profile Settings
                        </button>
                        <button
                          onClick={() => { onChatClick?.(); setShowDropdown(false); }}
                          className={navbarDropdownItem}
                        >
                          <MessageSquare size={15} strokeWidth={2} />
                          Support Chat
                        </button>
                        <div className="my-1 border-t border-border" />
                        <button
                          onClick={() => { setShowLogoutConfirm(true); setShowDropdown(false); }}
                          className={navbarDropdownItemDanger}
                        >
                          <LogOut size={15} strokeWidth={2} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Logout confirmation modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={modalOverlay}
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 16 }}
              transition={{ duration: 0.2 }}
              className={modalContainer}
              onClick={e => e.stopPropagation()}
            >
              <h3 className={modalTitle}>Sign Out</h3>
              <p className={modalSubtitle}>Are you sure you want to sign out of the Super Admin Portal?</p>
              <div className={modalActions}>
                <button onClick={() => setShowLogoutConfirm(false)} className={modalButtonSecondary}>
                  Cancel
                </button>
                <button onClick={handleLogout} className={modalButtonDanger}>
                  Sign Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
