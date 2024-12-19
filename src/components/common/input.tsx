import React from 'react';
import { InputProps } from '../utils/interface';

const HomeInput = ({ label, placeholder, type }: InputProps) => {
  return (
    <div className='flex flex-col justify-center mt-5'>
      <label className='text-[14px] font-medium mb-[6px] '>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className='w-full h-11 border border-[#D0D5DD] rounded-md px-3 outline-none'
      />
    </div>
  );
};

export default HomeInput;
