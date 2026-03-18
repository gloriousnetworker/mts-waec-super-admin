// components/dashboard-components/Navbar.jsx
'use client';
import { useSuperAdminAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Menu, Settings, MessageSquare, LogOut, ChevronDown, Shield } from 'lucide-react';
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
  const { user, logout } = useSuperAdminAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'SA';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
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
