'use client';
// src/app/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token'); // Get token from localStorage

    if (!token) {
      router.push('/admin-login'); // Redirect to login if no token
    } else {
      fetch('/api/auth/verifyToken', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.ok) {
            setIsAuthenticated(true); // Token is valid
          } else {
            router.push('/admin-login'); // Redirect to login if token is invalid
          }
        })
        .catch(() => {
          router.push('/admin-login'); // Redirect on error
        });
    }
  }, [router]);

  return isAuthenticated;
};

export default useAuth;
