'use client';
import Image from 'next/image';
import Logo from '../../components/assets/svg/Logo.svg';
import SmallLogo from '../../components/assets/svg/smallLogo.svg';
import HomeInput from '@/components/common/input';
import HomeButton from '@/components/common/button';
import BackArrow from '@/components/assets/icons/back';

const StaffLogin = () => {
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
          <form className=' md:px-5 lg:px-[130px]'>
            <HomeInput
              label={'Username'}
              placeholder={'Enter your username'}
              type={'text'}
            />
            <HomeInput
              label={'Password'}
              placeholder={'Enter your password'}
              type={'password'}
            />
            <p className='text-[14px] text-[#4285F4] py-5 text-right cursor-pointer'>
              {/* Forget Password? */}
            </p>
            <HomeButton
              title={'Login'}
              bg={'#4285F4'}
              type={'Submit'}
              color='white'
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
