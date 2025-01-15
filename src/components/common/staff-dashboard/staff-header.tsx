'use client';
import React, { useState, useEffect, useRef } from 'react';
import NotificationIcon from '@/components/assets/icons/notification';
import { useRouter } from 'next/navigation';
import DownArrow from '@/components/assets/icons/down-arrow';

const Navigation = [
  {
    description: 'Store',
    path: '/staff-store',
  },
  {
    description: 'Sell-Product',
    path: '/staff-sales',
  },
  {
    description: 'Daily-sales-report',
    path: 'staff-sales-report',
  },
];

const StaffHeader = () => {
  const router = useRouter();
  const [activePath, setActivePath] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null); // Ref for the menu container

  useEffect(() => {
    // Set the active path based on the current URL
    setActivePath(window.location.pathname);
  }, []);

  useEffect(() => {
    // Close menu if clicking outside of it
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavigation = (path: string) => {
    setActivePath(path);
    router.push(path);
    setIsMenuOpen(false);
  };

  const handleLogOut = () => {
    localStorage.clear();
    router.push('/');
  };

  return (
    <div className='w-[100%] flex justify-between items-center px-5 py-3 bg-white rounded-lg shadow-md m-auto'>
      {/* Title or Search Input */}
      <div className='w-[100%] md:w-[50%]'>
        <h1>Items in stock</h1>
      </div>

      {/* Notification and Profile Section */}
      <div className='flex items-center gap-4'>
        <NotificationIcon />
        <div className='w-8 h-8 bg-slate-400 rounded-full flex justify-center items-center text-white font-semibold text-sm'>
          AD
        </div>

        {/* Dropdown Menu */}
        <div className='relative' ref={menuRef}>
          <DownArrow onClick={() => setIsMenuOpen((prev) => !prev)} />

          {isMenuOpen && (
            <div className='absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border'>
              {Navigation.map((navigate) => (
                <button
                  key={navigate.description}
                  className={`block w-full text-left px-4 py-2 hover:bg-blue-100 ${
                    activePath === navigate.path
                      ? 'text-blue-500 font-semibold'
                      : 'text-gray-700'
                  }`}
                  onClick={() => handleNavigation(navigate.path)}
                >
                  {navigate.description}
                </button>
              ))}
              <div
                onClick={handleLogOut}
                className=' cursor-pointer text-[red] rounded-md focus:outline-none block w-full text-left px-4 py-2'
              >
                Log Out
              </div>
            </div>
          )}
        </div>

        {/* Logout Button */}
      </div>
    </div>
  );
};

export default StaffHeader;
