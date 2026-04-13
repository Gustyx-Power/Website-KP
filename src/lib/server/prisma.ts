import { PrismaClient } from '@prisma/client';

// Prisma client for SQLite
// Config diambil dari prisma.config.ts
export const prisma = new PrismaClient({
    log: ['error', 'warn'],
});