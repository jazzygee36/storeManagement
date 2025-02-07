'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/components/state/store';
import { verifyResetToken } from '@/components/api/slices/resetPasswordVerification';

const VerifyNewPassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { message, loading, error } = useSelector(
    (state: RootState) => state.passwordReset
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // Get token from URL

  useEffect(() => {
    if (token) {
      dispatch(verifyResetToken(token));
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        router.push(`/reset-password?token=${token}`); // ✅ Redirect to reset password page with token
      }, 2000);
    }
  }, [message, router, token]);

  return (
    <div className='flex items-center justify-center h-screen'>
      {loading ? (
        <p>Verifying token...</p>
      ) : error ? (
        <p className='text-red-500'>{error}</p>
      ) : message ? (
        <p className='text-green-500'>
          {message} Redirecting to reset password...
        </p>
      ) : (
        <p>No token provided.</p>
      )}
    </div>
  );
};
const VerifyNewPasswordMain = () => {
  return (
    <Suspense>
      <VerifyNewPassword />
    </Suspense>
  );
};

export default VerifyNewPasswordMain;
