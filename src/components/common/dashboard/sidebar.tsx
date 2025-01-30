'use client';
import { useState, useEffect } from 'react';
import DashbaordIcon from '@/components/assets/icons/dashboard';
import InventoryIcon from '@/components/assets/icons/inventory';
import StoreIcon from '@/components/assets/icons/store';
import BookIcon from '@/components/assets/icons/book';
import LogoutIcon from '@/components/assets/icons/logout';
import { useRouter } from 'next/navigation';

const Navigation = [
  {
    icon: <DashbaordIcon />,
    description: 'Dashboard',
    path: '/admin-dashboard',
  },
  {
    icon: <InventoryIcon />,
    description: 'Products',
    path: '/admin-inventory',
  },
  {
    icon: <BookIcon />,
    description: 'Daily Sales Report',
    path: '/admin-reports',
  },
  {
    icon: <StoreIcon />,
    description: 'Create Staff',
    path: '/admin-staff',
  },
];

const Sidebar = () => {
  const router = useRouter();
  const [activePath, setActivePath] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');

  useEffect(() => {
    const storedName = localStorage.getItem('companyName');
    setCompanyName(storedName || '');
  }, []);

  useEffect(() => {
    // Set the active path based on the current URL
    setActivePath(window.location.pathname);
  }, []);

  const handleNavigation = (path: string) => {
    setActivePath(path); // Update active state
    router.push(path); // Navigate to the selected path
  };

  const handleLogOut = () => {
    localStorage.clear();
    router.push('/');
  };

  return (
    <div className=' px-6 h-screen flex flex-col justify-normal md:justify-between gap-8 md:gap-0'>
      {/* Top Section */}
      <div>
        <div className='m-auto mt-6 flex gap-2 items-center'>
          <div className='w-8 h-8 bg-purple-600 rounded-full flex justify-center items-center text-white font-semibold text-sm'>
            {companyName?.[0]}
          </div>
          <h1 className='font-semibold text-purple-600 text-[18px] uppercase'>
            {companyName?.slice(0, 9)}
          </h1>
        </div>
        <div className='mt-10 flex flex-col gap-10'>
          {Navigation.map((navigate) => (
            <button
              key={navigate.description}
              className={`flex gap-3 items-center cursor-pointer ${
                activePath === navigate.path ? 'text-purple-600' : ''
              }`}
              onClick={(e) => {
                e.preventDefault(); // Prevent default browser behavior
                handleNavigation(navigate.path);
              }}
            >
              <div>{navigate.icon}</div>
              <h3>{navigate.description}</h3>
            </button>
          ))}
        </div>
      </div>

      {/* Logout Section */}
      <div className='flex items-center gap-3 mb-6' onClick={handleLogOut}>
        <LogoutIcon />
        <button className='text-[red] hover:text-red-700'>LogOut</button>
      </div>
    </div>
  );
};

export default Sidebar;
