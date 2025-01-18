'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();
  const TOKEN_KEY = 'token';

  const logout = () => {
    if (typeof window !== 'undefined') {
      // localStorage.removeItem(TOKEN_KEY);
    }
    setIsAuthenticated(false);
    router.push('/');
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setIsAuthenticated(false); // User is not authenticated
      return;
    }

    const abortController = new AbortController();

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: abortController.signal,
    })
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(true); // User is authenticated
        } else {
          logout(); // Invalid token, log out
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Auth fetch error:', err);
          logout(); // Log out on error
        }
      });

    return () => abortController.abort();
  }, []);

  return isAuthenticated;
};

export default useAuth;
