import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Prisma 7 moved the connection URL out of schema.prisma. The CLI (migrate,
// db push, studio) reads it from here; the runtime client uses a driver
// adapter (see lib/prisma.ts).
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
