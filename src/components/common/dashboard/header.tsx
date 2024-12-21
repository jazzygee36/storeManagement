import React from 'react';
import HomeInput from '../input';
import NotificationIcon from '@/components/assets/icons/notification';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  return (
    <div className='w-full flex justify-between items-center px-5  bg-gray-100'>
      {/* Sidebar Toggle Button */}
      <button
        className='lg:hidden text-gray-700 text-xl'
        onClick={onToggleSidebar}
        aria-label='Toggle Sidebar'
      >
        ☰
      </button>

      {/* Search Input */}
      <div className='mb-5 flex-2 px-4 w-[50%]'>
        <HomeInput label={''} placeholder={'Search Products'} type={'text'} />
      </div>

      {/* Notification Icon */}
      <div className='flex items-center gap-2'>
        <NotificationIcon />
        <div className='w-8 h-8 bg-slate-400 rounded-full flex justify-center items-center text-white font-semibold text-sm'>
          AD
        </div>
      </div>
    </div>
  );
};

export default Header;
