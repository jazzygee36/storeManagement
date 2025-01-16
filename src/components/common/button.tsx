import React from 'react';
import { ButtonProps } from '../utils/interface';
import { Button } from '../ui/button';

const HomeButton = ({
  title,
  className,
  color,
  onClick,
  type,
  disabled,
}: ButtonProps) => {
  return (
    <Button
      disabled={disabled}
      style={{ color: color }}
      onClick={onClick}
      type={type}
      className={`${className} h-[44px]`}
    >
      {title}
    </Button>
  );
};

export default HomeButton;
