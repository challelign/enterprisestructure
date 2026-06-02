import "dotenv/config";
import { defineConfig } from "prisma/config";
import { prisma } from "./prisma/seed/prisma";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
    seed: 'bun ./prisma/seed/index.ts',
  },

  datasource: {
    url: process.env.DATABASE_URL,
  },
});