import { ReactNode } from 'react';

export interface InputProps {
  label?: string;
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  mt?: string;
}

export interface ButtonProps {
  title: string;
  bg: string;
  type?: 'submit' | 'button';
  color: string;
  onClick?: () => void;
  disabled?: boolean;
}

export interface PaperProps {
  title: string;
  container?: ReactNode;
  input?: boolean;
  onInputChange?: (value: string) => void;
}

export interface LocalProductItem {
  product: string;
  buyingPrice: number;
  qty: number;
  sellingPrice: number;
  exp: null;
  status: string;
  purchaseAmt: number;
  amtGain: number;
  availability: string;
  // qtyRemaning: number;
  qtyRemaining: number;
  id?: string;
}

export interface ProductItem {
  _id?: string;
  productName: string;
  unitPrice: number;
  qtyBought: number;
  goodsValue: number;
  salesPrice: number;
  qtySold: number;
  salesValue: number;
  qtyRemaining: number;
  exp: null;
  availability: string;
  // qtyRemaning: number;
  purchaseAmt: number;
  amtGain: number;
  status: string;
}
