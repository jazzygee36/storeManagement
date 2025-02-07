'use client';

import HomeButton from '@/components/common/button';
import MainDashboard from '@/components/common/dashboard/main-dasboard';
import HomeInput from '@/components/common/input';
import Loading from '@/components/common/loadingState';
import ReusableModal from '@/components/common/modal';
import { useToast } from '@/components/hook/context/useContext';
import useAuth from '@/components/hook/useAuth';
import StaffStore from '@/components/pages/create-staff/staff-store';
import { AppDispatch } from '@/components/state/store';
import { createStaffSchema } from '@/components/utils/validation';
import axios from 'axios';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { z } from 'zod';
import { fetchStaffs } from '@/components/api/slices/staffProfileSlice';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

type FormData = z.infer<typeof createStaffSchema>;

const Stores = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { addToast } = useToast();
  const showToast = () => {
    addToast('Staff created successfully', 'success');
  };

  const isAuthenticated = useAuth();
  const [data, setData] = useState<FormData>({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  // const [loading, setLoading] = useState(false);
  const [loading, setLoading] = useState('Create Staff');
  const [apiErr, setApiErr] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCreateStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = createStaffSchema.safeParse(data);

    if (!result.success) {
      const validationErrors = result.error.format();
      setErrors({
        username: validationErrors.username?._errors[0] || '',
        password: validationErrors.password?._errors[0] || '',
      });
      return; // Exit if validation fails
    }

    const userId = localStorage.getItem('userId');
    if (userId) {
      try {
        setLoading('Processing...');
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/${userId}/create-staff`,
          data
        );
        // Reset API error if the request succeeds

        dispatch(fetchStaffs(userId));

        if (res.data.message === 'Staff created successfully') {
          showToast();
          closeModal();
        }
        setData({ username: '', password: '' });

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
    <MainDashboard>
      {!isAuthenticated ? (
        <Loading />
      ) : (
        <>
          <Card>
            <CardHeader>
              <div className='flex justify-between items-center'>
                <h2>Manage Store</h2>
                <HomeButton
                  title={'Create Staff'}
                  bg={'#4285F4'}
                  type={'submit'}
                  color={'white'}
                  onClick={openModal}
                />
              </div>
            </CardHeader>
            <CardContent>
              <StaffStore />
            </CardContent>
          </Card>
          <ReusableModal isOpen={isModalOpen} onClose={closeModal}>
            <h3 className='text-center'>Create Staff</h3>
            <form onSubmit={handleCreateStaffSubmit} className='mx-3'>
              <p className='text-red-500 text-[13px] text-center my-2'>
                {apiErr}
              </p>
              <div className='my-4'>
                <HomeInput
                  placeholder={'Username'}
                  value={data.username}
                  name='username'
                  onChange={handleChange}
                />
                {errors.username && (
                  <p className='text-red-500 text-[13px]'>{errors.username}</p>
                )}
              </div>
              <div>
                <HomeInput
                  placeholder={'Password'}
                  value={data.password}
                  name='password'
                  onChange={handleChange}
                  type='password'
                />
                {errors.password && (
                  <p className='text-red-500 text-[13px]'>{errors.password}</p>
                )}
              </div>
              <div className='mt-5 '>
                <HomeButton
                  title={loading}
                  bg={'blue'}
                  color={'white'}
                  type='submit'
                  width={'100%'}
                />
              </div>
            </form>
          </ReusableModal>
        </>
      )}
    </MainDashboard>
  );
};

export default Stores;
