'use client';
import HomeButton from '@/components/common/button';
import HomeInput from '@/components/common/input';
import Loading from '@/components/common/loadingState';
import PaperBackground from '@/components/common/paper-bg';
import MainStaffDashboard from '@/components/common/staff-dashboard/main-staff-dashboard';
import useAuth from '@/components/hook/useAuth';
import React from 'react';

const StaffSellProduct = () => {
  const isAuthenticated = useAuth();

  return (
    <MainStaffDashboard>
      {!isAuthenticated ? (
        <Loading />
      ) : (
        <PaperBackground title={'Sell Product'}>
          <table className='min-w-full  mt-5'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
                  Item Name
                </th>

                <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
                  Selling Price
                </th>

                <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
                  Quantity
                </th>
                <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
                  Total Price
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className='bg-white rounded-lg shadow-md cursor-pointer my-2'>
                <td className=' px-4 py-2 text-sm'>Ankara</td>
                <td className=' px-4 py-2 text-sm'>3000</td>
                <td className=' px-4 py-2 text-sm'>5</td>
                <td className=' px-4 py-2 text-sm flex items-center justify-between'>
                  15000
                  <div>X</div>
                </td>
              </tr>
            </tbody>
          </table>
          <div className='w-[30%] mt-5 m-auto'>
            <HomeButton title={'Sold'} bg={'blue'} color={'white'} />
          </div>
        </PaperBackground>
      )}
    </MainStaffDashboard>
  );
};

export default StaffSellProduct;
