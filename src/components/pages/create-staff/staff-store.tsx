'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStaffs } from '@/components/api/slices/staffProfileSlice';
import HomeButton from '@/components/common/button';
import { AppDispatch, RootState } from '@/components/state/store';
import { useToast } from '@/components/hook/context/useContext';
import ReusableModal from '@/components/common/modal';
import { deleteStaff } from '@/components/api/slices/deleteStaffSlice';

interface StaffProps {
  _id: string;
  username: string;
  phoneNumber: string;
}
const StaffStore = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { staffs, error, loading } = useSelector(
    (state: RootState) => state.staffProfile
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState('Delete');

  const openModal = (staffId: string) => {
    setSelectedStaffId(staffId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedStaffId(null);
    setIsModalOpen(false);
  };

  const { addToast } = useToast();
  const showToast = () => {
    addToast('Staff deleted successfully', 'error');
  };

  const handleStaffDelete = (staffId: string) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      return;
    }
    setDeleting('Deleting...');

    dispatch(deleteStaff(staffId))
      .unwrap()
      .then(() => {
        dispatch(fetchStaffs(userId));
        closeModal();
        showToast();
        setDeleting(deleting);
      })
      .catch((error) => {
        console.error('Failed to delete staff:', error);
      });
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      dispatch(fetchStaffs(userId));
    }
  }, [dispatch]);

  if (loading) {
    return <div className='text-center'>Loading...</div>;
  }

  if (error) {
    return <div className='text-center text-red-500'>{error}</div>;
  }

  return (
    <div>
      {staffs.length === 0 ? (
        <div className='text-center flex justify-center items-center h-40'>
          No staff yet, create one!
        </div>
      ) : (
        staffs.map((staff: StaffProps) => {
          return (
            <div
              key={staff.phoneNumber}
              className='border border-gray-300 rounded-md w-full h-[100%] grid grid-cols-1 my-5'
            >
              <div className='flex justify-between items-center p-3 w-full'>
                <div className='flex gap-3 items-center w-full'>
                  <div className='bg-gray-300 h-24 w-40 rounded-sm'></div>
                  <div className='grid grid-cols-1 md:grid-cols-2 w-full items-center justify-between'>
                    <div>
                      <h1>{staff.username}</h1>
                      <h1>{staff.phoneNumber}</h1>
                    </div>
                    <div className='w-[70%] md:w-[40%] flex justify-end'>
                      <HomeButton
                        title={'Delete'}
                        bg={'red'}
                        type={'submit'}
                        color={'white'}
                        onClick={() => openModal(staff._id)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
      <ReusableModal isOpen={isModalOpen} onClose={closeModal}>
        <h1 className='text-center'>
          Are you sure you want to delete this staff?
        </h1>
        <div className='flex justify-center gap-4 mt-5'>
          <HomeButton
            title='Cancel'
            onClick={closeModal}
            bg='blue'
            color='white'
          />
          <HomeButton
            title={deleting ? deleting : 'Delete'}
            onClick={() => {
              console.log(
                'Delete button clicked, selectedStaffId:',
                selectedStaffId
              ); // Debug
              if (selectedStaffId) {
                console.log('Delete button clicked'); // Debugging line
                handleStaffDelete(selectedStaffId);
              }
            }}
            bg='red'
            color='white'
          />
        </div>
      </ReusableModal>
    </div>
  );
};

export default StaffStore;
