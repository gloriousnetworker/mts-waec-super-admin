// app/super-admin/dashboard/page.jsx
'use client';
import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSuperAdminAuth } from '../../context/AuthContext';
import { useSearchParams } from 'next/navigation';
import SuperAdminNavbar from '../../components/dashboard-components/Navbar';
import SuperAdminSidebar from '../../components/dashboard-components/Sidebar';
import SuperAdminHome from '../../components/dashboard-content/Home';
import Schools from '../../components/dashboard-content/Schools';
import Admins from '../../components/dashboard-content/Admins';
import Students from '../../components/dashboard-content/Students';
import Reports from '../../components/dashboard-content/Reports';
import Support from '../../components/dashboard-content/Support';
import Analytics from '../../components/dashboard-content/Analytics';
import Settings from '../../components/dashboard-content/Settings';
import Help from '../../components/dashboard-content/Help';
import Subjects from '../../components/dashboard-content/Subjects';
import SuperAdminChat from '../../components/dashboard-content/SuperAdminChat';
import Activity from '../../components/dashboard-content/Activity';
import ProtectedRoute from '../../components/ProtectedRoute';
import toast from 'react-hot-toast';

const dashboardContainer = "fixed inset-0 flex flex-col bg-surface-muted overflow-hidden";
const dashboardMain = "flex flex-1 overflow-hidden pt-16 lg:pt-16";
const dashboardContent = "flex-1 overflow-y-auto overscroll-y-none";
const dashboardInner = "p-4 pt-4 sm:p-6 sm:pt-6 max-w-7xl mx-auto";
const dashboardLoading = "fixed inset-0 bg-white flex items-center justify-center z-50";
const dashboardLoadingInner = "text-center";
const dashboardLoadingSpinner = "w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4";
const dashboardLoadingText = "text-sm text-content-secondary";

function SuperAdminDashboardContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Open sidebar by default on desktop after mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setSidebarOpen(true);
    }
  }, []);
  const [activeSection, setActiveSection] = useState('home');
  const [showChat, setShowChat] = useState(false);
  const [chatTicketId, setChatTicketId] = useState(null);
  const { isAuthenticated, authChecked } = useSuperAdminAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (authChecked) {
      setPageLoading(false);
    }
  }, [authChecked]);

  useEffect(() => {
    const ticketId = searchParams.get('ticket');
    if (ticketId) {
      setChatTicketId(ticketId);
      setShowChat(true);
    }
  }, [searchParams]);

  const handleNavigation = (section) => {
    setActiveSection(section);
    // Mobile close is handled by Sidebar's onClose prop
  };

  const handleOpenChat = (ticketId = null) => {
    setChatTicketId(ticketId);
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setChatTicketId(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('ticket');
    window.history.replaceState({}, '', url.pathname);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'home': return <SuperAdminHome setActiveSection={handleNavigation} />;
      case 'schools': return <Schools setActiveSection={handleNavigation} />;
      case 'admins': return <Admins setActiveSection={handleNavigation} />;
      case 'students': return <Students setActiveSection={handleNavigation} />;
      case 'reports': return <Reports setActiveSection={handleNavigation} />;
      case 'support': return <Support setActiveSection={handleNavigation} onOpenChat={handleOpenChat} />;
      case 'analytics': return <Analytics setActiveSection={handleNavigation} />;
      case 'settings': return <Settings setActiveSection={handleNavigation} />;
      case 'help': return <Help setActiveSection={handleNavigation} />;
      case 'subjects': return <Subjects setActiveSection={handleNavigation} />;
      case 'activity': return <Activity setActiveSection={handleNavigation} />;
      default: return <SuperAdminHome setActiveSection={handleNavigation} />;
    }
  };

  if (pageLoading) {
    return (
      <div className={dashboardLoading}>
        <div className={dashboardLoadingInner}>
          <div className={dashboardLoadingSpinner}></div>
          <p className={dashboardLoadingText}>Loading super admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={dashboardContainer}>
      {/* Logo watermark — absolute inside the fixed dashboard shell */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <img
          src="/logo.png"
          alt=""
          aria-hidden="true"
          className="w-[70vw] max-w-xs sm:max-w-sm object-contain select-none"
          style={{ opacity: 0.06 }}
        />
      </div>
      <SuperAdminNavbar
        activeSection={activeSection}
        setActiveSection={handleNavigation}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onChatClick={() => handleOpenChat(null)}
      />
      <div className={dashboardMain}>
        <SuperAdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeSection={activeSection}
          setActiveSection={handleNavigation}
          onChatClick={() => handleOpenChat(null)}
        />
        <main className={`${dashboardContent} transition-[margin-left] duration-300 ease-in-out ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className={dashboardInner}
          >
            {renderSection()}
          </motion.div>
        </main>
      </div>
      <SuperAdminChat
        isOpen={showChat}
        onClose={handleCloseChat}
        initialTicketId={chatTicketId}
      />
    </div>
  );
}

export default function SuperAdminDashboardPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <div className={dashboardLoading}>
          <div className={dashboardLoadingInner}>
            <div className={dashboardLoadingSpinner}></div>
            <p className={dashboardLoadingText}>Loading super admin dashboard...</p>
          </div>
        </div>
      }>
        <SuperAdminDashboardContent />
      </Suspense>
    </ProtectedRoute>
  );
}