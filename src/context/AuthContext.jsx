// context/AuthContext.jsx
'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const SuperAdminAuthContext = createContext();
const BASE_URL = 'https://cbt-simulator-backend.vercel.app';

// ─────────────────────────────────────────────────────────────────────────────
// iOS Safari ITP fix — every fetch that sends cookies must use these options:
//
//   mode: 'cors'       — iOS Safari requires this explicitly for cross-origin
//                        credentialed requests; omitting it silently blocks cookies
//   credentials: 'include' — send & receive httpOnly cookies cross-origin
//   cache: 'no-store'  — iOS Safari aggressively caches auth responses;
//                        without this a 200 can be served for a 401 endpoint
//   Accept header      — helps iOS classify the request as XHR, not navigation
// ─────────────────────────────────────────────────────────────────────────────
const IOS_SAFE_DEFAULTS = {
  mode: 'cors',
  credentials: 'include',
  cache: 'no-store',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

export function SuperAdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/me`, {
        method: 'GET',
        ...IOS_SAFE_DEFAULTS,
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        return true;
      } else {
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      return false;
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setAuthChecked(true);
    };
    initAuth();
  }, [checkAuth]);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        ...IOS_SAFE_DEFAULTS,
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.requiresTwoFactor || data.message === '2FA required') {
          return {
            requiresTwoFactor: true,
            userId: data.userId,
            tempToken: data.tempToken,
            message: data.message,
          };
        } else if (data.user) {
          // Set user immediately from login response
          setUser(data.user);

          // iOS Safari ITP: the Set-Cookie from login may not be
          // readable by the next request immediately. Silently re-confirm
          // the session once after a short tick so the cookie is committed.
          setTimeout(async () => {
            try {
              const confirmed = await fetch(`${BASE_URL}/api/auth/me`, {
                method: 'GET',
                ...IOS_SAFE_DEFAULTS,
              });
              if (confirmed.ok) {
                const confirmData = await confirmed.json();
                setUser(confirmData.user);
              }
            } catch (_) {
              // non-fatal — user is already set from login response
            }
          }, 250);

          return { success: true, user: data.user };
        }
      }

      return {
        success: false,
        message: data.message || 'Invalid credentials',
      };
    } catch (error) {
      console.error('Login error:', error);

      // Detect iOS CORS / network errors and give a clearer message
      const isNetworkError = error?.message?.toLowerCase().includes('network') ||
        error?.message?.toLowerCase().includes('failed to fetch') ||
        error?.message?.toLowerCase().includes('cors');

      return {
        success: false,
        message: isNetworkError
          ? 'Connection failed. Check your internet and try again. (If on iOS Safari, ensure "Prevent Cross-Site Tracking" allows this site.)'
          : 'Something went wrong. Please try again.',
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyTwoFactor = useCallback(async (userId, token, tempToken) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/auth/verify-2fa`, {
        method: 'POST',
        ...IOS_SAFE_DEFAULTS,
        body: JSON.stringify({ userId, token, tempToken }),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        setUser(data.user);
        return { success: true, user: data.user };
      }

      return {
        success: false,
        message: data.message || 'Invalid verification code',
      };
    } catch (error) {
      console.error('2FA verification error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.',
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${BASE_URL}/api/auth/logout`, {
        method: 'POST',
        ...IOS_SAFE_DEFAULTS,
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      toast.success('Logged out successfully');
      router.push('/login');
    }
  }, [router]);

  const fetchWithAuth = useCallback(async (endpoint, options = {}) => {
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${BASE_URL}/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const maxRetries = 1;
    let retryCount = 0;

    const executeFetch = async () => {
      try {
        const response = await fetch(url, {
          ...options,
          // iOS-safe defaults — merge with caller's options but keep credentials & mode
          mode: 'cors',
          credentials: 'include',
          cache: options.cache ?? 'no-store',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(options.headers || {}),
          },
        });

        if (response.status === 401 && retryCount < maxRetries) {
          retryCount++;

          // Attempt a silent token refresh
          const refreshResponse = await fetch(`${BASE_URL}/api/auth/refresh`, {
            method: 'POST',
            ...IOS_SAFE_DEFAULTS,
          });

          if (refreshResponse.ok) {
            const refreshed = await checkAuth();
            if (refreshed) {
              return executeFetch();
            }
          }

          // Refresh failed — clear session and redirect
          setUser(null);
          router.push('/login');
          toast.error('Session expired. Please login again.');
          return null;
        }

        return response;
      } catch (error) {
        console.error('Fetch error:', error);
        throw error;
      }
    };

    return executeFetch();
  }, [router, checkAuth]);

  const refreshUser = useCallback(async () => {
    return checkAuth();
  }, [checkAuth]);

  const updateUser = useCallback((updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  }, []);

  return (
    <SuperAdminAuthContext.Provider value={{
      user,
      login,
      logout,
      updateUser,
      refreshUser,
      verifyTwoFactor,
      fetchWithAuth,
      isAuthenticated: !!user,
      loading,
      authChecked,
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
