import HomeButton from '@/components/common/button';
import MainDashboard from '@/components/common/dashboard/main-dasboard';
import PaperBackground from '@/components/common/paper-bg';
import StaffStore from '@/components/pages/staff/staff-store';
import React from 'react';

const Stores = () => {
  return (
    <MainDashboard>
      <PaperBackground
        title={'Manage Store'}
        container={
          <>
            <HomeButton
              title={'Create Staff'}
              bg={'#4285F4'}
              type={'Submit'}
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
