'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import MoreIcon from '@/components/assets/icons/more';
import ReusableModal from './modal';
import HomeButton from './button';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../state/store';
import { deleteProduct } from '../api/slices/deleteSlice';
import { fetchUserProfile } from '../api/slices/userProfileSlice';
import { useToast } from '../hook/context/useContext';
import { LocalProductItem } from '../utils/interface';

interface DropdownMenuProps {
  productId: string;
  product: LocalProductItem;
  openEditModal: (product: LocalProductItem) => void;
}

const DropdownMenu = ({
  productId,
  product,
  openEditModal,
}: DropdownMenuProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { addToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<'up' | 'down'>('down');
  const [deleting, setDeleting] = useState('Delete');

  const menuRef = useRef<HTMLDivElement>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  const calculatePosition = useCallback(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const menuHeight = 60; // Adjust this to the height of your bottom menu

      // Check if there is enough space below the dropdown
      setPosition(
        viewportHeight - rect.bottom - menuHeight < 100 ? 'up' : 'down'
      );
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      calculatePosition();
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, handleClickOutside, calculatePosition]);

  const handleProductDelete = () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    setDeleting('Deleting...');
    dispatch(deleteProduct(productId))
      .unwrap()
      .then(() => {
        dispatch(fetchUserProfile(userId));
        closeModal();
        addToast('Product deleted successfully', 'error');
        setDeleting('Delete');
      })
      .catch((error) => {
        console.error('Failed to delete product:', error);
        setDeleting('Delete');
      });
  };

  return (
    <>
      <div className='relative' ref={menuRef}>
        <div onClick={toggleDropdown} className='cursor-pointer'>
          <MoreIcon />
        </div>

        {isOpen && (
          <div
            className={`absolute z-50 w-48 bg-white border rounded shadow-lg transition-transform duration-200`}
            style={{
              [position === 'up' ? 'bottom' : 'top']: '100%',
              right: 0,
              [position === 'up' ? 'top' : 'bottom']: 'auto', // Adjust to position upwards or downwards
            }}
          >
            <ul className='py-1'>
              <li
                className='px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer'
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  openEditModal(product);
                }}
              >
                Edit
              </li>
              <li
                className='px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer text-red-600'
                onClick={openModal}
              >
                Delete
              </li>
            </ul>
          </div>
        )}
      </div>

      <ReusableModal isOpen={isModalOpen} onClose={closeModal}>
        <h1 className='text-center'>
          Are you sure you want to delete this product?
        </h1>
        <div className='flex justify-center gap-4 mt-5'>
          <HomeButton
            title='Cancel'
            onClick={closeModal}
            bg='blue'
            color='white'
          />
          <HomeButton
            title={deleting}
            onClick={handleProductDelete}
            bg='red'
            color='white'
          />
        </div>
      </ReusableModal>
    </>
  );
};

export default DropdownMenu;
