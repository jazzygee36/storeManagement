'use client';
import Image from 'next/image';
import DashboardLogo from '@/components/assets/svg/dasboardLogo.svg';
import DashbaordIcon from '@/components/assets/icons/dashboard';
import InventoryIcon from '@/components/assets/icons/inventory';
import StoreIcon from '@/components/assets/icons/store';

const Navigation = [
  {
    icon: <DashbaordIcon />,
    description: 'Dashboard',
    path: '/dashboard',
  },
  {
    icon: <InventoryIcon />,
    description: 'Inventory',
    path: '/inventory',
  },
  {
    icon: <StoreIcon />,
    description: 'Manage Store',
    path: '/stores',
  },
];
const Sidebar = () => {
  return (
    <div className='w-[280px] px-6'>
      <div className='m-auto mt-6'>
        <Image src={DashboardLogo} alt='logo' />
      </div>
      <div className='mt-10 flex flex-col gap-10'>
        {Navigation.map((navigate) => (
          <div
            key={navigate.description}
            className={`flex gap-3 cursor-pointer hover:text-[#4285F4] `}
            onClick={() => {
              window.location.href = navigate.path;
            }}
          >
            <div>{navigate.icon}</div>
            <h3> {navigate.description}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
