import { Decimal } from "@prisma/client/runtime/library";

export interface IProductsCreate {
    name: string,
    price: number,
    categoryId: string,
    description?: string,
    stock?: number
};

export interface IProductAddStock {
    quantity: number;
}

export interface IReturnProductsCreate {
  id: string,
  name: string,
  description: string | null,
  price: Decimal,
  stock: number,
  categoryId: string,
  isActive: boolean,
  isSoldOut: boolean,
  createdAt: Date,
  updatedAt: Date
}