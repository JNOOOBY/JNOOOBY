import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';
import { DEFAULT_DATABASE_URL } from '@/lib/env';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL || DEFAULT_DATABASE_URL,
    });
    globalForPrisma.prisma = new PrismaClient({ adapter, log: ['error'] });
  }
  return globalForPrisma.prisma;
}

// The client is created lazily so that building the app (or rendering pages
// that never touch the database) works without a running database.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property, receiver) {
    return Reflect.get(getPrismaClient(), property, receiver);
  },
});
