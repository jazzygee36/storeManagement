import React from 'react';

const BackArrow = () => {
  return (
    <svg
      className='w-6 h-6 text-gray-800 dark:text-white cursor-pointer  left-3 top-3 fixed '
      aria-hidden='true'
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      fill='none'
      viewBox='0 0 24 24'
      onClick={() => window.history.back()}
    >
      <path
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
        d='M5 12h14M5 12l4-4m-4 4 4 4'
      />
    </svg>
  );
};

export default BackArrow;
