import HomeButton from '@/components/common/button';
import HomeInput from '@/components/common/input';
import { addProductSchema } from '@/components/utils/validation';
import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { z } from 'zod';
import { AppDispatch } from '@/components/state/store';
import { fetchUserProfile } from '@/components/api/slices/userProfileSlice';
import { format } from 'date-fns'; // Install with: npm install date-fns
// import Toast from '@/components/common/toast';
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
    <div className=''>
      <form onSubmit={handleAddProduct}>
        <HomeInput
          placeholder={'PRODUCT NAME'}
          value={data.productName}
          name='productName'
          onChange={handleChange}
        />

        {errors.productName && (
          <p className='text-red-500 text-[13px]'>{errors.productName}</p>
        )}
        <p className='text-red-500 text-[13px]'>{apiErr}</p>

        <div className='flex justify-between gap-2'>
          <div>
            <HomeInput
              placeholder={'BUYING PRICE'}
              value={data.unitPrice}
              name='unitPrice'
              onChange={handleChange}
            />
            {errors.buyingPrice && (
              <p className='text-red-500 text-[13px]'>{errors.buyingPrice}</p>
            )}
          </div>

          <div>
            <HomeInput
              placeholder={'QTY BOUGHT'}
              value={data.qtyBought}
              name='qtyBought'
              onChange={handleChange}
            />
            {errors.qtyBought && (
              <p className='text-red-500 text-[13px]'>{errors.qtyBought}</p>
            )}
          </div>
        </div>

        <div className='flex justify-between gap-2'>
          <div>
            <HomeInput
              placeholder={'SALES PRICE'}
              value={data.salesPrice}
              name='salesPrice'
              onChange={handleChange}
            />
            {errors.salesPrice && (
              <p className='text-red-500 text-[13px]'>{errors.salesPrice}</p>
            )}
          </div>

          <div>
            <HomeInput
              placeholder={'EXPIRED'}
              value={data.exp}
              name='exp'
              onChange={handleChange}
              type='date'
            />
            <p className='text-gray-400 text-[13px] text-center'>Optional</p>
          </div>
        </div>

        <div className='mt-3'>
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
