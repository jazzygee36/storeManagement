'use client';
import { useState } from 'react';
import { z } from 'zod';
import { createStaffSchema } from '@/components/utils/validation';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setStaffLogin } from '@/components/api/slices/staffLoginSlice';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import HomeInput from '@/components/common/input';
import HomeButton from '@/components/common/button';
import Loading from '@/components/common/loadingState';
import { useToast } from '@/components/hook/context/useContext';

type FormData = z.infer<typeof createStaffSchema>;

function StaffLoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const showToast = () => {
    addToast(' Successfully login', 'success');
  };

  const [data, setData] = useState<FormData>({
    username: '',
    phoneNumber: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = createStaffSchema.safeParse(data);
    if (!result.success) {
      const validationErrors = result.error.format();
      setErrors({
        username: validationErrors.username?._errors[0] || '',
        phoneNumber: validationErrors.phoneNumber?._errors[0] || '',
      });
      return; // Exit if validation fails
    }
    setLoading(true);

    try {
      setLoading(true);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/staff/login`,
        data
      );
      if (res.data.message === 'Login successful') {
        showToast();
        dispatch(setStaffLogin(res.data)); // Update Redux store
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('staffId', res.data.staffId);
      }

      router.push('/staff-store'); // Redirect on success
      setLoading(false);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setErrors({
          general:
            err.response.data?.message ||
            'Invalid email or password. Please try again.',
        });
      } else {
        setErrors({
          general: 'An unexpected error occurred. Please try again.',
        });
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className={cn(
        'h-screen flex flex-col gap-6 m-auto w-full   items-center ',
        className
      )}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl text-center'>Staff Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleStaffLogin}>
            {errors.general && (
              <p className='text-red-500 text-[13px] text-center '>
                {errors.general}
              </p>
            )}
            <div className='flex flex-col gap-6'>
              <div>
                <HomeInput
                  label='Username'
                  type='text'
                  placeholder='Username'
                  // required
                  value={data.username}
                  name='username'
                  onChange={handleChange}
                />
                {errors.username && (
                  <p className='text-red-500 text-[13px]'>{errors.username}</p>
                )}
              </div>
              <div className='grid gap-2'>
                <HomeInput
                  label='Password'
                  type='password'
                  placeholder='Enter password'
                  value={data.phoneNumber}
                  name='phoneNumber'
                  onChange={handleChange}
                />
                {errors.phoneNumber && (
                  <p className='text-red-500 text-[13px]'>
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              <HomeButton
                type='submit'
                title={loading ? <Loading /> : 'Login'}
                color={'white'}
                className='bg-purple-600'
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
export default StaffLoginForm;
