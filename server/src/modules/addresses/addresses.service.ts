import { prisma } from '../../config/database.js';
import type { CreateAddressInput, UpdateAddressInput } from './addresses.schema.js';

export class AddressesService {
  async getAddresses(userId: string) {
    return prisma.userAddress.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createAddress(userId: string, input: CreateAddressInput) {
    if (input.isDefault) {
      // Unset previous default
      await prisma.userAddress.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    // If this is the user's first address, make it default regardless
    const count = await prisma.userAddress.count({ where: { userId } });
    if (count === 0) {
      input.isDefault = true;
    }

    return prisma.userAddress.create({
      data: {
        ...input,
        userId,
      },
    });
  }

  async updateAddress(userId: string, addressId: string, input: UpdateAddressInput) {
    const address = await prisma.userAddress.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw { statusCode: 404, code: 'NOT_FOUND', message: 'Address not found' };
    }

    if (input.isDefault) {
      await prisma.userAddress.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return prisma.userAddress.update({
      where: { id: addressId },
      data: input,
    });
  }

  async deleteAddress(userId: string, addressId: string) {
    const address = await prisma.userAddress.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw { statusCode: 404, code: 'NOT_FOUND', message: 'Address not found' };
    }

    await prisma.userAddress.delete({
      where: { id: addressId },
    });

    return { message: 'Address deleted successfully' };
  }
}

export const addressesService = new AddressesService();
