'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStaffs } from '@/components/api/slices/staffProfileSlice';
import HomeButton from '@/components/common/button';
import { AppDispatch, RootState } from '@/components/state/store';

interface StaffProps {
  id: string;
  username: string;
  phoneNumber: string;
}

const StaffStore = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { staffs, error, loading } = useSelector(
    (state: RootState) => state.staffProfile
  );

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      dispatch(fetchStaffs(userId));
    }
  }, [dispatch]);

  if (loading) {
    return <div className='text-center'>Loading...</div>;
  }

  if (error) {
    return <div className='text-center text-red-500'>{error}</div>;
  }

  return (
    <div>
      {staffs.length === 0 ? (
        <div className='text-center flex justify-center items-center h-40'>
          No staff yet, create one!
        </div>
      ) : (
        staffs.map((staff: StaffProps) => (
          <div
            key={staff.phoneNumber}
            className='border border-gray-300 rounded-md w-full h-[100%] grid grid-cols-1 my-5'
          >
            <div className='flex justify-between items-center p-3 w-full'>
              <div className='flex gap-3 items-center w-full'>
                <div className='bg-gray-300 h-24 w-40 rounded-sm'></div>
                <div className='grid grid-cols-1 md:grid-cols-2 w-full items-center justify-between'>
                  <div>
                    <h1>{staff.username}</h1>
                    <h1>{staff.phoneNumber}</h1>
                  </div>
                  <HomeButton
                    title={'Delete'}
                    bg={'red'}
                    type={'submit'}
                    color={'white'}
                  />
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default StaffStore;
