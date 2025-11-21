/*
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// --- DADOS BASE ---

const categoriesData: Prisma.CategoryCreateInput[] = [
  { name: 'Bebidas', description: 'Líquidos para saciar a sede e alegrar o espírito.' },
  { name: 'Comidas', description: 'Pratos principais e refeições completas.' },
  { name: 'Petiscos', description: 'Porções para compartilhar e beliscar.' },
  { name: 'Sobremesas', description: 'Para adoçar a vida após a refeição.' },
];

const productsData: Omit<Prisma.ProductCreateInput, 'category'>[] = [
  // Bebidas
  { name: 'Cerveja Pilsen 600ml', price: 12.00, categoryId: 'Bebidas' },
  { name: 'Cerveja IPA 500ml', price: 18.50, categoryId: 'Bebidas' },
  { name: 'Refrigerante Lata', price: 6.50, categoryId: 'Bebidas' },
  { name: 'Água Mineral com Gás', price: 4.00, categoryId: 'Bebidas' },
  { name: 'Suco Natural de Laranja 400ml', price: 9.00, categoryId: 'Bebidas' },
  { name: 'Caipirinha de Limão', price: 15.00, categoryId: 'Bebidas' },

  // Comidas
  { name: 'Hambúrguer Clássico', price: 25.00, categoryId: 'Comidas' },
  { name: 'Prato Feito (Carne)', price: 30.00, categoryId: 'Comidas' },
  { name: 'Macarrão à Bolonhesa', price: 28.00, categoryId: 'Comidas' },

  // Petiscos
  { name: 'Porção de Batata Frita', price: 22.00, categoryId: 'Petiscos' },
  { name: 'Anéis de Cebola', price: 20.00, categoryId: 'Petiscos' },
  { name: 'Frango a Passarinho', price: 35.00, categoryId: 'Petiscos' },

  // Sobremesas
  { name: 'Pudim de Leite', price: 10.00, categoryId: 'Sobremesas' },
  { name: 'Mousse de Chocolate', price: 12.00, categoryId: 'Sobremesas' },
];

// --- FUNÇÃO PRINCIPAL DE SEED ---

async function main() {
  console.log('Iniciando o processo de seed...');

  // 1. Limpar tabelas de produtos e categorias
  console.log('Limpando tabelas existentes...');
  await prisma.orderItem.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.wristband.deleteMany({});
  await prisma.cashRegister.deleteMany({});

  // 2. Criar Categorias
  console.log('Criando categorias...');
  await prisma.category.createMany({
    data: categoriesData,
  });
  const categories = await prisma.category.findMany();
  const categoryMap = new Map(categories.map(c => [c.name, c.id]));

  // 3. Criar Produtos
  console.log('Criando produtos...');
  const productsToCreate = productsData.map(p => ({
    ...p,
    categoryId: categoryMap.get(p.categoryId as string) as string,
  }));
  await prisma.product.createMany({
    data: productsToCreate,
  });

  console.log('Seed finalizado com sucesso! Categorias e produtos criados.');
}

// --- EXECUÇÃO ---

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
*/