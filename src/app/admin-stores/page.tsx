'use client';
import { fetchUserProfile } from '@/components/api/slices/userProfileSlice';
import HomeButton from '@/components/common/button';
import MainDashboard from '@/components/common/dashboard/main-dasboard';
import HomeInput from '@/components/common/input';
import Loading from '@/components/common/loadingState';
import ReusableModal from '@/components/common/modal';
import PaperBackground from '@/components/common/paper-bg';
import { useToast } from '@/components/hook/context/useContext';
import useAuth from '@/components/hook/useAuth';
import StaffStore from '@/components/pages/create-staff/staff-store';
import { AppDispatch } from '@/components/state/store';
import { staffLoginSchema } from '@/components/utils/validation';
import axios from 'axios';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { z } from 'zod';

type FormData = z.infer<typeof staffLoginSchema>;

const Stores = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { addToast } = useToast();
  const showToast = () => {
    addToast('Staff created successfully', 'success');
  };

  const isAuthenticated = useAuth();
  const [data, setData] = useState<FormData>({
    username: '',
    phoneNumber: '',
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

  const handleStaffLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = staffLoginSchema.safeParse(data);

    if (!result.success) {
      const validationErrors = result.error.format();
      setErrors({
        username: validationErrors.username?._errors[0] || '',
        phoneNumber: validationErrors.phoneNumber?._errors[0] || '',
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

        dispatch(fetchUserProfile(userId));

        if (res.data.message === 'Staff created successfully') {
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
    <MainDashboard>
      {!isAuthenticated ? (
        <Loading />
      ) : (
        <>
          <PaperBackground
            title={'Manage Store'}
            container={
              <>
                <HomeButton
                  title={'Create Staff'}
                  bg={'#4285F4'}
                  type={'submit'}
                  color={'white'}
                  onClick={openModal}
                />
              </>
            }
          >
            <StaffStore />
          </PaperBackground>
          <ReusableModal isOpen={isModalOpen} onClose={closeModal}>
            <h3>Create Staff</h3>
            <form onSubmit={handleStaffLoginSubmit}>
              <p className='text-red-500 text-[13px] text-center my-2'>
                {apiErr}
              </p>

              <HomeInput
                placeholder={'Username'}
                value={data.username}
                name='username'
                onChange={handleChange}
              />
              {errors.username && (
                <p className='text-red-500 text-[13px]'>{errors.username}</p>
              )}
              <HomeInput
                placeholder={'Phone Number'}
                value={data.phoneNumber}
                name='phoneNumber'
                onChange={handleChange}
              />
              {errors.phoneNumber && (
                <p className='text-red-500 text-[13px]'>{errors.phoneNumber}</p>
              )}
              <div className='mt-5'>
                <HomeButton
                  title={loading}
                  bg={'blue'}
                  color={'white'}
                  type='submit'
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
