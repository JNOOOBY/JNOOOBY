import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // Falls back to the local development database (see docker-compose.yml)
    // so Prisma commands work out of the box without DATABASE_URL being set.
    url: process.env.DATABASE_URL ?? 'postgresql://cloudimage:cloudimage@localhost:5432/cloudimage',
  },
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
});
