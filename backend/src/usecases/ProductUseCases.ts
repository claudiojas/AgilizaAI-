import ProductsRepository from "../repositories/ProductsRepository";
import { IProductsCreate } from "../interfaces/products.interface";
import { z } from "zod";

const productCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().positive("Price must be a positive number"),
  categoryId: z.string().min(1, "Category ID is required"),
  description: z.string().optional(),
  stock: z.number().int().optional(),
});

const productUpdateSchema = productCreateSchema.partial();

const addStockSchema = z.object({
  quantity: z.number().int().positive("Quantity must be a positive integer"),
});

class ProductUseCases {
  async createProduct(data: IProductsCreate) {
    const validatedData = productCreateSchema.parse(data);
    return ProductsRepository.createProduct(validatedData);
  }

  async getProducts() {
    return ProductsRepository.getProducts();
  }

  async updateProduct(id: string, data: Partial<IProductsCreate>) {
    const productExists = await ProductsRepository.findProductById(id);
    if (!productExists) {
      throw new Error("Product not found");
    }

    const validatedData = productUpdateSchema.parse(data);
    return ProductsRepository.updateProduct(id, validatedData);
  }

  async addStock(id: string, data: { quantity: number }) {
    const productExists = await ProductsRepository.findProductById(id);
    if (!productExists) {
      throw new Error("Product not found");
    }

    const { quantity } = addStockSchema.parse(data);
    return ProductsRepository.addStock(id, quantity);
  }

  async getProductsByCategoryId(id: string) {
    return ProductsRepository.getProductsByCategoryId(id);
  }

  async markAsSoldOut(id: string) {
    const productExists = await ProductsRepository.findProductById(id);
    if (!productExists) {
      throw new Error("Product not found");
    }
    return ProductsRepository.markAsSoldOut(id);
  }

  async markAsAvailable(id: string) {
    const productExists = await ProductsRepository.findProductById(id);
    if (!productExists) {
      throw new Error("Product not found");
    }
    return ProductsRepository.markAsAvailable(id);
  }

  async deleteProduct(id: string) {
    const productExists = await ProductsRepository.findProductById(id);
    if (!productExists) {
      throw new Error("Product not found");
    }
    return ProductsRepository.deleteProduct(id);
  }
}

export default new ProductUseCases();
