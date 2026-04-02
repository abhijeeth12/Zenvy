import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🖼️  Fixing /assets/* image URLs in database...');

  // Fix restaurant image
  const r = await prisma.restaurant.updateMany({
    where: { imageUrl: { startsWith: '/assets/' } },
    data: { imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=1000&auto=format&fit=crop' },
  });
  console.log(`  ✅ Fixed ${r.count} restaurant(s)`);

  // Fix specific menu items by name
  const fixes: { name: string; imageUrl: string }[] = [
    {
      name: 'Japanese Wagyu A5',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-835ab03fa85f?q=80&w=500&auto=format&fit=crop',
    },
    {
      name: 'Margherita Pizza',
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?q=80&w=500&auto=format&fit=crop',
    },
    {
      name: 'Crinkle Cut Fries',
      imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f5dd5efa?q=80&w=500&auto=format&fit=crop',
    },
  ];

  for (const fix of fixes) {
    const updated = await prisma.menuItem.updateMany({
      where: { name: fix.name, imageUrl: { startsWith: '/assets/' } },
      data: { imageUrl: fix.imageUrl },
    });
    if (updated.count > 0) {
      console.log(`  ✅ Fixed "${fix.name}" (${updated.count} record(s))`);
    }
  }

  console.log('\n🎉 All image URLs are now up-to-date!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
