import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Fixing Restaurant images...');
  const restaurants = await prisma.restaurant.findMany({
    where: { imageUrl: { contains: 'unsplash.com' } }
  });

  for (const [index, r] of restaurants.entries()) {
    await prisma.restaurant.update({
      where: { id: r.id },
      data: { imageUrl: `https://loremflickr.com/800/600/restaurant,food?lock=${index}` }
    });
  }

  console.log('Fixing Menu Item images...');
  const menuItems = await prisma.menuItem.findMany({
    where: { imageUrl: { contains: 'unsplash.com' } }
  });

  for (const [index, m] of menuItems.entries()) {
    const category = m.category.toLowerCase();
    const keyword = category.includes('pizza') ? 'pizza' : category.includes('drink') ? 'drink' : 'dish,food';
    await prisma.menuItem.update({
      where: { id: m.id },
      data: { imageUrl: `https://loremflickr.com/500/500/${keyword}?lock=${index + 100}` }
    });
  }

  console.log('Done fixing images!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
