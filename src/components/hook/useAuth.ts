'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();
  const TOKEN_KEY = 'token';
  const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setIsAuthenticated(false);
    router.push('/');
  };

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      logout();
    } else {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.ok) {
            setIsAuthenticated(true);
          } else {
            logout();
          }
        })
        .catch(() => {
          logout();
        });
    }
  }, [router]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const resetTimeout = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => logout(), INACTIVITY_TIMEOUT);
    };

    // Attach event listeners to reset inactivity timer
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach((event) => window.addEventListener(event, resetTimeout));

    // Cleanup listeners
    return () => {
      clearTimeout(timeout);
      events.forEach((event) =>
        window.removeEventListener(event, resetTimeout)
      );
    };
  }, []);

  useEffect(() => {
    const handleTabClose = () => {
      localStorage.removeItem(TOKEN_KEY); // Clear token on tab close
    };

    window.addEventListener('beforeunload', handleTabClose);

    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
    };
  }, []);

  return isAuthenticated;
};

export default useAuth;
