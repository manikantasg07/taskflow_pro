import { defineConfig } from "prisma/config";
import "dotenv/config";

const DATABASE_URL = process.env.DATABASE_URL;

if( !DATABASE_URL ){
  throw new Error("DATABASE_URL is not defined in .env");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: DATABASE_URL,
  },
});
