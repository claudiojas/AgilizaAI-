import { PrismaClient, Prisma } from '@prisma/client';
import { prisma } from '../src/BD/prisma.config';

const categoriesData: Prisma.CategoryCreateInput[] = [
  { name: 'Entradas', description: 'Para abrir o apetite.' },
  { name: 'Pratos Principais', description: 'O coração da nossa cozinha.' },
  { name: 'Hambúrgueres', description: 'Artesanais e suculentos, servidos no pão brioche.' },
  { name: 'Sobremesas', description: 'Para adoçar o final da sua refeição.' },
  { name: 'Bebidas não Alcoólicas', description: 'Sucos, refrigerantes e águas.' },
  { name: 'Cervejas', description: 'Uma seleção de cervejas artesanais e tradicionais.' },
  { name: 'Drinks e Coquetéis', description: 'Clássicos e autorais, preparados na hora.' },
];

const productsData = [
    // Entradas
    { name: 'Batata Frita com Cheddar e Bacon', description: 'Porção generosa de batatas fritas crocantes, cobertas com queijo cheddar cremoso e bacon em cubos.', price: 35.90, stock: 100, imageUrl: 'https://source.unsplash.com/800x600/?fries-cheddar-bacon' },
    { name: 'Dadinho de Tapioca', description: 'Cubos de tapioca com queijo coalho, fritos e servidos com geleia de pimenta agridoce.', price: 29.90, stock: 80, imageUrl: 'https://source.unsplash.com/800x600/?tapioca-dice' },
    { name: 'Pastel de Carne Seca', description: 'Porção com 6 unidades de pastéis recheados com carne seca desfiada e catupiry.', price: 32.00, stock: 70, imageUrl: 'https://source.unsplash.com/800x600/?pastel' },
    { name: 'Bruschetta Tradicional', description: 'Fatias de pão italiano tostado com azeite, alho, tomate fresco picado e manjericão.', price: 25.50, stock: 50, imageUrl: 'https://source.unsplash.com/800x600/?bruschetta' },

    // Pratos Principais
    { name: 'Picanha na Chapa', description: '500g de picanha fatiada, servida na chapa com arroz, farofa, vinagrete e fritas.', price: 129.90, stock: 30, imageUrl: 'https://source.unsplash.com/800x600/?picanha' },
    { name: 'Salmão ao Molho de Maracujá', description: 'Posta de salmão grelhado coberto com molho de maracujá, acompanhado de risoto de limão siciliano.', price: 89.90, stock: 25, imageUrl: 'https://source.unsplash.com/800x600/?salmon-dish' },
    { name: 'Filé Mignon ao Molho Madeira', description: 'Medalhão de filé mignon grelhado, regado com molho madeira e champignon, acompanha batatas gratinadas.', price: 95.00, stock: 35, imageUrl: 'https://source.unsplash.com/800x600/?filet-mignon' },
    { name: 'Risoto de Camarão', description: 'Arroz arbóreo cremoso com camarões frescos, tomate cereja e um toque de azeite de dendê.', price: 79.90, stock: 20, imageUrl: 'https://source.unsplash.com/800x600/?shrimp-risotto' },

    // Hambúrgueres
    { name: 'Burger da Casa', description: 'Pão brioche, hambúrguer de 180g, queijo prato, alface, tomate, cebola roxa e nosso molho especial.', price: 38.50, stock: 90, imageUrl: 'https://source.unsplash.com/800x600/?burger' },
    { name: 'Bacon Burger', description: 'Pão brioche, hambúrguer de 180g, queijo cheddar, fatias crocantes de bacon, picles e molho barbecue.', price: 42.00, stock: 85, imageUrl: 'https://source.unsplash.com/800x600/?bacon-burger' },
    { name: 'Smash Burger Duplo', description: 'Dois hambúrgueres de 100g prensados na chapa, queijo americano, pão brioche e maionese da casa.', price: 39.90, stock: 120, imageUrl: 'https://source.unsplash.com/800x600/?smash-burger' },

    // Sobremesas
    { name: 'Pudim de Leite Condensado', description: 'O clássico pudim de leite, com calda de caramelo e textura perfeita.', price: 18.00, stock: 40, imageUrl: 'https://source.unsplash.com/800x600/?pudding' },
    { name: 'Petit Gateau', description: 'Bolinho de chocolate com interior cremoso, servido quente com uma bola de sorvete de creme.', price: 28.50, stock: 35, imageUrl: 'https://source.unsplash.com/800x600/?petit-gateau' },
    { name: 'Cheesecake de Frutas Vermelhas', description: 'Torta de queijo cremosa com base de biscoito e cobertura de geleia de frutas vermelhas.', price: 32.00, stock: 25, imageUrl: 'https://source.unsplash.com/800x600/?cheesecake' },

    // Bebidas não Alcoólicas
    { name: 'Coca-Cola Lata', description: '350ml', price: 6.00, stock: 200, imageUrl: 'https://source.unsplash.com/800x600/?coca-cola' },
    { name: 'Guaraná Antarctica Lata', description: '350ml', price: 6.00, stock: 200, imageUrl: 'https://source.unsplash.com/800x600/?soda-can' },
    { name: 'Suco de Laranja Natural', description: '500ml, feito na hora.', price: 12.00, stock: 150, imageUrl: 'https://source.unsplash.com/800x600/?orange-juice' },
    { name: 'Água Mineral com Gás', description: '300ml', price: 5.00, stock: 300, imageUrl: 'https://source.unsplash.com/800x600/?sparkling-water' },
    { name: 'Água Mineral sem Gás', description: '300ml', price: 5.00, stock: 300, imageUrl: 'https://source.unsplash.com/800x600/?water-bottle' },

    // Cervejas
    { name: 'Heineken Long Neck', description: '330ml', price: 12.00, stock: 150, imageUrl: 'https://source.unsplash.com/800x600/?heineken-beer' },
    { name: 'Corona Extra Long Neck', description: '330ml, acompanha fatia de limão.', price: 13.50, stock: 120, imageUrl: 'https://source.unsplash.com/800x600/?corona-beer' },
    { name: 'Eisenbahn Pilsen', description: '600ml', price: 18.00, stock: 80, imageUrl: 'https://source.unsplash.com/800x600/?beer-bottle' },
    { name: 'Baden Baden IPA', description: '600ml, cerveja forte e amarga.', price: 25.00, stock: 60, imageUrl: 'https://source.unsplash.com/800x600/?craft-beer' },

    // Drinks e Coquetéis
    { name: 'Caipirinha de Limão', description: 'Cachaça, limão, açúcar e gelo. A clássica brasileira.', price: 22.00, stock: 100, imageUrl: 'https://source.unsplash.com/800x600/?caipirinha' },
    { name: 'Gin Tônica', description: 'Gin, água tônica, uma fatia de limão siciliano e especiarias.', price: 30.00, stock: 100, imageUrl: 'https://source.unsplash.com/800x600/?gin-tonic' },
    { name: 'Aperol Spritz', description: 'Aperol, prosecco e água com gás. O queridinho da Europa.', price: 35.00, stock: 80, imageUrl: 'https://source.unsplash.com/800x600/?aperol-spritz' },
];

async function main() {
  console.log(`Start seeding ...`);

  console.log('Deleting existing data...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  console.log('Creating categories...');
  await prisma.category.createMany({
    data: categoriesData,
  });

  const categories = await prisma.category.findMany();
  const categoryMap = new Map(categories.map(c => [c.name, c.id]));

  const productsToCreate = productsData.map(p => {
    let categoryName: string;
    if (p.name.includes('Batata') || p.name.includes('Dadinho') || p.name.includes('Pastel') || p.name.includes('Bruschetta')) {
        categoryName = 'Entradas';
    } else if (p.name.includes('Picanha') || p.name.includes('Salmão') || p.name.includes('Filé Mignon') || p.name.includes('Risoto')) {
        categoryName = 'Pratos Principais';
    } else if (p.name.includes('Burger')) {
        categoryName = 'Hambúrgueres';
    } else if (p.name.includes('Pudim') || p.name.includes('Petit Gateau') || p.name.includes('Cheesecake')) {
        categoryName = 'Sobremesas';
    } else if (p.name.includes('Coca-Cola') || p.name.includes('Guaraná') || p.name.includes('Suco') || p.name.includes('Água')) {
        categoryName = 'Bebidas não Alcoólicas';
    } else if (p.name.includes('Heineken') || p.name.includes('Corona') || p.name.includes('Eisenbahn') || p.name.includes('Baden Baden')) {
        categoryName = 'Cervejas';
    } else {
        categoryName = 'Drinks e Coquetéis';
    }

    return {
      ...p,
      categoryId: categoryMap.get(categoryName)!,
    };
  });

  console.log('Creating products...');
  await prisma.product.createMany({
    data: productsToCreate,
  });

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
