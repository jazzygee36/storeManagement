// src/app/register/page.tsx
'use client';

import HomeInput from '@/components/common/input';
import HomeButton from '@/components/common/button';
import { z } from 'zod';
import { registerSchema } from '@/components/utils/validation';
import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setUserSignUp } from '@/components/api/slices/signUpSlice';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Loading from '@/components/common/loadingState';

type FormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [data, setData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = registerSchema.safeParse(data);

    if (!result.success) {
      const validationErrors = result.error.format();
      setErrors({
        email: validationErrors.email?._errors[0] || '',
        password: validationErrors.password?._errors[0] || '',
        username: validationErrors.username?._errors[0] || '',
      });
      return; // Exit if validation fails
    }

    setLoading(true);
    setErrors({}); // Clear errors before submission

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/register`,
        data
      );
      dispatch(setUserSignUp(res.data)); // Update Redux store
      router.push('/'); // Redirect on success
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.data?.message) {
          setErrors({ general: err.response.data.message });
        } else if (err.response?.data?.errors) {
          setErrors(err.response.data.errors);
        } else {
          setErrors({ general: 'An error occurred. Please try again later.' });
        }
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
        'h-screen flex flex-col gap-6 m-auto w-full items-center justify-center'
      )}
    >
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl text-center'>
            Create an Account
          </CardTitle>
          <CardDescription>
            Welcome to StockTaker! We give you control over your business.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegisterSubmit}>
            {errors.general && (
              <p className='text-red-500 text-[13px] text-center'>
                {errors.general}
              </p>
            )}
            <div className='flex flex-col gap-6'>
              <div>
                <HomeInput
                  label='Username'
                  type='text'
                  placeholder='Username'
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
                  label='Email'
                  type='email'
                  placeholder='Enter Email'
                  value={data.email}
                  name='email'
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className='text-red-500 text-[13px]'>{errors.email}</p>
                )}
              </div>
              <div className='grid gap-2'>
                <HomeInput
                  label='Password'
                  type='password'
                  placeholder='Enter Password'
                  value={data.password}
                  name='password'
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className='text-red-500 text-[13px]'>{errors.password}</p>
                )}
              </div>
              <HomeButton
                type='submit'
                title={loading ? <Loading /> : 'Sign up'}
                color='white'
              />
            </div>
          </form>
          <div className='mt-4 text-center text-sm w-full'>
            Already have an account?{' '}
            <span
              className='underline underline-offset-4 cursor-pointer text-blue-600'
              onClick={() => router.push('/')}
            >
              Login
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
