'use client';
import HomeButton from '@/components/common/button';
import HomeInput from '@/components/common/input';
import Loading from '@/components/common/loadingState';
import ReusableModal from '@/components/common/modal';
import PaperBackground from '@/components/common/paper-bg';
import MainStaffDashboard from '@/components/common/staff-dashboard/main-staff-dashboard';
import useAuth from '@/components/hook/useAuth';
import StaffProducts from '@/components/pages/staff-products/all-products';
import { useState } from 'react';

const StaffStore = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAuthenticated = useAuth();
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <MainStaffDashboard>
      <>
        {!isAuthenticated ? (
          <Loading />
        ) : (
          <PaperBackground
            title={'All Products'}
            container={
              <div>
                <HomeButton
                  title={'Sell Product'}
                  bg={'blue'}
                  color={'white'}
                  onClick={openModal}
                />
              </div>
            }
          >
            <StaffProducts />
          </PaperBackground>
        )}
        <ReusableModal isOpen={isModalOpen} onClose={closeModal}>
          <form className='w-full m-auto'>
            <div>
              <label htmlFor=''>Product Name</label>
              <HomeInput placeholder={''} />
            </div>
            <div className='my-2'>
              <label htmlFor=''>Quantity</label>
              <HomeInput placeholder={''} />
            </div>
            <div className='my-2'>
              <label htmlFor=''>Unit Price</label>
              <HomeInput placeholder={''} />
            </div>
            <div className='my-2'>
              <label htmlFor=''>Total Price</label>
              <HomeInput placeholder={''} />
            </div>
            <div className='mt-5'>
              <HomeButton title={'Add to Sales'} bg={'blue'} color={'white'} />
            </div>
          </form>
        </ReusableModal>
      </>
    </MainStaffDashboard>
  );
};

export default StaffStore;
