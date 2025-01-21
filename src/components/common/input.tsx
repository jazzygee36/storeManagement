import React from 'react';
import { InputProps } from '../utils/interface';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

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
}: InputProps) => {
  return (
    <div className='grid gap-2'>
      {label && <Label htmlFor={name}>{label}</Label>}
      <Input
        id={name}
        name={name}
        value={value}
        onChange={(e) => {
          onChange?.(e); // Call onChange directly if provided
          onInputChange?.(e.target.value); // Call onInputChange with value if provided
        }}
        type={type}
        placeholder={placeholder}
        readOnly={readOnly}
        defaultValue={defaultValue}
      />
    </div>
  );
};

export default HomeInput;
