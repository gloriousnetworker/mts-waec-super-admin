'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const SuperAdminAuthContext = createContext();

const SUPER_ADMINS = [
  {
    id: 'SA001',
    email: 'admin@megatechsolutions.org',
    name: 'Dr. Adewale Ogunleye',
    role: 'Super Administrator',
    department: 'Mega Tech Solutions',
    avatar: '/images/superadmin1.png',
    permissions: ['full_access', 'manage_admins', 'manage_schools', 'view_reports', 'manage_support']
  }
];

export function SuperAdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem('super_admin');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error loading super admin auth state:', error);
        localStorage.removeItem('super_admin');
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (identifier, password) => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const admin = SUPER_ADMINS.find(u => 
        u.email.toLowerCase() === identifier.toLowerCase() && 
        password === '123456'
      );

      if (admin) {
        const adminData = {
          ...admin,
          lastLogin: new Date().toISOString()
        };
        setUser(adminData);
        localStorage.setItem('super_admin', JSON.stringify(adminData));
        toast.success(`Welcome back, ${adminData.name}!`);
        return { success: true, data: adminData };
      } else {
        toast.error('Invalid super admin credentials');
        return { success: false, message: 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred. Please try again.');
      return { success: false, message: 'Network error' };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('super_admin');
    toast.success('Logged out successfully');
    router.push('/login');
  }, [router]);

  const updateUser = useCallback((updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('super_admin', JSON.stringify(newUser));
  }, [user]);

  return (
    <SuperAdminAuthContext.Provider value={{
      user,
      login,
      logout,
      updateUser,
      isAuthenticated: !!user,
      loading,
      authChecked
    }}>
      {children}
    </SuperAdminAuthContext.Provider>
  );
}

export const useSuperAdminAuth = () => {
  const context = useContext(SuperAdminAuthContext);
  if (!context) {
    throw new Error('useSuperAdminAuth must be used within a SuperAdminAuthProvider');
  }
  return context;
};