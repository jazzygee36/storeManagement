import React from 'react';
import { ButtonProps } from '../utils/interface';

const HomeButton = ({ title, bg, color, onClick, type }: ButtonProps) => {
  return (
    <button
      style={{ backgroundColor: bg, color: color }}
      className={`h-[44px] rounded-md w-full font-inter text-[16px] px-4  `}
      onClick={onClick}
      type={type}
    >
      {title}
    </button>
  );
};

export default HomeButton;
