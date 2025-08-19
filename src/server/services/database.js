import { PrismaClient } from '@prisma/client';

// Adicione o Prisma Client ao objeto global para evitar múltiplas instâncias
// durante o desenvolvimento com hot-reloading.
declare global {
  var prisma: PrismaClient | undefined;
}

// Crie a instância do Prisma Client se ela ainda não existir no objeto global
const prisma =
  global.prisma ||
  new PrismaClient({
    errorFormat: 'minimal',
    log: ['query', 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export { prisma };