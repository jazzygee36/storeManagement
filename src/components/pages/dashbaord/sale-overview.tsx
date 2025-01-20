import React from 'react';
import Image from 'next/image';
import Sales from '@/components/assets/svg/Sales.svg';
import Profit from '@/components/assets/svg/Profit.svg';

interface Props {
  totalCostValue: number;

  totalProfit: number;
}

const formatNumber = (num: number): string =>
  new Intl.NumberFormat().format(num);

const SalesOverview = ({
  totalCostValue,

  totalProfit,
}: Props) => {
  return (
    <div className='grid grid-cols-2 gap-5 mt-3 justify-between items-center text-center text-sm'>
      <div>
        <Image src={Sales} alt='sales' className='m-auto mb-4' />

        <div className='flex justify-evenly items-center'>
          <h2 className='font-bold'>N{formatNumber(totalCostValue)}</h2>
          <h2>Invested</h2>
        </div>
      </div>

      <div>
        <Image src={Profit} alt='profit' className='m-auto mb-4' />

        <div className='flex justify-evenly items-center'>
          <h2 className='font-bold'>N{formatNumber(totalProfit)}</h2>
          <h2>Profit</h2>
        </div>
      </div>
    </div>
  );
};

export default SalesOverview;
