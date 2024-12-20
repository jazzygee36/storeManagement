import React from 'react';
import Image from 'next/image';
import Sales from '@/components/assets/svg/Sales.svg';
import Profit from '@/components/assets/svg/Profit.svg';

const SalesOverview = () => {
  return (
    <div className='grid grid-cols-2 gap-5 mt-3 justify-between items-center text-center text-sm'>
      <div>
        <Image src={Sales} alt='sales' className='m-auto mb-4' />

        <div className='flex justify-evenly items-center'>
          <h2>N50,000</h2>
          <h2>Sales</h2>
        </div>
      </div>

      <div>
        <Image src={Profit} alt='profit' className='m-auto mb-4' />

        <div className='flex justify-evenly items-center'>
          <h2>N20,000</h2>
          <h2>Profit</h2>
        </div>
      </div>
    </div>
  );
};

export default SalesOverview;
