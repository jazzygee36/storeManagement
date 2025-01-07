import HomeButton from '@/components/common/button';
import HomeInput from '@/components/common/input';
import { addProductSchema } from '@/components/utils/validation';
import React, { useState } from 'react';
import { z } from 'zod';

type FormData = z.infer<typeof addProductSchema>;

const AllProductModal = () => {
  const [data, setData] = useState<FormData>({
    productName: '',
    buyingPrice: '',
    qtyBought: '',
    salesPrice: '',
    qtySold: '',
    expired: '',
    availability: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const result = addProductSchema.safeParse(data);
    if (!result.success) {
      const validationErrors = result.error.format();
      setErrors({
        productName: validationErrors.productName?._errors[0] || '',
        buyingPrice: validationErrors.buyingPrice?._errors[0] || '',
        qtyBought: validationErrors.qtyBought?._errors[0] || '',
        salesPrice: validationErrors.salesPrice?._errors[0] || '',
        qtySold: validationErrors.qtySold?._errors[0] || '',
        expired: validationErrors.expired?._errors[0] || '',
        availability: validationErrors.availability?._errors[0] || '',
      });
      return;
    }
  };
  return (
    <div className=''>
      <form onSubmit={handleAddProduct}>
        <HomeInput placeholder={'PRODUCT NAME'} />
        {errors.productName && (
          <p className='text-red-500 text-[13px]'>{errors.productName}</p>
        )}
        <HomeInput placeholder={'BUYING PRICE'} />
        <HomeInput placeholder={'QTY BOUGHT'} />
        <HomeInput placeholder={'SALES PRICE'} />
        <HomeInput placeholder={'QTY SOLD'} />
        <HomeInput placeholder={'EXPIRED'} />
        <HomeInput placeholder={'AVAILABILITY'} />
        <div className='mt-3'>
          <HomeButton
            title={'Add Product'}
            bg={'#2E5BFF'}
            color={'white'}
            type='submit'
          />
        </div>
      </form>
    </div>
  );
};

export default AllProductModal;
