import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // Fallback placeholder so `prisma generate` works anywhere (CI, Cloudflare, local)
    // without DATABASE_URL. Real connections still require the env var at runtime.
    url: process.env.DATABASE_URL ?? 'postgresql://localhost:5432/placeholder',
  },
});
