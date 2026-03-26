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
      rating: 4.5,
      latitude: 34.0622,
      longitude: -118.3987,
    },
  });

  console.log(`  ✅ Restaurants: ${matsuhisa.name}, ${wolfgangPuck.name}, ${sweetgreen.name}`);

  // ─── Menu Items (Matsuhisa) ────────────────────────
  await prisma.menuItem.createMany({
    data: [
      { restaurantId: matsuhisa.id, name: 'Omakase Signature Set', description: 'Chef selection of 12 premium seasonal cuts.', price: 125, batchPrice: 95, category: 'Signature', sortOrder: 1 },
      { restaurantId: matsuhisa.id, name: 'Toro Truffle Nigiri', description: 'Fatty tuna with black truffle shaving.', price: 35, batchPrice: 28, category: 'Nigiri', sortOrder: 2 },
      { restaurantId: matsuhisa.id, name: 'Spicy Wagyu Maki', description: 'A5 Wagyu beef, scallion, spicy aioli.', price: 42, batchPrice: 32, category: 'Maki', sortOrder: 3 },
      { restaurantId: matsuhisa.id, name: 'Yuzu Miso Cod', description: 'Black cod marinated for 48 hours.', price: 58, batchPrice: 45, category: 'Main', sortOrder: 4 },
    ],
    skipDuplicates: true,
  });

  // ─── Menu Items (Wolfgang Puck) ────────────────────
  await prisma.menuItem.createMany({
    data: [
      { restaurantId: wolfgangPuck.id, name: 'USDA Prime Bone-In Ribeye', description: '16oz dry-aged 35 days, served with bone marrow.', price: 85, batchPrice: 68, category: 'Steaks', sortOrder: 1 },
      { restaurantId: wolfgangPuck.id, name: 'Japanese Wagyu A5', description: 'Miyazaki tenderloin, 4oz, with truffle butter.', price: 150, batchPrice: 120, category: 'Steaks', sortOrder: 2 },
      { restaurantId: wolfgangPuck.id, name: 'Lobster Oscar', description: 'Maine lobster with asparagus and béarnaise.', price: 65, batchPrice: 52, category: 'Seafood', sortOrder: 3 },
      { restaurantId: wolfgangPuck.id, name: 'Maple-Glazed Carrots', description: 'Heirloom carrots with hazelnut praline.', price: 18, batchPrice: 14, category: 'Sides', sortOrder: 4 },
    ],
    skipDuplicates: true,
  });

  // ─── Menu Items (Sweetgreen) ───────────────────────
  await prisma.menuItem.createMany({
    data: [
      { restaurantId: sweetgreen.id, name: 'Harvest Bowl', description: 'Warm quinoa, roasted chicken, sweet potatoes, apples.', price: 14, batchPrice: 11, category: 'Bowls', sortOrder: 1 },
      { restaurantId: sweetgreen.id, name: 'Kale Caesar', description: 'Shaved parmesan, focaccia croutons, lemon caesar.', price: 12, batchPrice: 9, category: 'Bowls', sortOrder: 2 },
      { restaurantId: sweetgreen.id, name: 'Shroomami', description: 'Warm wild rice, roasted mushrooms, tofu, miso sesame.', price: 13, batchPrice: 10, category: 'Bowls', sortOrder: 3 },
      { restaurantId: sweetgreen.id, name: 'Guacamole Greens', description: 'Avocado, black beans, tortilla chips, lime cilantro.', price: 14, batchPrice: 11, category: 'Bowls', sortOrder: 4 },
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
