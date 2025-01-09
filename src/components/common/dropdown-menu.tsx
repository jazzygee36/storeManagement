'use client';

import React, { useState, useEffect, useRef } from 'react';
import MoreIcon from '@/components/assets/icons/more';

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering other click handlers
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className='relative' ref={menuRef}>
      {/* More Icon */}
      <div onClick={toggleDropdown} className='cursor-pointer'>
        <MoreIcon />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className='absolute right-0 mt-2 w-48 z-50 bg-white border rounded shadow-lg'>
          <ul className='py-1'>
            <li
              className='px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer'
              onClick={(e) => {
                e.stopPropagation();
                console.log('Edit clicked');
                setIsOpen(false);
              }}
            >
              Edit
            </li>
            <li
              className='px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer text-[red] z-[100]'
              onClick={(e) => {
                e.stopPropagation();
                console.log('Delete clicked');
                setIsOpen(false);
              }}
            >
              Delete
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
