import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Admin User ────────────────────────────────────
  const adminPassword = await bcrypt.hash('admin123456', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@zenvy.com' },
    update: {},
    create: {
      email: 'admin@zenvy.com',
      passwordHash: adminPassword,
      displayName: 'Zenvy Admin',
      role: 'ADMIN',
      isVerified: true,
    },
  });
  console.log(`  ✅ Admin user: ${admin.email}`);

  // ─── Test User ─────────────────────────────────────
  const userPassword = await bcrypt.hash('password123', 12);
  const testUser = await prisma.user.upsert({
    where: { email: 'user@zenvy.com' },
    update: {},
    create: {
      email: 'user@zenvy.com',
      passwordHash: userPassword,
      displayName: 'Alex Chen',
      role: 'USER',
      isVerified: true,
    },
  });
  console.log(`  ✅ Test user: ${testUser.email}`);

  // ─── Restaurants ───────────────────────────────────
  const matsuhisa = await prisma.restaurant.upsert({
    where: { slug: 'matsuhisa-omakase' },
    update: {},
    create: {
      name: 'Matsuhisa Omakase',
      slug: 'matsuhisa-omakase',
      cuisine: 'Japanese',
      description: 'Premium omakase experience with the finest seasonal ingredients.',
      address: '129 N La Cienega Blvd, Beverly Hills, CA 90211',
      imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1000&auto=format&fit=crop',
      rating: 4.9,
      latitude: 34.0696,
      longitude: -118.3764,
    },
  });

  const wolfgangPuck = await prisma.restaurant.upsert({
    where: { slug: 'cut-by-wolfgang-puck' },
    update: {},
    create: {
      name: 'Cut by Wolfgang Puck',
      slug: 'cut-by-wolfgang-puck',
      cuisine: 'Steakhouse',
      description: 'World-renowned steaks with impeccable service.',
      address: '9500 Wilshire Blvd, Beverly Hills, CA 90212',
      imageUrl: '/assets/wolfgang_puck.png',
      rating: 4.7,
      latitude: 34.0652,
      longitude: -118.3997,
    },
  });

  const sweetgreen = await prisma.restaurant.upsert({
    where: { slug: 'sweetgreen-artisan' },
    update: {},
    create: {
      name: 'Sweetgreen Artisan',
      slug: 'sweetgreen-artisan',
      cuisine: 'Healthy',
      description: 'Farm-to-table bowls crafted with locally-sourced ingredients.',
      address: '300 S Beverly Dr, Beverly Hills, CA 90212',
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop',
      rating: 4.5,
      latitude: 34.0622,
      longitude: -118.3987,
    },
  });

  const eataly = await prisma.restaurant.upsert({
    where: { slug: 'eataly-express' },
    update: {},
    create: {
      name: 'Eataly Express',
      slug: 'eataly-express',
      cuisine: 'Italian',
      description: 'Authentic Italian pasta and pizza on the go.',
      address: '10250 Santa Monica Blvd, Los Angeles, CA 90067',
      imageUrl: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=1000&auto=format&fit=crop',
      rating: 4.7,
      latitude: 34.0583,
      longitude: -118.4168,
    },
  });

  const shakeShack = await prisma.restaurant.upsert({
    where: { slug: 'shake-shack-premium' },
    update: {},
    create: {
      name: 'Shake Shack Premium',
      slug: 'shake-shack-premium',
      cuisine: 'American',
      description: 'Classic American burgers and shakes with a modern twist.',
      address: '8520 Santa Monica Blvd, West Hollywood, CA 90069',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop',
      rating: 4.5,
      latitude: 34.0905,
      longitude: -118.3768,
    },
  });

  const pokeParadise = await prisma.restaurant.upsert({
    where: { slug: 'poke-paradise' },
    update: {},
    create: {
      name: 'Poke Paradise',
      slug: 'poke-paradise',
      cuisine: 'Hawaiian',
      description: 'Fresh Hawaiian poke bowls made to order.',
      address: '735 S Figueroa St, Los Angeles, CA 90017',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop',
      rating: 4.7,
      latitude: 34.0487,
      longitude: -118.2599,
    },
  });

  console.log(`  ✅ Restaurants: ${matsuhisa.name}, ${wolfgangPuck.name}, ${sweetgreen.name}, ${eataly.name}, ${shakeShack.name}, ${pokeParadise.name}`);

  // ─── Menu Items (Matsuhisa) ────────────────────────
  await prisma.menuItem.createMany({
    data: [
      { restaurantId: matsuhisa.id, name: 'Omakase Signature Set', description: 'Chef selection of 12 premium seasonal cuts.', price: 125, batchPrice: 95, category: 'Signature', sortOrder: 1, imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80' },
      { restaurantId: matsuhisa.id, name: 'Toro Truffle Nigiri', description: 'Fatty tuna with black truffle shaving.', price: 35, batchPrice: 28, category: 'Nigiri', sortOrder: 2, imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=500&q=80' },
      { restaurantId: matsuhisa.id, name: 'Spicy Wagyu Maki', description: 'A5 Wagyu beef, scallion, spicy aioli.', price: 42, batchPrice: 32, category: 'Maki', sortOrder: 3, imageUrl: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=500&q=80' },
      { restaurantId: matsuhisa.id, name: 'Yuzu Miso Cod', description: 'Black cod marinated for 48 hours.', price: 58, batchPrice: 45, category: 'Main', sortOrder: 4, imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&q=80' },
    ],
    skipDuplicates: true,
  });

  // ─── Menu Items (Wolfgang Puck) ────────────────────
  await prisma.menuItem.createMany({
    data: [
      { restaurantId: wolfgangPuck.id, name: 'USDA Prime Bone-In Ribeye', description: '16oz dry-aged 35 days, served with bone marrow.', price: 85, batchPrice: 68, category: 'Steaks', sortOrder: 1, imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?w=500&q=80' },
      { restaurantId: wolfgangPuck.id, name: 'Japanese Wagyu A5', description: 'Miyazaki tenderloin, 4oz, with truffle butter.', price: 150, batchPrice: 120, category: 'Steaks', sortOrder: 2, imageUrl: '/assets/japanese_wagyu.png' },
      { restaurantId: wolfgangPuck.id, name: 'Lobster Oscar', description: 'Maine lobster with asparagus and béarnaise.', price: 65, batchPrice: 52, category: 'Seafood', sortOrder: 3, imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80' },
      { restaurantId: wolfgangPuck.id, name: 'Maple-Glazed Carrots', description: 'Heirloom carrots with hazelnut praline.', price: 18, batchPrice: 14, category: 'Sides', sortOrder: 4, imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=80' },
    ],
    skipDuplicates: true,
  });

  // ─── Menu Items (Sweetgreen) ───────────────────────
  await prisma.menuItem.createMany({
    data: [
      { restaurantId: sweetgreen.id, name: 'Harvest Bowl', description: 'Warm quinoa, roasted chicken, sweet potatoes, apples.', price: 14, batchPrice: 11, category: 'Bowls', sortOrder: 1, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80' },
      { restaurantId: sweetgreen.id, name: 'Kale Caesar', description: 'Shaved parmesan, focaccia croutons, lemon caesar.', price: 12, batchPrice: 9, category: 'Bowls', sortOrder: 2, imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&q=80' },
      { restaurantId: sweetgreen.id, name: 'Shroomami', description: 'Warm wild rice, roasted mushrooms, tofu, miso sesame.', price: 13, batchPrice: 10, category: 'Bowls', sortOrder: 3, imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=80' },
      { restaurantId: sweetgreen.id, name: 'Guacamole Greens', description: 'Avocado, black beans, tortilla chips, lime cilantro.', price: 14, batchPrice: 11, category: 'Bowls', sortOrder: 4, imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80' },
    ],
    skipDuplicates: true,
  });

  // ─── Menu Items (Eataly) ───────────────────────
  await prisma.menuItem.createMany({
    data: [
      { restaurantId: eataly.id, name: 'Margherita Pizza', description: 'Classic pizza with fresh mozzarella and basil.', price: 18, batchPrice: 14, category: 'Pizza', sortOrder: 1, imageUrl: '/assets/margherita_pizza.png' },
      { restaurantId: eataly.id, name: 'Spaghetti Carbonara', description: 'Traditional Roman pasta with guanciale and pecorino.', price: 22, batchPrice: 17, category: 'Pasta', sortOrder: 2, imageUrl: 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=500&q=80' },
    ],
    skipDuplicates: true,
  });

  // ─── Menu Items (Shake Shack) ───────────────────────
  await prisma.menuItem.createMany({
    data: [
      { restaurantId: shakeShack.id, name: 'ShackBurger', description: 'Single cheeseburger with lettuce, tomato, and ShackSauce.', price: 8, batchPrice: 6, category: 'Burgers', sortOrder: 1, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80' },
      { restaurantId: shakeShack.id, name: 'Crinkle Cut Fries', description: 'Crispy, crinkle cut fries.', price: 4, batchPrice: 3, category: 'Sides', sortOrder: 2, imageUrl: '/assets/crinkle_cut_fries.png' },
    ],
    skipDuplicates: true,
  });

  // ─── Menu Items (Poke Paradise) ───────────────────────
  await prisma.menuItem.createMany({
    data: [
      { restaurantId: pokeParadise.id, name: 'Ahi Tuna Bowl', description: 'Fresh ahi tuna with classic shoyu sauce over rice.', price: 16, batchPrice: 12, category: 'Bowls', sortOrder: 1, imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80' },
      { restaurantId: pokeParadise.id, name: 'Spicy Salmon Bowl', description: 'Salmon with spicy mayo, edamame, and crispy onions.', price: 15, batchPrice: 11, category: 'Bowls', sortOrder: 2, imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80' },
    ],
    skipDuplicates: true,
  });

  console.log('  ✅ Menu items seeded');

  // ─── Sample Batch ──────────────────────────────────
  const batch = await prisma.batch.create({
    data: {
      creatorId: testUser.id,
      restaurantId: matsuhisa.id,
      status: 'OPEN',
      maxParticipants: 10,
      closesAt: new Date(Date.now() + 30 * 60 * 1000), // 30 mins from now
      lockAt: new Date(Date.now() + 25 * 60 * 1000), // 25 mins from now
      soloDeliveryFee: 15,
      participants: {
        create: {
          userId: testUser.id,
          alias: 'Host_42',
        },
      },
    },
  });
  console.log(`  ✅ Sample batch created: ${batch.id}`);

  console.log('\n🎉 Seeding complete!');
  console.log('\n📋 Test credentials:');
  console.log('   Admin: admin@zenvy.com / admin123456');
  console.log('   User:  user@zenvy.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
