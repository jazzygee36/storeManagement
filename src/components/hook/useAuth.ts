'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();
  const TOKEN_KEY = 'token';
  const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  let timeoutId: NodeJS.Timeout | null = null;

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
    setIsAuthenticated(false);
    router.push('/');
  };

  const resetTimeout = () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(logout, INACTIVITY_TIMEOUT);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      logout();
      return;
    }

    const abortController = new AbortController();

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: abortController.signal,
    })
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          logout();
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Auth fetch error:', err);
          logout();
        }
      });

    return () => abortController.abort();
  }, [router]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleActivity = () => {
      resetTimeout();
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach((event) => window.addEventListener(event, handleActivity));

    // Start the inactivity timeout when the component is mounted
    resetTimeout();

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, handleActivity)
      );
      if (timeoutId) clearTimeout(timeoutId); // Cleanup timeout on unmount
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleTabClose = () => {
      localStorage.removeItem(TOKEN_KEY);
    };

    window.addEventListener('beforeunload', handleTabClose);

    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
    };
  }, []);

  return isAuthenticated;
};

export default useAuth;
