/*
import { describe, it, expect, beforeEach, afterAll, beforeAll } from 'vitest';
import supertest from 'supertest';
import { App } from '../../app';
import { PrismaClient } from '@prisma/client';

// Single app instance for all tests
const appInstance = new App();
appInstance.register();
const server = appInstance.getServer();
const prisma = new PrismaClient();

describe('API Routes', () => {

  beforeAll(async () => {
    await server.ready();
  });

  // Runs before EACH test, ensuring a clean slate
  beforeEach(async () => {
    await prisma.orderItem.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.wristband.deleteMany();
    await prisma.cashRegister.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await server.close();
  });

  // --- Category Tests ---

  it('should be able to create a new category', async () => {
    const categoryData = { name: 'Petiscos', isActive: true };
    const response = await supertest(server.server).post('/categorie').send(categoryData);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should be able to list products by category', async () => {
    const category = await prisma.category.create({ data: { name: 'Vinhos', isActive: true } });
    const product = await prisma.product.create({
      data: { name: 'Vinho Tinto Seco', price: 75.00, categoryId: category.id }
    });
    const response = await supertest(server.server).get(`/categories/${category.id}/products`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty('id', product.id);
  });

  // --- Product Tests ---

  it('should be able to create a new product', async () => {
    const category = await prisma.category.create({ data: { name: 'Bebidas', isActive: true } });
    const productData = { name: 'Cerveja IPA', price: 15.50, categoryId: category.id };
    const response = await supertest(server.server).post('/products').send(productData);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should be able to list all products', async () => {
    const category = await prisma.category.create({ data: { name: 'Lanches', isActive: true } });
    await prisma.product.createMany({
      data: [
        { name: 'Hambúrguer', price: 25.00, categoryId: category.id },
        { name: 'Batata Frita', price: 12.00, categoryId: category.id },
      ]
    });
    const response = await supertest(server.server).get('/products');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2); // This should work now
  });

  it('should be able to update a product', async () => {
    const category = await prisma.category.create({ data: { name: 'Sobremesas', isActive: true } });
    const product = await prisma.product.create({
      data: { name: 'Pudim', price: 10.00, categoryId: category.id }
    });
    const updatedData = { name: 'Pudim de Leite', price: 11.50 };
    const response = await supertest(server.server).put(`/products/${product.id}`).send(updatedData);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updatedData.name);
  });

  // --- Wristband Tests ---

  it('should be able to create a new wristband', async () => {
    const wristbandData = { code: 'WRIST-001', qrCode: 'qr-data-001' };
    const response = await supertest(server.server).post('/wristbands').send(wristbandData);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.code).toBe('WRIST-001');
  });

  it('should be able to find a wristband by code', async () => {
    const wristband = await prisma.wristband.create({
      data: { code: 'WRIST-002', qrCode: 'qr-data-002' }
    });
    const response = await supertest(server.server).get(`/wristbands/${wristband.code}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(wristband.id);
  });

  // --- Order Tests ---

  it('should be able to create a new order for a wristband', async () => {
    await supertest(server.server).post('/cash-register/open').send({ initialValue: 100 });
    const wristband = await prisma.wristband.create({
      data: { code: 'WRIST-003', qrCode: 'qr-data-003' }
    });
    const response = await supertest(server.server).post('/orders').send({ wristbandId: wristband.id, orderValue: 50.00 });
    expect(response.status).toBe(201);
    expect(response.body.wristbandId).toBe(wristband.id);
    expect(response.body.status).toBe('PENDING');
  });

  it('should be able to list orders by wristband', async () => {
    const cashRegister = await prisma.cashRegister.create({ data: { initialValue: 100 } });
    const wristband = await prisma.wristband.create({
      data: { code: 'WRIST-004', qrCode: 'qr-data-004' }
    });
    const order = await prisma.order.create({
      data: { wristbandId: wristband.id, cashRegisterId: cashRegister.id }
    });
    const response = await supertest(server.server).get(`/orders/${wristband.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].id).toBe(order.id);
  });

  it('should be able to add an item to an order', async () => {
    const cashRegister = await prisma.cashRegister.create({ data: { initialValue: 100 } });
    const category = await prisma.category.create({ data: { name: 'Sucos', isActive: true } });
    const product = await prisma.product.create({
      data: { name: 'Suco de Abacaxi', price: 9.00, categoryId: category.id }
    });
    const wristband = await prisma.wristband.create({
      data: { code: 'WRIST-005', qrCode: 'qr-data-005' }
    });
    const order = await prisma.order.create({
      data: { wristbandId: wristband.id, cashRegisterId: cashRegister.id }
    });

    const itemData = {
      productId: product.id,
      quantity: 2,
      unitPrice: 9.00, // In a real app, you'd fetch this from the product
      totalPrice: 18.00
    };

    const response = await supertest(server.server).post(`/orders/${order.id}/items`).send(itemData);
    expect(response.status).toBe(201);
    expect(response.body.productId).toBe(product.id);
    expect(response.body.quantity).toBe(2);
  });
});
*/