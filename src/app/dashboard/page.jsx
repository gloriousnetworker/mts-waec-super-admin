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
import SuperAdminChat from '../../components/dashboard-content/SuperAdminChat';
import ProtectedRoute from '../../components/ProtectedRoute';
import toast from 'react-hot-toast';

const dashboardContainer = "min-h-screen bg-[#F9FAFB]";
const dashboardMain = "flex";
const dashboardContent = "flex-1 min-h-screen overflow-y-auto";
const dashboardInner = "max-w-7xl mx-auto px-4 py-6";
const dashboardLoading = "fixed inset-0 bg-white flex items-center justify-center z-50";
const dashboardLoadingInner = "text-center";
const dashboardLoadingSpinner = "w-16 h-16 border-4 border-[#039994] border-t-transparent rounded-full animate-spin mx-auto mb-4";
const dashboardLoadingText = "text-[14px] leading-[100%] font-[500] text-[#626060] font-playfair";

function SuperAdminDashboardContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [showChat, setShowChat] = useState(false);
  const [chatTicketId, setChatTicketId] = useState(null);
  const { isAuthenticated, authChecked, user } = useSuperAdminAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (authChecked) {
      setPageLoading(false);
    }
  }, [authChecked]);

  useEffect(() => {
    const reportGenerated = searchParams.get('reportGenerated');
    if (reportGenerated === 'true') {
      toast.success('Report generated successfully!');
      const url = new URL(window.location.href);
      url.searchParams.delete('reportGenerated');
      window.history.replaceState({}, '', url.pathname);
    }
  }, [searchParams]);

  const handleNavigation = (section) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  const handleOpenChat = (ticketId = null) => {
    setChatTicketId(ticketId);
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setChatTicketId(null);
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
        <main className={dashboardContent}>
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