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
