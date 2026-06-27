import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
// import { PrismaClient } from "../node_modules\@prisma\client ";
import { PrismaClient } from "@prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
// const prisma = new PrismaClient({ adapter });

class PrismaClientSingleton {
  private static instance: PrismaClient | undefined;

  static getInstance() {
    if (!PrismaClientSingleton.instance) {
      PrismaClientSingleton.instance = new PrismaClient({ adapter });
    }
    return PrismaClientSingleton.instance;
  }
}

const prisma = PrismaClientSingleton.getInstance();

export { prisma };
