'use client';

import Image from 'next/image';
import Logo from '../../components/assets/svg/Logo.svg';
import SmallLogo from '../../components/assets/svg/smallLogo.svg';
import HomeInput from '@/components/common/input';
import HomeButton from '@/components/common/button';
import BackArrow from '@/components/assets/icons/back';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { loginSchema } from '@/components/utils/validation';
import { useDispatch } from 'react-redux';
import { setUserLogin } from '@/components/api/slices/loginSlice';
// import { fetchUserProfile } from '@/components/api/slices/userProfileSlice';

type FormData = z.infer<typeof loginSchema>;

const AdminLogin = () => {
  const dispatch = useDispatch();
  const router = useRouter();

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
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
        data
      );
      dispatch(setUserLogin(res.data)); // Update Redux store
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.userId);

      router.push('/admin-dashboard'); // Redirect on success
    } catch (err) {
      console.error('Login failed:', err);
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
    <>
      <BackArrow />
      <div className='h-screen w-full grid grid-cols-1 md:grid-cols-2 items-center px-6'>
        <div className='hidden md:block m-auto'>
          <Image src={Logo} alt='logo' />
        </div>
        <div>
          <div className='mb-[24px] flex justify-center'>
            <Image src={SmallLogo} alt='logo' />
          </div>
          <h2 className='font-semibold text-[30px] text-[#101828] font-inter text-center'>
            Admin login
          </h2>
          <p className='text-[#667085] text-[16px] mt-3 mb-8 text-center'>
            Welcome back! Please enter your details.
          </p>
          <form onSubmit={handleLoginSubmit} className='md:px-5 lg:px-[130px]'>
            <HomeInput
              label='Email'
              placeholder='Enter your email'
              type='text'
              value={data.email}
              name='email'
              onChange={handleChange}
              mt='5'
            />
            {errors.email && (
              <p className='text-red-500 text-[13px]'>{errors.email}</p>
            )}

            <HomeInput
              label='Password'
              placeholder='Enter your password'
              type='password'
              value={data.password}
              name='password'
              onChange={handleChange}
              mt='5'
            />
            {errors.password && (
              <p className='text-red-500 text-[13px]'>{errors.password}</p>
            )}

            {errors.general && (
              <p className='text-red-500 text-[13px] text-center mt-4'>
                {errors.general}
              </p>
            )}

            <p className='text-[14px] text-[#4285F4] py-5 text-right cursor-pointer'>
              Forgot Password?
            </p>
            <HomeButton
              title={loading ? 'LOADING...' : 'LOGIN'}
              bg='#4285F4'
              type='submit'
              color='white'
              disabled={loading}
            />
          </form>
          <div className='mt-2'>
            <h3 className='text-center'>
              Don&apos;t have an account?{' '}
              <span
                className='text-[#4285F4] cursor-pointer'
                onClick={() => router.push('/register')}
              >
                Sign up
              </span>
            </h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
