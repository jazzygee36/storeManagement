'use client';

import { Suspense, useEffect } from 'react';
import { verifyEmail } from '@/components/api/slices/emailVerificationSlice';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@/components/state/store';

const VerifyEmail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { message, loading, error } = useSelector(
    (state: RootState) => state.emailVerification
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // Get token from URL

  useEffect(() => {
    if (token) {
      dispatch(verifyEmail(token));
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        router.push('/login'); // ✅ Redirect to login page after success
      }, 200); // Wait for 2 seconds before redirecting
    }
  }, [message, router]);

  return (
    <div className='flex items-center justify-center h-screen'>
      {loading ? (
        <p>Verifying your email...</p>
      ) : error ? (
        <p className='text-red-500'>{error}</p>
      ) : message ? (
        <p className='text-green-500'>{message} Redirecting to login...</p>
      ) : (
        <p>No token provided.</p>
      )}
    </div>
  );
};
const VerifyEmailMain = () => {
  return (
    <Suspense>
      <VerifyEmail />
    </Suspense>
  );
};

export default VerifyEmailMain;
