import { prisma } from '../../config/database.js';
import type { CreateRestaurantInput, CreateMenuItemInput, ListRestaurantsInput } from './restaurants.schema.js';

export class RestaurantsService {
  async list(query: ListRestaurantsInput) {
    const { search, cuisine, page, limit } = query;
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { cuisine: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (cuisine) {
      where.cuisine = { equals: cuisine, mode: 'insensitive' };
    }

    const [restaurants, total] = await Promise.all([
      prisma.restaurant.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: {
              batches: { where: { status: 'OPEN' } },
            },
          },
        },
      }),
      prisma.restaurant.count({ where }),
    ]);

    const data = restaurants.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      cuisine: r.cuisine,
      description: r.description,
      imageUrl: r.imageUrl,
      address: r.address,
      rating: r.rating,
      activeBatchCount: r._count.batches,
    }));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string) {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      include: {
        menuItems: {
          where: { isAvailable: true },
          orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
        },
      },
    });

    if (!restaurant) {
      throw { statusCode: 404, code: 'NOT_FOUND', message: 'Restaurant not found' };
    }

    return restaurant;
  }

  async ensureRestaurantMenu(input: { id?: string; name: string; cuisine?: string; imageUrl?: string }) {
    let restaurant = await prisma.restaurant.findFirst({
      where: { name: input.name },
      include: {
        menuItems: {
          where: { isAvailable: true },
          orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
        },
      },
    });

    if (!restaurant) {
      const slug = input.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
        
      restaurant = await prisma.restaurant.create({
        data: {
          id: input.id?.startsWith('r') ? undefined : input.id, // don't use 'r1', 'r2' as actual cuid if possible, but prisma handles string ids. Let's just let Prisma generate if it's 'r1'
          name: input.name,
          slug,
          cuisine: input.cuisine || 'Various',
          address: '123 Test Ave, Beverly Hills, CA 90210',
          imageUrl: input.imageUrl,
          rating: 4.5,
          menuItems: {
            create: [
              {
                name: 'Signature ' + (input.cuisine?.split(' ')[0] || 'Dish'),
                price: 24,
                batchPrice: 18,
                imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80',
                category: 'Mains',
                sortOrder: 1,
              },
              {
                name: 'House Special Bowl',
                price: 18,
                batchPrice: 14,
                imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80',
                category: 'Mains',
                sortOrder: 2,
              },
              {
                name: 'Spaghetti Carbonara',
                price: 22,
                batchPrice: 17,
                imageUrl: 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=500&q=80',
                category: 'Pasta',
                sortOrder: 3,
              },
              {
                name: 'Margherita Pizza',
                price: 18,
                batchPrice: 14,
                imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?w=500&q=80',
                category: 'Pizza',
                sortOrder: 4,
              },
              {
                name: 'Chef Tasting Platter',
                price: 35,
                batchPrice: 28,
                imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80',
                category: 'Mains',
                sortOrder: 5,
              }
            ]
          }
        },
        include: {
          menuItems: {
            where: { isAvailable: true },
            orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
          },
        },
      });
    }

    // Double check if existing restaurant had no menu items
    if (restaurant.menuItems.length === 0) {
      await prisma.menuItem.createMany({
        data: [
          {
            restaurantId: restaurant.id,
            name: 'Signature ' + (input.cuisine?.split(' ')[0] || 'Dish'),
            price: 24,
            batchPrice: 18,
            imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80',
            category: 'Mains',
            sortOrder: 1,
          },
          {
            restaurantId: restaurant.id,
            name: 'House Special Bowl',
            price: 18,
            batchPrice: 14,
            imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80',
            category: 'Mains',
            sortOrder: 2,
          },
          {
            restaurantId: restaurant.id,
            name: 'Spaghetti Carbonara',
            price: 22,
            batchPrice: 17,
            imageUrl: 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=500&q=80',
            category: 'Pasta',
            sortOrder: 3,
          },
          {
            restaurantId: restaurant.id,
            name: 'Margherita Pizza',
            price: 18,
            batchPrice: 14,
            imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?w=500&q=80',
            category: 'Pizza',
            sortOrder: 4,
          }
        ]
      });

      restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurant.id },
        include: {
          menuItems: {
            where: { isAvailable: true },
            orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
          },
        },
      }) as any;
    }

    return restaurant;
  }

  async create(input: CreateRestaurantInput) {
    const slug = input.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const existing = await prisma.restaurant.findUnique({ where: { slug } });
    if (existing) {
      throw { statusCode: 409, code: 'SLUG_EXISTS', message: 'A restaurant with a similar name already exists' };
    }

    return prisma.restaurant.create({
      data: { ...input, slug },
    });
  }

  async update(id: string, input: Partial<CreateRestaurantInput>) {
    const restaurant = await prisma.restaurant.findUnique({ where: { id } });
    if (!restaurant) {
      throw { statusCode: 404, code: 'NOT_FOUND', message: 'Restaurant not found' };
    }

    const updated = await prisma.restaurant.update({
      where: { id },
      data: input,
    });

    return updated;
  }

  async addMenuItem(restaurantId: string, input: CreateMenuItemInput) {
    const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
    if (!restaurant) {
      throw { statusCode: 404, code: 'NOT_FOUND', message: 'Restaurant not found' };
    }

    const item = await prisma.menuItem.create({
      data: { ...input, restaurantId },
    });

    return item;
  }

  async updateMenuItem(restaurantId: string, itemId: string, input: Partial<CreateMenuItemInput>) {
    const item = await prisma.menuItem.findFirst({
      where: { id: itemId, restaurantId },
    });

    if (!item) {
      throw { statusCode: 404, code: 'NOT_FOUND', message: 'Menu item not found' };
    }

    const updated = await prisma.menuItem.update({
      where: { id: itemId },
      data: input,
    });

    return updated;
  }

  async deleteMenuItem(restaurantId: string, itemId: string) {
    const item = await prisma.menuItem.findFirst({
      where: { id: itemId, restaurantId },
    });

    if (!item) {
      throw { statusCode: 404, code: 'NOT_FOUND', message: 'Menu item not found' };
    }

    await prisma.menuItem.delete({ where: { id: itemId } });
  }
}

export const restaurantsService = new RestaurantsService();
