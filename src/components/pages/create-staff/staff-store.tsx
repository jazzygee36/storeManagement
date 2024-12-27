import HomeButton from '@/components/common/button';
import React from 'react';

const StaffStore = () => {
  return (
    <div className='border border-gray-300 rounded-md w-full h-[100%] grid grid-cols-1 my-5'>
      <div className='flex justify-between items-center p-3 '>
        <div className='flex gap-3 items-center'>
          <div className='bg-gray-300 h-24 w-40 rounded-sm'></div>
          <div>
            <h1>Staff name</h1>
            <h1>Phone number</h1>
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <HomeButton
            title={'Edit'}
            bg={'grey'}
            type={'submit'}
            color={'white'}
          />
          <HomeButton
            title={'Delete'}
            bg={'red'}
            type={'submit'}
            color={'white'}
          />
        </div>
      </div>
    </div>
  );
};

export default StaffStore;
