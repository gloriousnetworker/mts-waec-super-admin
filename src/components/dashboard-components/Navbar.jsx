'use client';

import { useSuperAdminAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
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
  navbarNav,
  navbarNavButton,
  navbarNavButtonActive,
  navbarNavButtonInactive,
  navbarRight,
  navbarSearch,
  navbarSearchIcon,
  navbarSearchInput,
  navbarNotification,
  navbarNotificationBadge,
  navbarProfile,
  navbarProfileButton,
  navbarProfileAvatar,
  navbarProfileAvatarText,
  navbarProfileInfo,
  navbarProfileName,
  navbarProfileId,
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
  modalText,
  modalActions,
  modalButtonSecondary,
  modalButtonDanger
} from '../../styles/styles';

const BASE_URL = 'https://cbt-simulator-backend.vercel.app';

export default function SuperAdminNavbar({ activeSection, setActiveSection, onMenuClick, onChatClick }) {
  const { user, logout, refreshUser } = useSuperAdminAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [liveUser, setLiveUser] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/auth/me`, {
          method: 'GET',
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setLiveUser(data.user);
        }
      } catch {}
    };
    fetchMe();
  }, []);

  const displayUser = liveUser || user;

  const getInitials = (name) => {
    if (!name) return 'SA';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    logout();
  };

  const navSections = [
    { id: 'home', label: 'Dashboard', icon: '🏠' },
    { id: 'schools', label: 'Schools', icon: '🏫' },
    { id: 'admins', label: 'Admins', icon: '👥' },
    { id: 'students', label: 'Students', icon: '🧑‍🎓' },
    { id: 'reports', label: 'Reports', icon: '📊' },
    { id: 'support', label: 'Support', icon: '🎫' },
  ];

  return (
    <>
      <nav className={navbarContainer}>
        <div className={navbarInner}>
          <div className={navbarContent}>
            <div className={navbarLeft}>
              <button
                onClick={onMenuClick}
                className={navbarMenuButton}
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div className={navbarLogo}>
                <div className={navbarLogoImage}>
                  <Image
                    src="/logo.png"
                    alt="Mega Tech Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h1 className={navbarLogoText}>Mega Tech Solutions</h1>
                  <p className={navbarLogoSubtext}>Kogi State Ministry of Education</p>
                </div>
              </div>
            </div>

            <div className={navbarNav}>
              {navSections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`${navbarNavButton} ${
                    activeSection === section.id
                      ? navbarNavButtonActive
                      : navbarNavButtonInactive
                  }`}
                >
                  <span className="mr-2">{section.icon}</span>
                  {section.label}
                </button>
              ))}
            </div>

            <div className={navbarRight}>
              <div className={navbarSearch}>
                <div className={navbarSearchIcon}>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="search"
                  className={navbarSearchInput}
                  placeholder="Search schools, admins..."
                />
              </div>

              <button className={navbarNotification}>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className={navbarNotificationBadge}></span>
              </button>

              <div className={navbarProfile}>
                <button className={navbarProfileButton}>
                  <div className={navbarProfileAvatar}>
                    <div className="w-9 h-9 rounded-full bg-[#7C3AED] flex items-center justify-center text-white text-[14px] leading-[100%] font-[600]">
                      {getInitials(displayUser?.name)}
                    </div>
                  </div>
                  <div className={navbarProfileInfo}>
                    <p className={navbarProfileName}>{displayUser?.name || 'Super Admin'}</p>
                    <p className={navbarProfileId}>{displayUser?.role === 'super_admin' ? 'Super Administrator' : displayUser?.role || 'Mega Tech Solutions'}</p>
                  </div>
                </button>

                <div className={navbarDropdown}>
                  <div className={navbarDropdownHeader}>
                    <p className={navbarDropdownHeaderName}>{displayUser?.name || 'Super Admin'}</p>
                    <p className={navbarDropdownHeaderEmail}>{displayUser?.email || ''}</p>
                  </div>
                  <div className={navbarDropdownMenu}>
                    <button
                      onClick={() => setActiveSection('settings')}
                      className={navbarDropdownItem}
                    >
                      Profile Settings
                    </button>
                    <button
                      onClick={onChatClick}
                      className={navbarDropdownItem}
                    >
                      Support Chat
                    </button>
                    <button
                      onClick={() => setShowLogoutConfirm(true)}
                      className={navbarDropdownItemDanger}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {showLogoutConfirm && (
        <div className={modalOverlay}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={modalContainer}
          >
            <h3 className={modalTitle}>Confirm Logout</h3>
            <p className={modalText}>Are you sure you want to logout?</p>
            <div className={modalActions}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className={modalButtonSecondary}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className={modalButtonDanger}
              >
                Logout
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}