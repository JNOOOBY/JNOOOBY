type UserRecord = {
  id: string;
  email: string;
  name?: string | null;
  password?: string | null;
};

type ChatMessageRecord = {
  userId: string;
  message: string;
  response: string;
  context?: unknown;
};

type PrismaLike = {
  user: {
    findUnique: (args: { where: { email: string } }) => Promise<UserRecord | null>;
    create: (args: {
      data: { email: string; password: string; name: string };
    }) => Promise<UserRecord>;
  };
  chatMessage: {
    create: (args: { data: ChatMessageRecord }) => Promise<ChatMessageRecord>;
  };
};

const demoUsers: UserRecord[] = [];

const chatHistory: ChatMessageRecord[] = [];

const createMemoryPrisma = (): PrismaLike => ({
  user: {
    async findUnique({ where }) {
      return (
        demoUsers.find(
          (user) => user.email.toLowerCase() === where.email.toLowerCase()
        ) ?? null
      );
    },
    async create({ data }) {
      const newUser: UserRecord = {
        id: `user-${Date.now()}`,
        email: data.email.toLowerCase(),
        password: data.password,
        name: data.name,
      };

      demoUsers.push(newUser);
      return newUser;
    },
  },
  chatMessage: {
    async create({ data }) {
      chatHistory.push(data);
      return data;
    },
  },
});

const createPrismaClient = (): PrismaLike => {
  try {
    const prismaModule = require('@prisma/client') as {
      PrismaClient?: new (options?: { log?: string[] }) => PrismaLike;
    };

    if (typeof prismaModule.PrismaClient === 'function') {
      return new prismaModule.PrismaClient({
        log: ['error'],
      });
    }
  } catch {
    return createMemoryPrisma();
  }

  return createMemoryPrisma();
};

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaLike;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
