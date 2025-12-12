// Session & Table
export interface Session {
  id: string;
  code: string;
  tableId: string;
  status: 'ACTIVE' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
}

// Products & Categories
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
  description: string | null;
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

// Cart
export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

// Orders
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED' | 'PAID';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt?: string;
}

export interface Order {
  id: string;
  sessionId: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  orderItems?: OrderItem[];
}

// WebSocket Events
export interface WSMessage {
  type: 'ORDER_STATUS_UPDATED' | 'SESSION_UPDATED' | 'NEW_ORDER';
  payload: unknown;
}
