import React from 'react';
import { PaperProps } from '../utils/interface';

const PaperBackground: React.FC<PaperProps & { children: React.ReactNode }> = ({
  title,
  children,
  container,
}) => {
  return (
    <div className='bg-white w-full py-5 px-4 rounded-md'>
      <div className='flex justify-between items-center'>
        <div className='flex gap-3 items-center'>
          <h4 className='text-[18px] text-gray-800 font-medium font-inter'>
            {title}
          </h4>
        </div>
        <div className='flex justify-between gap-2 items-center'>
          {container}
        </div>
      </div>
      {children}
    </div>
  );
};

export default PaperBackground;
