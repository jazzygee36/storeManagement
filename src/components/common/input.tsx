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
  mt,
  readOnly,
}: InputProps) => {
  return (
    <div className={`grid gap-2 `}>
      <Label>{label}</Label>
      <Input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        readOnly={readOnly}
      />
    </div>
  );
};

export default HomeInput;
