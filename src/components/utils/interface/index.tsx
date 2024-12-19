export interface InputProps {
  label?: string;
  placeholder: string;
  type: string;
}

export interface ButtonProps {
  title: string;
  bg: string;
  type: 'Submit' | 'Button';
  color: string;
}

export interface PaperProps {
  title: string;
  container?: any;
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
