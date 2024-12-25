import { ReactNode } from 'react';

export interface InputProps {
  label?: string;
  placeholder: string;
  type?: string;
}

export interface ButtonProps {
  title: string;
  bg: string;
  type?: 'submit' | 'button';
  color: string;
  onClick?: () => void;
}

export interface PaperProps {
  title: string;
  container?: ReactNode;
}

export interface ProductProps {
  product: string;
  buyingPrice: string;
  qty: string;
  sellingPrice: string;
  exp: string;
  status: string;
  purchaseAmt?: string;
  amtGain?: string;
}
