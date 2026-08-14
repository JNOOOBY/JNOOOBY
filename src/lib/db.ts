import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

function buildClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter, log: ['error'] });
}

function getClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = buildClient();
  }
  return globalForPrisma.prisma;
}

// Lazy proxy — the real client is only instantiated on the first DB call,
// not when this module is imported. This keeps `next build` happy when
// DATABASE_URL is not set in the build environment.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getClient();
    const value = Reflect.get(
      client as unknown as Record<string | symbol, unknown>,
      prop,
      client
    );

    return typeof value === 'function' ? value.bind(client) : value;
  },
});
