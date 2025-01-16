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

function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
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
      setLoading(true);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/register`,
        data
      );
      dispatch(setUserSignUp(res.data)); // Update Redux store

      router.push('/'); // Redirect on success
      setLoading(false);
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
        'h-screen flex flex-col gap-6 m-auto w-full items-center justify-center',
        className
      )}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl text-center'>
            Create an Account
          </CardTitle>
          <CardDescription>
            Welcome to StockTaker! we give you control over your business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegisterSubmit}>
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
                color={'white'}
              />
            </div>
          </form>
          <div className='mt-4 text-center text-sm w-full'>
            Alredy have an account?{' '}
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
    // <div className='hidden md:block m-auto'>
    //   {/* <Image src={Logo} alt='logo' /> */}
    //   Welcome to StockTaker
    // </div>
    /* <div>
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
              mt='5'
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
              mt='5'
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
              mt='5'
            />
            {errors.password && (
              <p className='text-red-500 text-[13px]'>{errors.password}</p>
            )}
            {/* <p className='text-[14px] text-[#D0D5DD]'>
            Must be at least 8 characters.
          </p> */

    /* <p className='text-[14px] text-[#667085]  font-medium mb-5  cursor-pointer'>
              Must be at least 8 characters.
            </p>
            {errors && (
              <p className='text-center text-[red]'>{errors.general}</p>
            )}
            <HomeButton
              title={loading ? 'LOADING...' : 'Get Started'}
              type={'submit'}
              color='white'
              disabled={loading}
            />
          </form>
          
        </div> */

    // </>
  );
}

export default RegisterForm;
