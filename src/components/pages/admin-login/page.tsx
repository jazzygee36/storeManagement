'use client';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { loginSchema } from '@/components/utils/validation';
import { useDispatch } from 'react-redux';
import { setUserLogin } from '@/components/api/slices/loginSlice';
// import { fetchUserProfile } from '@/components/api/slices/userProfileSlice';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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

type FormData = z.infer<typeof loginSchema>;

function AdminLoginForm({
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
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = loginSchema.safeParse(data);

    if (!result.success) {
      const validationErrors = result.error.format();
      setErrors({
        email: validationErrors.email?._errors[0] || '',
        password: validationErrors.password?._errors[0] || '',
      });
      return; // Exit if validation fails
    }

    setLoading(true);
    setErrors({}); // Clear errors before submission

    try {
      setLoading(true);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
        data
      );
      if (res.data.message === 'Login successfully') {
        showToast();
        dispatch(setUserLogin(res.data)); // Update Redux store
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userId', res.data.userId);
        localStorage.setItem('companyName', res.data.companyName);
      }

      router.push('/admin-dashboard'); // Redirect on success
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
          <CardTitle className='text-2xl text-center'>Admin Login</CardTitle>
          <CardDescription>
            Welcome to StockTaker! Enter your details below to login.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLoginSubmit}>
            {errors.general && (
              <p className='text-red-500 text-[13px] text-center '>
                {errors.general}
              </p>
            )}
            <div className='flex flex-col gap-6'>
              <div>
                <HomeInput
                  label='Email'
                  type='email'
                  placeholder='m@example.com'
                  // required
                  value={data.email}
                  name='email'
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className='text-red-500 text-[13px]'>{errors.email}</p>
                )}
              </div>
              <div className='grid gap-2'>
                {/* <div className='flex items-center'>
                  <Label htmlFor='password'>Password</Label>
                  <a
                    href='#'
                    className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
                  >
                    Forgot your password?
                  </a>
                </div> */}
                <HomeInput
                  label='Password'
                  type='password'
                  placeholder='Enter password'
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
                title={loading ? <Loading /> : 'Login'}
                color={'white'}
                className='bg-purple-600'
              />

              <Button variant='outline' className='w-full'>
                Login with Google
              </Button>
            </div>
            <div className='mt-4 text-center text-sm'>
              Don&apos;t have an account?{' '}
              <span
                className='underline underline-offset-4 cursor-pointer text-blue-700'
                onClick={() => router.push('/register')}
              >
                Sign up
              </span>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
export default AdminLoginForm;
