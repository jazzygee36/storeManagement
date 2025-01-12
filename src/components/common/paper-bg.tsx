import React from 'react';
import { PaperProps } from '../utils/interface';
import HomeInput from './input';

const PaperBackground: React.FC<PaperProps & { children: React.ReactNode }> = ({
  title,
  children,
  container,
  input,
  onInputChange,
}) => {
  return (
    <div className='bg-white w-full py-5 px-4 rounded-md'>
      <div className='flex justify-between items-center gap-3'>
        <div className='hidden md:block'>
          <h4 className='text-[18px] text-gray-800 font-medium font-inter'>
            {title}
          </h4>
        </div>
        {input && (
          <div className='w-[60%] hidden md:block'>
            <HomeInput
              label={''}
              placeholder={'Search Products'}
              type={'text'}
              onChange={(e) => onInputChange?.(e.target.value)}
            />
          </div>
        )}

        <div className='flex justify-between gap-2 items-center'>
          {container}
        </div>
      </div>
      {children}
    </div>
  );
};

export default PaperBackground;
