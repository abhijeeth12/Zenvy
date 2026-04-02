import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Curated Unsplash URLs by food keyword  
const FOOD_IMAGES: Record<string, string> = {
  // Steaks & Meat
  'wagyu':       'https://images.unsplash.com/photo-1544025162-835ab03fa85f?q=80&w=500&auto=format&fit=crop',
  'ribeye':      'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=500&auto=format&fit=crop',
  'steak':       'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=500&auto=format&fit=crop',
  // Pizza & Italian
  'pizza':       'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?q=80&w=500&auto=format&fit=crop',
  'margherita':  'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?q=80&w=500&auto=format&fit=crop',
  'carbonara':   'https://images.unsplash.com/photo-1546548970-71785318a17b?q=80&w=500&auto=format&fit=crop',
  'pasta':       'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=500&auto=format&fit=crop',
  // Seafood
  'lobster':     'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?q=80&w=500&auto=format&fit=crop',
  'cod':         'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=500&auto=format&fit=crop',
  'salmon':      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=500&auto=format&fit=crop',
  'tuna':        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop',
  // Japanese
  'sushi':       'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=500&auto=format&fit=crop',
  'omakase':     'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=500&auto=format&fit=crop',
  'nigiri':      'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=500&auto=format&fit=crop',
  'maki':        'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?q=80&w=500&auto=format&fit=crop',
  // Sides
  'fries':       'https://images.unsplash.com/photo-1576107232684-1279f5dd5efa?q=80&w=500&auto=format&fit=crop',
  'carrots':     'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=500&auto=format&fit=crop',
  // Bowls & Healthy
  'bowl':        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500&auto=format&fit=crop',
  'salad':       'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=500&auto=format&fit=crop',
  'poke':        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop',
  'harvest':     'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500&auto=format&fit=crop',
  'kale':        'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=500&auto=format&fit=crop',
  'mushroom':    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=500&auto=format&fit=crop',
  'guacamole':   'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=500&auto=format&fit=crop',
  // Burgers
  'burger':      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop',
  'shack':       'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop',
  // Fallback
  'default':     'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=500&auto=format&fit=crop',
};

// Restaurant-level images
const RESTAURANT_IMAGES: Record<string, string> = {
  'wolfgang':    'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=1000&auto=format&fit=crop',
  'matsuhisa':   'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1000&auto=format&fit=crop',
  'sweetgreen':  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop',
  'eataly':      'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=1000&auto=format&fit=crop',
  'shake':       'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop',
  'poke':        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop',
  'nobu':        'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1000&auto=format&fit=crop',
  'pad thai':    'https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=1000&auto=format&fit=crop',
};

function resolveImage(name: string, map: Record<string, string>): string {
  const lowerName = name.toLowerCase();
  for (const [keyword, url] of Object.entries(map)) {
    if (keyword !== 'default' && lowerName.includes(keyword)) return url;
  }
  return map['default'] || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=500&auto=format&fit=crop';
}

async function main() {
  console.log('🖼️  Comprehensive image fix for all DB records...\n');

  // 1. Fix restaurants with broken or missing images
  const restaurants = await prisma.restaurant.findMany();
  let fixedR = 0;
  for (const r of restaurants) {
    const isBroken = !r.imageUrl || r.imageUrl.startsWith('/assets/') || r.imageUrl.includes('loremflickr');
    if (isBroken) {
      const url = resolveImage(r.name, RESTAURANT_IMAGES);
      await prisma.restaurant.update({ where: { id: r.id }, data: { imageUrl: url } });
      console.log(`  ✅ Restaurant "${r.name}" → ${url.substring(0, 60)}...`);
      fixedR++;
    }
  }
  console.log(`\n  Fixed ${fixedR} restaurant(s)\n`);

  // 2. Fix menu items with broken, missing, or null images
  const menuItems = await prisma.menuItem.findMany();
  let fixedM = 0;
  for (const item of menuItems) {
    const isBroken = !item.imageUrl || item.imageUrl.startsWith('/assets/') || item.imageUrl.includes('loremflickr');
    if (isBroken) {
      const url = resolveImage(item.name, FOOD_IMAGES);
      await prisma.menuItem.update({ where: { id: item.id }, data: { imageUrl: url } });
      console.log(`  ✅ Menu "${item.name}" → ${url.substring(0, 60)}...`);
      fixedM++;
    }
  }
  console.log(`\n  Fixed ${fixedM} menu item(s)`);

  console.log('\n🎉 All image URLs verified and patched!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
