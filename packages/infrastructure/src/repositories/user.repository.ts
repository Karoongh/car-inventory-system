import { PrismaClient, User as PrismaUser, UserRole } from '@prisma/client';
import { prisma } from '../prisma/prisma.service';

export interface CreateUserInput {
  mobile: string;
  fullName?: string | null;
  role?: 'Owner' | 'Admin';
}

export interface UserRecord {
  id: string;
  mobile: string;
  fullName: string | null;
  role: 'Owner' | 'Admin';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

function mapUser(u: PrismaUser): UserRecord {
  return {
    id: u.id,
    mobile: u.mobile,
    fullName: u.fullName,
    role: u.role as 'Owner' | 'Admin',
    isActive: u.isActive,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}

export class PrismaUserRepository {
  constructor(private readonly db: PrismaClient = prisma) {}

  async create(input: CreateUserInput): Promise<UserRecord> {
    const user = await this.db.user.create({
      data: {
        mobile: input.mobile,
        fullName: input.fullName ?? null,
        role: (input.role as UserRole) ?? UserRole.Owner,
      },
    });
    return mapUser(user);
  }

  async findByMobile(mobile: string): Promise<UserRecord | null> {
    const user = await this.db.user.findUnique({ where: { mobile } });
    return user ? mapUser(user) : null;
  }

  async findById(id: string): Promise<UserRecord | null> {
    const user = await this.db.user.findUnique({ where: { id } });
    return user ? mapUser(user) : null;
  }

  async updateFullName(id: string, fullName: string): Promise<UserRecord> {
    const user = await this.db.user.update({
      where: { id },
      data: { fullName },
    });
    return mapUser(user);
  }
}
