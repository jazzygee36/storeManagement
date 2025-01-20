'use client';

import Image from 'next/image';
import Stock from '@/components/assets/svg/Suppliers.svg';
import OutOfStock from '@/components/assets/svg/Categories.svg';

interface Props {
  OutOfStockLength: number;
  InStock: number;
}

const ProductSummary = ({ InStock, OutOfStockLength }: Props) => {
  return (
    <div className='grid grid-cols-2 gap-4 mt-3 justify-between items-center text-center text-sm'>
      <div>
        <Image src={Stock} alt='sales' className='m-auto mb-4' />
        <span>{InStock}</span>

        <p className='text-[green] font-medium'>Product In-Stock</p>
      </div>

      <div>
        <Image src={OutOfStock} alt='sales' className='m-auto mb-4' />
        <span>{OutOfStockLength}</span>

        <p className='text-[red] font-medium'>Product Out-Of-Stock</p>
      </div>
    </div>
  );
};

export default ProductSummary;
