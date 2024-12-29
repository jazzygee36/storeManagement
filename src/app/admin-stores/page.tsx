'use client';
import HomeButton from '@/components/common/button';
import MainDashboard from '@/components/common/dashboard/main-dasboard';
import Loading from '@/components/common/loadingState';
import PaperBackground from '@/components/common/paper-bg';
import useAuth from '@/components/hook/useAuth';
import StaffStore from '@/components/pages/create-staff/staff-store';
import React from 'react';

const Stores = () => {
  const isAuthenticated = useAuth();

  if (!isAuthenticated) {
    return <Loading />;
  }
  return (
    <MainDashboard>
      <PaperBackground
        title={'Manage Store'}
        container={
          <>
            <HomeButton
              title={'Create Staff'}
              bg={'#4285F4'}
              type={'submit'}
              color={'white'}
            />
          </>
        }
      >
        <StaffStore />
      </PaperBackground>
    </MainDashboard>
  );
};

export default Stores;
