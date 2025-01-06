'use client';
import Image from 'next/image';
import Logo from '../../components/assets/svg/Logo.svg';
import SmallLogo from '../../components/assets/svg/smallLogo.svg';
import HomeInput from '@/components/common/input';
import HomeButton from '@/components/common/button';
import BackArrow from '@/components/assets/icons/back';
import { z } from 'zod';
import { registerSchema } from '@/components/utils/validation';
import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setUserSignUp } from '@/components/api/slices/signUpSlice';

type FormData = z.infer<typeof registerSchema>;

const Register = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [data, setData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  console.log('errors', errors);
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

      router.push('/admin-login'); // Redirect on success
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
            Create an Account
          </h2>
          <p className='text-[#667085] text-[16px] mt-3 mb-8 text-center'>
            Star your 30-days free trial
          </p>
          <form
            onSubmit={handleRegisterSubmit}
            className=' md:px-5 lg:px-[130px]'
          >
            <HomeInput
              label={'Username'}
              placeholder={'Enter your username'}
              type={'text'}
              name='username'
              value={data.username}
              onChange={handleChange}
            />
            {errors.username && (
              <p className='text-red-500 text-[13px]'>{errors.username}</p>
            )}
            <HomeInput
              label={'Email'}
              placeholder={'Enter your email'}
              type={'email'}
              name='email'
              value={data.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className='text-red-500 text-[13px]'>{errors.email}</p>
            )}
            <HomeInput
              label={'Password'}
              placeholder={'Enter your password'}
              type={'password'}
              name='password'
              value={data.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className='text-red-500 text-[13px]'>{errors.password}</p>
            )}
            {/* <p className='text-[14px] text-[#D0D5DD]'>
            Must be at least 8 characters.
          </p> */}

            <p className='text-[14px] text-[#667085]  font-medium mb-5  cursor-pointer'>
              Must be at least 8 characters.
            </p>
            {errors && (
              <p className='text-center text-[red]'>{errors.general}</p>
            )}
            <HomeButton
              title={loading ? 'LOADING...' : 'Get Started'}
              bg={'#4285F4'}
              type={'submit'}
              color='white'
              disabled={loading}
            />
          </form>
          <div className='mt-2'>
            <h3 className='text-center'>
              Already have an account?{' '}
              <span
                className='text-[#4285F4] cursor-pointer'
                onClick={() => {
                  window.location.href = '/';
                }}
              >
                Log in
              </span>
            </h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
