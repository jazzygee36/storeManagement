import React from 'react';
import HomeInput from '../input';
import NotificationIcon from '@/components/assets/icons/notification';
import DownArrow from '@/components/assets/icons/down-arrow';

const StaffHeader = () => {
  return (
    <div className='w-[100%] flex justify-between items-center px-2  relative top-2  bg-white rounded-lg m-auto'>
      {/* Sidebar Toggle Button */}
      {/* <button
        className='lg:hidden text-gray-700 text-xl'
        onClick={onToggleSidebar}
        aria-label='Toggle Sidebar'
      >
        ☰
      </button> */}

      {/* Search Input */}
      <div className='mb-5 flex-2 px-4 w-[100%] md:w-[50%]'>
        <HomeInput label={''} placeholder={'Search Products'} type={'text'} />
      </div>

      {/* Notification Icon */}
      <div className='flex items-center gap-2'>
        <NotificationIcon />
        <div className='w-8 h-8 bg-slate-400 rounded-full flex justify-center items-center text-white font-semibold text-sm'>
          AD
        </div>
        <DownArrow />
      </div>
    </div>
  );
};

export default StaffHeader;
