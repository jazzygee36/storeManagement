'use client';
import Image from 'next/image';
import Logo from '../../components/assets/svg/Logo.svg';
import SmallLogo from '../../components/assets/svg/smallLogo.svg';
import HomeInput from '@/components/common/input';
import HomeButton from '@/components/common/button';
import BackArrow from '@/components/assets/icons/back';
import { useState } from 'react';
import { z } from 'zod';
import { staffLoginSchema } from '@/components/utils/validation';

type FormData = z.infer<typeof staffLoginSchema>;

const StaffLogin = () => {
  const [data, setData] = useState<FormData>({
    username: '',
    phoneNumber: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = staffLoginSchema.safeParse(data);

    if (!result.success) {
      const validationErrors = result.error.format();
      setErrors({
        username: validationErrors.username?._errors[0] || '',
        password: validationErrors.phoneNumber?._errors[0] || '',
      });
      console.log('Staff Login');
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
            />
            {errors.username && (
              <p className='text-red-500 text-[13px]'>{errors.username}</p>
            )}
            <HomeInput
              label={'Password'}
              placeholder={'Enter your password'}
              type={'password'}
              value={data.phoneNumber}
              name='password'
              onChange={handleChange}
            />
            {errors.password && (
              <p className='text-red-500 text-[13px]'>{errors.password}</p>
            )}
            <p className='text-[14px] text-[#4285F4] py-5 text-right cursor-pointer'>
              {/* Forget Password? */}
            </p>
            <HomeButton
              title={'Login'}
              bg={'#4285F4'}
              type={'submit'}
              color='white'
              // onClick={() => (window.location.href = '/staff-dashboard')}
            />
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
