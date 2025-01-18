'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Stock from '@/components/assets/svg/Suppliers.svg';
import OutOfStock from '@/components/assets/svg/Categories.svg';
import { useRouter } from 'next/navigation';
import Loading from '@/components/common/loadingState';

const ProductSummary = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleProduct = () => {
    setLoading(true);
    router.push('/admin-inventory');
    setLoading(false);
  };
  return (
    <div className='grid grid-cols-2 gap-4 mt-3 justify-between items-center text-center text-sm'>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className='cursor-pointer' onClick={handleProduct}>
            <Image src={Stock} alt='sales' className='m-auto mb-4' />

            <p className='text-[green] font-medium'>Product In-Stock</p>
          </div>

          <div className='cursor-pointer' onClick={handleProduct}>
            <Image src={OutOfStock} alt='sales' className='m-auto mb-4' />

            <p className='text-[red] font-medium'>Product Out-Of-Stock</p>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductSummary;
