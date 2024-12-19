'use client';
import Image from 'next/image';
import Logo from '../../components/assets/svg/Logo.svg';
import SmallLogo from '../../components/assets/svg/smallLogo.svg';
import HomeInput from '@/components/common/input';
import HomeButton from '@/components/common/button';
import BackArrow from '@/components/assets/icons/back';

const Register = () => {
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
          <form className=' md:px-5 lg:px-[130px]'>
            <HomeInput
              label={'Name'}
              placeholder={'Enter your name'}
              type={'text'}
            />
            <HomeInput
              label={'Email'}
              placeholder={'Enter your email'}
              type={'text'}
            />
            <HomeInput
              label={'Password'}
              placeholder={'Enter your password'}
              type={'password'}
            />
            {/* <p className='text-[14px] text-[#D0D5DD]'>
            Must be at least 8 characters.
          </p> */}

            <p className='text-[14px] text-[#667085]  font-medium mb-5  cursor-pointer'>
              Must be at least 8 characters.
            </p>

            <HomeButton
              title={'Get Started'}
              bg={'#4285F4'}
              type={'Submit'}
              color='white'
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
