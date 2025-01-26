import { ReactNode } from 'react';

export interface InputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  mt?: string;
  readOnly?: boolean;
  onInputChange?: (value: string) => void;
  defaultValue?: string | number;
  onKeyPress?: React.KeyboardEventHandler<HTMLInputElement>;
}

export interface ButtonProps {
  title: ReactNode;
  className?: string;
  type?: 'submit' | 'button';
  color: string;
  onClick?: () => void;
  disabled?: boolean;
  bg?: string;
  width?: string;
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

// types.ts
export type PaymentType =
  | 'Transfer'
  | 'Cash'
  | 'POS'
  | 'Cash & Transfer'
  | 'Cash & POS';

export interface Sale {
  id: string;
  productName?: string; // Optional productName
  qtySold: number;
  sellingPrice: number;
  totalPrice: number;
  paymentMethod: string; // paymentMethod should be a Status type, not a string
}
