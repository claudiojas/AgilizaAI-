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
