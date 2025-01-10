import HomeButton from '@/components/common/button';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface StaffProps {
  username: string;
  phoneNumber: string;
}

const StaffStore = () => {
  const [staff, setStaff] = useState([]);
  console.log('staff', staff);

  const handleAllStaff = async () => {
    const userId = localStorage.getItem('userId');
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/${userId}/all-staffs`
    );
    setStaff(res.data);
  };

  useEffect(() => {
    handleAllStaff();
  }, []);
  return (
    <>
      {staff.map((staff: StaffProps) => (
        <div
          key={staff.phoneNumber}
          className='border border-gray-300 rounded-md w-full h-[100%] grid grid-cols-1 my-5'
        >
          <div className='flex justify-between items-center p-3 '>
            <div className='flex gap-3 items-center'>
              <div className='bg-gray-300 h-24 w-40 rounded-sm'></div>
              <div>
                <h1>{staff.username}</h1>
                <h1>{staff.phoneNumber}</h1>
              </div>
            </div>
            <div className='flex flex-col gap-3'>
              {/* <HomeButton
                title={'Edit'}
                bg={'grey'}
                type={'submit'}
                color={'white'}
              /> */}
              <HomeButton
                title={'Delete'}
                bg={'red'}
                type={'submit'}
                color={'white'}
              />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default StaffStore;
