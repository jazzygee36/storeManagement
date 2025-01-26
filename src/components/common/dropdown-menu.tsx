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

const DropdownMenu = ({
  productId,
  product,
  openEditModal,
}: {
  productId: string;
  product: LocalProductItem;
  openEditModal: (product: LocalProductItem) => void;
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<'up' | 'down'>('up');
  const menuRef = useRef<HTMLDivElement>(null);
  const [deleting, setDeleting] = useState('Delete');
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const { addToast } = useToast();
  const showToast = () => {
    addToast('Product deleted successfully', 'error');
  };

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
      setPosition(viewportHeight - rect.bottom > 100 ? 'up' : 'down');
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      calculatePosition();
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, handleClickOutside, calculatePosition]);

  const handleProductDelete = () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      return;
    }
    setDeleting('Deleting...');

    dispatch(deleteProduct(productId))
      .unwrap()
      .then(() => {
        dispatch(fetchUserProfile(userId));
        closeModal();
        showToast();
        setDeleting('Deleting...');
      })
      .catch((error) => {
        console.error('Failed to delete product:', error);
      });
  };

  return (
    <>
      <div className='relative' ref={menuRef}>
        {/* More Icon */}
        <div onClick={toggleDropdown} className='cursor-pointer'>
          <MoreIcon />
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            className={`absolute right-0 z-50 w-48 bg-white border rounded shadow-lg ${
              position === 'up' ? 'bottom-full mb-2' : 'mt-2'
            }`}
          >
            <ul className='py-1'>
              <li
                className='px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer'
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  openEditModal(product); // Pass product details for editing
                }}
              >
                Edit
              </li>
              <li
                className='px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer text-[red]'
                onClick={() => {
                  openModal();
                }}
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
            title={deleting ? deleting : 'Delete'}
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
