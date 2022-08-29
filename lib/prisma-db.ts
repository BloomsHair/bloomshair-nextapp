import { PrismaClient } from "@prisma/client";
const dev = process.env.NODE_ENV !== "production";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: dev && ["query"],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;