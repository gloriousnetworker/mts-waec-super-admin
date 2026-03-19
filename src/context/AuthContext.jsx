// context/AuthContext.jsx
'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const SuperAdminAuthContext = createContext();

// All API calls go through the same-origin proxy so iOS Safari (ITP) never
// blocks cross-origin cookies. The proxy lives at /api/proxy and forwards
// requests server-side to the real backend at:
//   https://cbt-simulator-backend.vercel.app
const PROXY = '/api/proxy';

// localStorage keys for user cache (offline / cold-start support)
const CACHE_KEY = 'cbt_superadmin_cache';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

function loadCachedUser() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { user, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return user;
  } catch {
    return null;
  }
}

function saveCachedUser(user) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ user, ts: Date.now() }));
  } catch {}
}

function clearAuthCache() {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {}
}

export function SuperAdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  // soft = true  → background refresh: never clears user on failure
  //                 (used when we already have a cached session)
  // soft = false → hard check: clears user + cache on 401
  //                 (used on cold start with no cache)
  const checkAuth = useCallback(async (soft = false) => {
    try {
      const response = await fetch(`${PROXY}/auth/me`, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        saveCachedUser(data.user);
        return true;
      } else {
        if (!soft) {
          setUser(null);
          clearAuthCache();
        }
        return false;
      }
    } catch (error) {
      // Network error — never clear an existing session
      console.error('Auth check error:', error);
      return false;
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const cached = loadCachedUser();

      if (cached) {
        // Trust the cache immediately — prevents login flash on mobile PWA
        setUser(cached);
        setAuthChecked(true);
        // Soft refresh in background — updates cache if server confirms session
        checkAuth(true);
        return;
      }

      // No cache — do a hard server check
      await checkAuth(false);
      setAuthChecked(true);
    };

    initAuth();
  }, [checkAuth]);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${PROXY}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        cache: 'no-store',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // 2FA required — no cookies set yet, just a tempToken
        if (data.requiresTwoFactor || data.message === '2FA required') {
          return {
            requiresTwoFactor: true,
            userId: data.userId,
            tempToken: data.tempToken,
            message: data.message,
          };
        }

        // Direct login success — cookies set by the proxy on same origin
        if (data.user) {
          setUser(data.user);
          saveCachedUser(data.user);
          return { success: true, user: data.user };
        }
      }

      return {
        success: false,
        message: data.message || 'Invalid credentials',
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyTwoFactor = useCallback(async (userId, token, tempToken) => {
    setLoading(true);
    try {
      const response = await fetch(`${PROXY}/auth/verify-2fa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        cache: 'no-store',
        body: JSON.stringify({ userId, token, tempToken }),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        // The proxy has forwarded the backend's Set-Cookie to the browser
        // as a same-origin cookie — no iOS ITP delay, no race condition.
        setUser(data.user);
        saveCachedUser(data.user);
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
      await fetch(`${PROXY}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      clearAuthCache();
      toast.success('Logged out successfully');
      router.push('/login');
    }
  }, [router]);

  const fetchWithAuth = useCallback(async (endpoint, options = {}) => {
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${PROXY}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const maxRetries = 1;
    let retryCount = 0;

    const executeFetch = async () => {
      try {
        const response = await fetch(url, {
          ...options,
          credentials: 'include',
          cache: options.cache ?? 'no-store',
          headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
          },
        });

        if (response.status === 401 && retryCount < maxRetries) {
          retryCount++;

          // Attempt a silent token refresh via the proxy
          const refreshResponse = await fetch(`${PROXY}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
            cache: 'no-store',
          });

          if (refreshResponse.ok) {
            const refreshed = await checkAuth();
            if (refreshed) {
              return executeFetch();
            }
          }

          // Refresh failed — clear session and redirect
          setUser(null);
          clearAuthCache();
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
