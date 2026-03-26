import { Role } from '@prisma/client';

export interface JwtPayload {
  userId: string;
  role: Role;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
