import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // Fall back to a placeholder so `prisma generate` (postinstall) succeeds in
    // CI / Cloudflare Workers builds where DATABASE_URL is not yet available.
    // A real DATABASE_URL is still required at runtime for any database operation.
    url: process.env.DATABASE_URL ?? 'postgresql://localhost:5432/placeholder',
  },
});
