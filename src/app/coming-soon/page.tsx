'use client';
import BackArrow from '@/components/assets/icons/back';
import ComingSoonImage from '@/components/assets/svg/comingsoon.svg';
// import MainDashboard from '@/components/common/dashboard/main-dasboard';
// import Loading from '@/components/common/loadingState';
// import useAuth from '@/components/hook/useAuth';
import Image from 'next/image';

const ComingSoon = () => {
  // const isAuthenticated = useAuth();

  return (
    // <MainDashboard>
    //   {!isAuthenticated ? (
    //     <Loading />
    //   ) : (
    <>
      <BackArrow />
      <div className=''>
        <h1 className='uppercase text-center font-semibold text-lg text-[#000000] mt-3'>
          Coming Soon!!
        </h1>
        <p className='text-sm text-[#828282] text-center'>
          Stay tuned for something amazing
        </p>

        <Image
          src={ComingSoonImage}
          alt='Coming Soon'
          className='m-auto mt-8 '
        />
      </div>
    </>
    //   )}
    // </MainDashboard>
  );
};

export default ComingSoon;
