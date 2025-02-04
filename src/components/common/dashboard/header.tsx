'use client';
import React, { useEffect, useState } from 'react';
import NotificationIcon from '@/components/assets/icons/notification';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const [companyName, setCompanyName] = useState<string>('');

  useEffect(() => {
    const storedName = localStorage.getItem('companyName');
    setCompanyName(storedName || '');
  }, []);
  return (
    <div className='fixed right-0 left-0 w-full z-50   flex justify-between items-center px-5 py-3   bg-white shadow'>
      {/* Sidebar Toggle Button */}
      <button
        className='lg:hidden text-gray-700 text-xl'
        onClick={onToggleSidebar}
        aria-label='Toggle Sidebar'
      >
        ☰
      </button>

      {/* Search Input */}
      <div className='   text-1xl'>Manage your store</div>

      {/* Notification Icon */}
      <div className='flex items-center gap-2'>
        <NotificationIcon />
        <div className='w-8 h-8 bg-purple-600 rounded-full uppercase flex justify-center items-center text-white font-semibold text-sm'>
          {companyName?.slice(0, 2)}
        </div>
      </div>
    </div>
  );
};

export default Header;
