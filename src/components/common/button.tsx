import React from 'react';
import { ButtonProps } from '../utils/interface';

const HomeButton = ({ title, bg, type, color, onClick }: ButtonProps) => {
  return (
    <button
      style={{ backgroundColor: bg, color: color }}
      className={`h-[44px] rounded-md w-full font-inter text-[16px] px-4  `}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default HomeButton;
