'use client';
import AdminIcon from '@/components/assets/icons/admin';
import StaffIcon from '@/components/assets/icons/staff';
import SmallLogo from '@/components/assets/svg/smallLogo.svg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <>
      <div className='flex justify-end absolute right-2 top-2'>
        <Image src={SmallLogo} alt='smallLogo' />
      </div>
      <div className='text-center h-screen w-[90%] md:w-[45%] m-auto  flex flex-col items-center justify-center'>
        <h3 className='text-[20px] font-inter mb-6 '>
          Welcome to Store Management, How do you want to sign-in?
        </h3>
        <div className='grid grid-cols-2 justify-center gap-5'>
          <div
            onClick={() => {
              window.location.href = '/admin-login';
            }}
            className='border border-[#D0D5DD] text-center font-inter font-medium p-5 rounded-md cursor-pointer'
          >
            <div className='flex justify-center mb-5'>
              <AdminIcon />
            </div>
            <h5>Admin Login</h5>
          </div>
          <div
            onClick={() => {
              router.push('/staff-login');
            }}
            className='border border-[#D0D5DD] text-center font-inter font-medium p-5 rounded-md cursor-pointer '
          >
            <div className='flex justify-center mb-5'>
              <StaffIcon />
            </div>
            <h5>Staff Login</h5>
          </div>
        </div>
        <div className='mt-4'>
          <h3 className='text-center'>
            Don&apos;t have an account?{' '}
            <span
              className='text-[#4285F4] cursor-pointer'
              onClick={() => {
                router.push('/register');
              }}
            >
              Sign up
            </span>
          </h3>
        </div>
      </div>
    </>
  );
}
