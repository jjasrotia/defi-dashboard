import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/prisma/generated/client/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

let prismaClient = globalForPrisma.prisma;

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not configured.");

  const adapter = new PrismaPg({
    connectionString,
    max: 5,
    connectionTimeoutMillis: 5_000,
  });

  return new PrismaClient({ adapter });
}

export function getPrismaClient() {
  if (!prismaClient) prismaClient = createPrismaClient();

  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prismaClient;

  return prismaClient;
}