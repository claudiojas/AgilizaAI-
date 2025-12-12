// Table Types
export interface Table {
  id: string;
  number: number;
  isActive: boolean;
  hasActiveSession?: boolean;
  activeSession?: Session;
}

// Session Types
export interface Session {
  id: string;
  tableId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  orders?: Order[];
}

// Order Types
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED' | 'PAID';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
}

export interface Order {
  id: string;
  sessionId: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  orderItems?: OrderItem[];
  session?: {
    id: string;
    tableId: string;
    table?: {
      id: string;
      number: number;
    };
  };
}

// Product Types
export interface Category {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null; // Added imageUrl
  stock: number;
  categoryId: string;
  category?: Category;
  isActive: boolean;
  isSoldOut: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// WebSocket Events
export interface WSNewOrderEvent {
  type: 'NEW_ORDER';
  payload: Order;
}

export interface WSOrderStatusEvent {
  type: 'ORDER_STATUS_UPDATED';
  payload: {
    orderId: string;
    status: OrderStatus;
  };
}

export type WSEvent = WSNewOrderEvent | WSOrderStatusEvent;

// Payment Types
export type PaymentMethod = 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX';

// Cash Register Types
export type CashRegisterStatus = 'OPEN' | 'CLOSED';

export interface CashRegister {
  id: string;
  status: CashRegisterStatus;
  openedAt: string;
  closedAt?: string | null;
  initialValue: number;
  totalInvoiced?: number;
  totalPayments?: number;
}

// Interfaces for Cash Register Details
export interface IPaymentBreakdown {
  method: string;
  total: number;
}

export interface ISoldProduct {
  productId: string;
  name: string;
  quantity: number;
  totalValue: number;
}

export interface IActiveCashRegisterDetails {
  id: string;
  openedAt: string;
  initialValue: number;
  totalPayments: number;
  finalValue: number;
  paymentsBreakdown: IPaymentBreakdown[];
  soldProducts: ISoldProduct[];
}