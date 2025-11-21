import { IProductsCreate, IReturnProductsCreate } from '../interfaces/products.interface';
import { IProductsMethods } from '../interfaces/methods.interface';
import { prisma } from '../BD/prisma.config';

class ProductsRepository implements IProductsMethods {
  async createProduct(data: IProductsCreate): Promise<IReturnProductsCreate> {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        price: data.price,
        description: data.description,
        stock: data.stock,
        category: {
          connect: {
            id: data.categoryId,
          },
        },
      },
    });
    return product;
  }

  async getProducts(): Promise<IReturnProductsCreate[]> {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    });
    return products;
  }

  async updateProduct(id: string, data: Partial<IProductsCreate>): Promise<IReturnProductsCreate> {
    const product = await prisma.product.update({
      where: { id },
      data,
    });
    return product;
  }

  async findProductById(id: string): Promise<IReturnProductsCreate | null> {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    return product;
  }

  async getProductsByCategoryId(id: string): Promise<IReturnProductsCreate[] | null> {
    const products = await prisma.product.findMany({
        where: {
            categoryId: id,
        },
    });
    return products;
  }

  async addStock(id: string, quantity: number): Promise<IReturnProductsCreate> {
    const product = await prisma.product.update({
      where: { id },
      data: { stock: { increment: quantity } },
    });
    return product;
  }

  async markAsSoldOut(id: string): Promise<IReturnProductsCreate> {
    const product = await prisma.product.update({
      where: { id },
      data: { isSoldOut: true },
    });
    return product;
  }

  async markAsAvailable(id: string): Promise<IReturnProductsCreate> {
    const product = await prisma.product.update({
      where: { id },
      data: { isSoldOut: false },
    });
    return product;
  }
}

export default new ProductsRepository();
