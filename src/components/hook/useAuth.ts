'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();
  const TOKEN_KEY = 'token';
  const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
    setIsAuthenticated(false);
    router.push('/');
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

    const debounce = (fn: () => void, delay: number) => {
      let timer: NodeJS.Timeout;
      return () => {
        clearTimeout(timer);
        timer = setTimeout(fn, delay);
      };
    };

    const resetTimeout = debounce(() => {
      logout();
    }, INACTIVITY_TIMEOUT);

    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach((event) => window.addEventListener(event, resetTimeout));

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, resetTimeout)
      );
    };
  }, [INACTIVITY_TIMEOUT]);

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
