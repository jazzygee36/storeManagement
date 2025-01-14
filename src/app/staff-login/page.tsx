'use client';
import Image from 'next/image';
import Logo from '../../components/assets/svg/Logo.svg';
import SmallLogo from '../../components/assets/svg/smallLogo.svg';
import HomeInput from '@/components/common/input';
import HomeButton from '@/components/common/button';
import BackArrow from '@/components/assets/icons/back';
import { useState } from 'react';
import { z } from 'zod';
import { createStaffSchema } from '@/components/utils/validation';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setStaffLogin } from '@/components/api/slices/staffLoginSlice';

type FormData = z.infer<typeof createStaffSchema>;

const StaffLogin = () => {
  const dispatch = useDispatch();
  const router = useRouter();
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
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/staff/login`,
        data
      );
      dispatch(setStaffLogin(res.data)); // Update Redux store
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('staffId', res.data.userId);

      router.push('/staff-dashboard'); // Redirect on success
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
    <>
      <BackArrow />
      <div className=' h-screen w-full grid grid-cols-1 md:grid-cols-2 items-center px-6'>
        <div className='hidden md:block m-auto'>
          <Image src={Logo} alt='logo' />
        </div>
        <div>
          <div className='mb-[24px] flex justify-center'>
            <Image src={SmallLogo} alt='logo' />
          </div>
          <h2 className='font-semibold text-[30px] text-[#101828] font-inter text-center'>
            Staff login
          </h2>
          <p className='text-[#667085] text-[16px] mt-3 mb-8 text-center'>
            Welcome back! Please enter your details.
          </p>
          <form onSubmit={handleStaffLogin} className=' md:px-5 lg:px-[130px]'>
            <HomeInput
              label={'Username'}
              placeholder={'Enter your username'}
              type={'text'}
              value={data.username}
              name='username'
              onChange={handleChange}
              mt='5'
            />
            {errors.username && (
              <p className='text-red-500 text-[13px]'>{errors.username}</p>
            )}
            <HomeInput
              label={'Phone number'}
              placeholder={'Enter your password'}
              type={'number'}
              value={data.phoneNumber}
              name='phoneNumber'
              onChange={handleChange}
              mt='5'
            />
            {errors.phoneNumber && (
              <p className='text-red-500 text-[13px]'>{errors.phoneNumber}</p>
            )}

            {errors.general && (
              <p className='text-red-500 text-[13px] text-center mt-4'>
                {errors.general}
              </p>
            )}
            <div className='mt-5'>
              <HomeButton
                title={loading ? 'LOADING...' : 'LOGIN'}
                bg={'#4285F4'}
                type={'submit'}
                color='white'
              />
            </div>
          </form>
          <div className='mt-2'>
            {/* <h3 className='text-center'>
              Dont have an account?{' '}
              <span
                className='text-[#4285F4] cursor-pointer'
                onClick={() => {
                  window.location.href = '/register';
                }}
              >
                Sign up
              </span>
            </h3> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffLogin;
