'use client';
import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
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
    subItems: [{ description: 'All items', path: '/admin-inventory' }],
  },
  {
    icon: <BookIcon />,
    description: 'Sales',

    subItems: [
      { description: 'Daily sales', path: '/admin-reports' },
      { description: 'Monthly sales summary', path: '/admin-monthly-review' },
      { description: 'Credit note', path: '/coming-soon' },
    ],
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
  const [openAccordions, setOpenAccordions] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const storedName = localStorage.getItem('companyName');
    setCompanyName(storedName || '');
  }, []);

  useEffect(() => {
    setActivePath(window.location.pathname);
  }, []);

  const handleNavigation = (path: string) => {
    setActivePath(path);
    router.push(path);
  };

  const toggleAccordion = (description: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [description]: !prev[description],
    }));
  };

  const handleLogOut = () => {
    localStorage.clear();
    router.push('/');
  };

  return (
    <div className='px-6 h-screen flex flex-col justify-normal z-[100] md:justify-between gap-8 md:gap-0'>
      <div>
        <div className='m-auto mt-6 flex gap-2 items-center'>
          <div className='w-6 h-6 bg-purple-600 rounded-md flex justify-center items-center text-white font-semibold text-md'>
            {companyName?.[0] || 'Admin'}
          </div>
          <h1 className='font-semibold text-purple-600 text-md uppercase'>
            {companyName?.slice(0, 9)}
          </h1>
        </div>
        <div className='mt-10 flex flex-col gap-4'>
          {Navigation.map((navigate) => (
            <div key={navigate.description} className='overflow-hidden'>
              <div
                className={` ${
                  activePath === navigate.path ? 'text-purple-600' : ''
                } w-full flex justify-between items-center my-2 hover:text-purple-600 cursor-pointer`}
                onClick={() =>
                  navigate.subItems
                    ? toggleAccordion(navigate.description)
                    : handleNavigation(navigate.path)
                }
              >
                <div className='flex gap-3 items-center'>
                  {navigate.icon}
                  <h3 className='text-sm'>{navigate.description}</h3>
                </div>
                {navigate.subItems && navigate.subItems.length > 0 && (
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      openAccordions[navigate.description]
                        ? 'rotate-180'
                        : 'rotate-0'
                    }`}
                  />
                )}
              </div>
              {navigate.subItems && openAccordions[navigate.description] && (
                <div className='p-4 bg-white border-t'>
                  {navigate.subItems.map((subItem) => (
                    <div
                      key={subItem.description}
                      className={`cursor-pointer text-sm w-full text-left p-2 hover:bg-gray-100 ${
                        activePath === subItem.path ? 'text-purple-600' : ''
                      }`}
                      onClick={() => handleNavigation(subItem.path)}
                    >
                      {subItem.description}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Logout Section */}
      <div
        className='flex items-center gap-3 mb-6 cursor-pointer'
        onClick={handleLogOut}
      >
        <LogoutIcon />
        <button className='text-[red] hover:text-red-700'>LogOut</button>
      </div>
    </div>
  );
};

export default Sidebar;
