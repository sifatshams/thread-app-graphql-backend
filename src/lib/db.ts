import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

export const prismaClient = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL as string) });
