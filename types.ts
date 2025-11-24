export interface Product {
  id: string;
  name: string;
  price: number;
  costPrice: number; // Added for profit calculation
  icon: string;
  category?: string;
  stock: number;
}

export interface CartItem extends Product {
  qty: number;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  category: string;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  totalSpent: number;
  visits: number;
  lastVisit: string;
  debt: number; // Added for tracking debts
}

export type PaymentMethod = 'cash' | 'credit';

export interface Transaction {
  id: string;
  date: string;
  total: number;
  profit: number;
  type: 'sale' | 'repayment'; // Sale or Debt Repayment
  paymentMethod: PaymentMethod;
  customerId?: string; // If credit or repayment
  items?: CartItem[];
}