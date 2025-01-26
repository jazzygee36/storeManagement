'use client';
import { useState } from 'react';
import { InputProps } from '../utils/interface';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import VisibilityIcon from '@/components/assets/icons/visibleEye';
import VisibilityOffIcon from '@/components/assets/icons/closeEye';

const HomeInput = ({
  name,
  label,
  placeholder,
  type,
  value,
  onChange,
  readOnly,
  defaultValue,
  onInputChange,
  onKeyPress,
}: InputProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  const handleTogglePassword = () => {
    setVisible(!visible);
  };

  return (
    <div className='grid gap-2'>
      {label && <Label htmlFor={name}>{label}</Label>}
      <div className='relative'>
        <Input
          id={name}
          name={name}
          value={value}
          onChange={(e) => {
            onChange?.(e); // Call onChange directly if provided
            onInputChange?.(e.target.value); // Call onInputChange with value if provided
          }}
          type={visible ? 'text' : type}
          placeholder={placeholder}
          readOnly={readOnly}
          defaultValue={defaultValue}
          onKeyPress={onKeyPress}
          className='w-full'
        />
        {type === 'password' && (
          <div
            className='absolute cursor-pointer top-2 right-2'
            onClick={handleTogglePassword}
          >
            {visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeInput;
