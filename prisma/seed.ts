import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '../src/generated/prisma/client';
import { DEFAULT_DATABASE_URL } from '../src/lib/env';

const DEMO_EMAIL = 'demo@cloudimage.app';
const DEMO_PASSWORD = 'Demo123!';

async function main() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL || DEFAULT_DATABASE_URL,
  });
  const prisma = new PrismaClient({ adapter });

  try {
    const password = await bcrypt.hash(DEMO_PASSWORD, 10);

    const user = await prisma.user.upsert({
      where: { email: DEMO_EMAIL },
      update: { password },
      create: {
        email: DEMO_EMAIL,
        name: 'Demo User',
        password,
      },
    });

    await prisma.project.upsert({
      where: { userId_name: { userId: user.id, name: 'Demo Project' } },
      update: {},
      create: {
        userId: user.id,
        name: 'Demo Project',
        description: 'A sample project created by the seed script',
      },
    });

    console.log(`Seeded demo account: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
