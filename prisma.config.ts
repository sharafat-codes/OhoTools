import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma 7 moved the connection URL out of schema.prisma. The CLI (migrate,
// db push, studio) reads it from here; the runtime client uses a driver
// adapter (see lib/prisma.ts).
//
// We read process.env directly (not `env()`) with a harmless fallback so that
// `prisma generate` never throws when DATABASE_URL is absent at build time
// (e.g. on CI). `generate` doesn't connect — only migrate/studio need a real
// URL, and those run where DATABASE_URL is set (.env locally, env in prod).
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://user:password@localhost:5432/postgres",
  },
});
