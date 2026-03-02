import { env } from '$env/dynamic/private';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// koneksi pool ke database
const pool = new pg.Pool({ connectionString: env.DATABASE_URL });

// Pasang adapternya
const adapter = new PrismaPg(pool);

// Inisialisasi Prisma
export const prisma = new PrismaClient({ adapter });