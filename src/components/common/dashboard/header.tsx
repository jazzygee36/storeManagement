import React from 'react';
import HomeInput from '../input';
import NotificationIcon from '@/components/assets/icons/notification';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  return (
    <div className='w-full flex justify-between items-center px-5 relative'>
      {/* Sidebar Toggle Button */}
      <button
        className='lg:hidden text-gray-700 text-xl'
        onClick={onToggleSidebar}
        aria-label='Toggle Sidebar'
      >
        ☰
      </button>

      {/* Search Input */}
      <div className='mb-5 flex-1 px-4 w-[40%]'>
        <HomeInput label={''} placeholder={'Search Products'} type={'text'} />
      </div>

      {/* Notification Icon */}
      <div>
        <NotificationIcon />
      </div>
    </div>
  );
};

export default Header;
