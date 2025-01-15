import React from 'react';
import { InputProps } from '../utils/interface';

const HomeInput = ({
  name,
  label,
  placeholder,
  type,
  value,
  onChange,
  mt,
  readOnly,
}: InputProps) => {
  return (
    <div className={`flex flex-col justify-center mt-${mt}`}>
      <label className='text-[14px] font-medium mb-[6px] '>{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full h-11 border border-[#D0D5DD] rounded-md px-3 outline-none `}
      />
    </div>
  );
};

export default HomeInput;
