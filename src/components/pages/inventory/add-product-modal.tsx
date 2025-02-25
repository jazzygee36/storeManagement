'use client';
import HomeButton from '@/components/common/button';
import HomeInput from '@/components/common/input';
import { addProductSchema } from '@/components/utils/validation';
import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { z } from 'zod';
import { AppDispatch } from '@/components/state/store';
import { fetchUserProfile } from '@/components/api/slices/userProfileSlice';
import { format } from 'date-fns';
import { useToast } from '@/components/hook/context/useContext';

type FormData = z.infer<typeof addProductSchema>;

const AllProductModal = ({ closeModal }: { closeModal: () => void }) => {
  const { addToast } = useToast();
  const showToast = () => {
    addToast('Product added successfully', 'success');
  };
  const dispatch = useDispatch<AppDispatch>();
  const [apiErr, setApiErr] = useState('');
  const [loading, setLoading] = useState('Add Product');
  const [data, setData] = useState<FormData>({
    productName: '',
    unitPrice: '',
    qtyBought: '',
    salesPrice: '',

    exp: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure the date is formatted to YYYY-MM-DD
    const formattedData = {
      ...data,
      exp: data.exp ? format(new Date(data.exp), 'yyyy-MM-dd') : '', // Format the date or leave empty
    };

    const result = addProductSchema.safeParse(formattedData);
    if (!result.success) {
      const validationErrors = result.error.format();
      setErrors({
        productName: validationErrors.productName?._errors[0] || '',
        buyingPrice: validationErrors.unitPrice?._errors[0] || '',
        qtyBought: validationErrors.qtyBought?._errors[0] || '',
        salesPrice: validationErrors.salesPrice?._errors[0] || '',
      });
      return;
    }

    const userId = localStorage.getItem('userId');
    if (userId) {
      try {
        setLoading('Processing...');
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/${userId}/add-products`,
          formattedData
        );
        // Reset API error if the request succeeds

        dispatch(fetchUserProfile(userId));

        if (res.data.message === 'Product added successfully') {
          showToast();
          closeModal();
        }

        setLoading(loading);
      } catch (error) {
        // Handle and set the API error message
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message || 'Something went wrong!';
          setApiErr(errorMessage);
          if (errorMessage) {
            setLoading(loading);
          }
        } else {
          setApiErr('An unexpected error occurred.');
        }
      }
    }
  };

  return (
    <div className='p-2'>
      <p className='text-red-500 text-[13px] text-center'>{apiErr}</p>

      <form onSubmit={handleAddProduct}>
        <div>
          <HomeInput
            placeholder={''}
            value={data.productName}
            name='productName'
            onChange={handleChange}
            label='Product Name'
          />

          {errors.productName && (
            <p className='text-red-500 text-[13px]'>{errors.productName}</p>
          )}
        </div>

        <div className='flex justify-between gap-2 my-5'>
          <div>
            <HomeInput
              placeholder={''}
              value={data.unitPrice}
              name='unitPrice'
              onChange={handleChange}
              label='Buying Price'
              onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
                if (!/[0-9 +]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
            />
            {errors.buyingPrice && (
              <p className='text-red-500 text-[13px]'>{errors.buyingPrice}</p>
            )}
          </div>

          <div>
            <HomeInput
              placeholder={''}
              value={data.qtyBought}
              name='qtyBought'
              onChange={handleChange}
              label='Quantity Bought'
              onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
                if (!/[0-9 +]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
            />
            {errors.qtyBought && (
              <p className='text-red-500 text-[13px]'>{errors.qtyBought}</p>
            )}
          </div>
        </div>

        <div className='flex justify-between items-center gap-2'>
          <div>
            <HomeInput
              placeholder={''}
              value={data.salesPrice}
              name='salesPrice'
              onChange={handleChange}
              label='Selling Price'
              onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
                if (!/[0-9 +]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
            />
            {errors.salesPrice && (
              <p className='text-red-500 text-[13px]'>{errors.salesPrice}</p>
            )}
          </div>

          <div>
            <HomeInput
              placeholder={''}
              value={data.exp}
              name='exp'
              onChange={handleChange}
              type='date'
              label='Expired (Optional)'
            />
            {/* <p className='text-gray-400 text-[13px] text-center'>Optional</p> */}
          </div>
        </div>

        <div className='mt-4 w-full flex justify-center'>
          <HomeButton
            title={loading}
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
