'use client';
import BackArrow from '@/components/assets/icons/back';
import HomeButton from '@/components/common/button';
import HomeInput from '@/components/common/input';
import { useToast } from '@/components/hook/context/useContext';
import axios from 'axios';
import { FormEvent, useState } from 'react';

const ForgetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');

  const { addToast } = useToast();
  const showToast = () => {
    addToast(' Must be a valid email', 'error');
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEmailSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email.trim() && validateEmail(email)) {
      axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/request-password-reset`, {
        email,
      });

      setStep(2);
    } else {
      showToast();
    }
  };

  return (
    <>
      <BackArrow />
      <div className='h-screen flex flex-col justify-center m-auto w-[90%] md:w-[50%] lg:w-[30%]'>
        {step === 1 && (
          <>
            <h1 className='font-semibold text-center text-xl mb-2'>
              Forget Password
            </h1>
            <p className='text-center text-gray-500 text-sm'>
              Please enter your email to reset the password
            </p>
            <form onSubmit={handleEmailSubmit} className='my-7'>
              <HomeInput
                label='Your Email'
                placeholder='Enter your email'
                value={email}
                onChange={handleEmailChange}
              />
              <HomeButton
                title='Send link'
                color='white'
                className='bg-purple-600 mt-4 w-full'
                type='submit'
              />
            </form>
          </>
        )}
        {step === 2 && (
          <>
            <h1 className='font-semibold text-center text-xl mb-2'>
              Verification Link
            </h1>
            <p className='text-center text-gray-500 text-sm'>
              A verification link has been sent to the email you provided,
              please check your email and click on the reset link to continue.
            </p>

            <p
              className='text-center text-sm font-inter my-7'
              onClick={handleEmailSubmit}
            >
              {' '}
              Haven’t got the email yet?{' '}
              <span className='text-purple-600 hover:underline cursor-pointer'>
                Resend email
              </span>
            </p>
          </>
        )}
      </div>
    </>
  );
};

export default ForgetPassword;
