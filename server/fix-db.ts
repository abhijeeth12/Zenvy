import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.menuItem.updateMany({
    where: { name: 'Crinkle Cut Fries' },
    data: { imageUrl: '/assets/crinkle_cut_fries.png' }
  });
  console.log('Updated Crinkle Cut Fries');

  await prisma.menuItem.updateMany({
    where: { name: 'Japanese Wagyu A5' },
    data: { imageUrl: '/assets/japanese_wagyu.png' }
  });
  console.log('Updated Japanese Wagyu A5');

  await prisma.menuItem.updateMany({
    where: { name: 'Margherita Pizza' },
    data: { imageUrl: '/assets/margherita_pizza.png' }
  });
  console.log('Updated Margherita Pizza');

  // Also update Restaurant image
  await prisma.restaurant.updateMany({
    where: { name: 'Cut by Wolfgang Puck' },
    data: { imageUrl: '/assets/wolfgang_puck.png' }
  });
  console.log('Updated Cut by Wolfgang Puck');

  console.log('DB Update complete');
}

main().catch(console.error).finally(() => prisma.$disconnect());
