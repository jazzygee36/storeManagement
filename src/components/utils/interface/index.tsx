import { ReactNode } from 'react';

export interface InputProps {
  label?: string;
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
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
}

export interface LocalProductItem {
  product: string;
  buyingPrice: string;
  qty: string;
  sellingPrice: string;
  exp: string;
  status: string;
  purchaseAmt: string;
  amtGain: string;
  qtyRemaning: string;
}

export interface ProductItem {
  // "_id": "676b1b6602d4fa6966fe0f64",
  productName: string;
  unitPrice: number;
  qtyBought: number;
  goodsValue: number;
  salesPrice: number;
  qtySold: number;
  salesValue: number;
  remainingItems: number;
  exp: null;
  availability: string;
  qtyRemaning: number;
  purchaseAmt: number;
  amtGain: number;
  status: string;
}
