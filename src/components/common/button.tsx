import React from 'react';
import { ButtonProps } from '../utils/interface';
import { Button } from '../ui/button';

const HomeButton = ({
  title,
  className = '',
  color,
  onClick,
  type = 'button',
  disabled = false,
  bg,
  width,
}: ButtonProps) => {
  return (
    <Button
      disabled={disabled}
      style={{ background: bg, color, width: width }}
      onClick={onClick}
      type={type}
      className={`${className} h-[44px]`}
      // aria-label={title || 'Button'}
    >
      {title}
    </Button>
  );
};

export default HomeButton;
