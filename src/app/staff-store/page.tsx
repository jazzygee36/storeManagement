'use client';

import Loading from '@/components/common/loadingState';
import PaperBackground from '@/components/common/paper-bg';
import MainStaffDashboard from '@/components/common/staff-dashboard/main-staff-dashboard';
import useAuth from '@/components/hook/useAuth';
import StaffProducts from '@/components/pages/staff-products/all-products';
import { useRouter } from 'next/navigation';

const StaffStore = () => {
  const isAuthenticated = useAuth();

  return (
    <MainStaffDashboard>
      <>
        {!isAuthenticated ? (
          <Loading />
        ) : (
          <PaperBackground title={''}>
            <StaffProducts />
          </PaperBackground>
        )}
      </>
    </MainStaffDashboard>
  );
};

export default StaffStore;
