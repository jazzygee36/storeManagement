'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@/components/state/store';
import HomeInput from '@/components/common/input';
import HomeButton from '@/components/common/button';
import { resetPasswordSchema } from '@/components/utils/validation';
import { z } from 'zod';
// import { useToast } from '@/components/hook/context/useContext';
import { resetPassword } from '@/components/api/slices/resetPasswordVerification'; // Adjust the import path as necessary

type FormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  // const { addToast } = useToast();
  // const showToast = () => {
  //   addToast('Password updated successfully', 'success');
  // };
  const router = useRouter();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [data, setData] = useState<FormData>({
    newPassword: '',
    confirmPassword: '',
  });
  const dispatch = useDispatch<AppDispatch>();
  const { message, loading, error } = useSelector(
    (state: RootState) => state.passwordReset
  );

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        router.push('/login'); // ✅ Redirect to login after success
      }, 200);
    }
  }, [message, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    // Validate input fields
    const result = resetPasswordSchema.safeParse(data);
    if (!result.success) {
      const validationErrors = result.error.format();
      setErrors({
        newPassword: validationErrors.newPassword?._errors[0] || '',
        confirmPassword: validationErrors.confirmPassword?._errors[0] || '',
      });
      return;
    }

    // Ensure token is available
    if (!token) {
      setErrors({ newPassword: 'Invalid or missing token. Try again.' });
      return;
    }

    // Dispatch the reset password action
    dispatch(resetPassword({ token, newPassword: data.newPassword }));
  };

  return (
    <div className='flex items-center justify-center h-screen'>
      <form
        onSubmit={handleSubmit}
        className='p-6 bg-white shadow-lg rounded-md w-96'
      >
        <h2 className='text-lg font-bold mb-4 text-center'>Reset Password</h2>

        <HomeInput
          type='password'
          placeholder='Enter new password'
          value={data.newPassword}
          onChange={(e) => setData({ ...data, newPassword: e.target.value })}
          //   className="w-full p-2 border rounded mb-3"
        />
        {errors.newPassword && (
          <p className='text-red-500 text-[13px]'>{errors.newPassword}</p>
        )}
        <div className='my-5'>
          <HomeInput
            type='password'
            placeholder='Confirm password'
            value={data.confirmPassword}
            onChange={(e) =>
              setData({ ...data, confirmPassword: e.target.value })
            }
            //   className="w-full p-2 border rounded mb-3"
          />
          {errors.confirmPassword && (
            <p className='text-red-500 text-[13px]'>{errors.confirmPassword}</p>
          )}
        </div>

        <HomeButton
          type='submit'
          className='w-full bg-purple-600 text-white py-2 rounded mt-5'
          disabled={loading}
          title={loading ? 'Resetting...' : 'Reset Password'}
          color={'white'}
        />

        {error && (
          <p className='text-red-500 mt-2 text-sm text-center'>{error}</p>
        )}
        {message && (
          <p className='text-green-500 mt-2 text-sm text-center'>
            {message} Redirecting...
          </p>
        )}
      </form>
    </div>
  );
};
const ResetPasswordMain = () => {
  return (
    <Suspense>
      <ResetPassword />
    </Suspense>
  );
};

export default ResetPasswordMain;
