// Shared defaults so the app and the Prisma scripts stay in sync.
// Matches docker-compose.yml and .env.example, allowing the project to run
// out of the box without any manual configuration.
export const DEFAULT_DATABASE_URL = 'postgresql://cloudimage:cloudimage@localhost:5432/cloudimage';
