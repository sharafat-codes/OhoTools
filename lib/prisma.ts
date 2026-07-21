import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma 7: the runtime client connects through a driver adapter instead of a
// URL in schema.prisma. PrismaPg accepts a connection string directly and works
// with any Postgres (Neon, Supabase, local).
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// Supabase (and most hosted Postgres) serve a certificate chain that fails full
// verification, and pg v9 treats `sslmode=require` as `verify-full`. Passing a
// connection string lets pg's parsed sslmode override our ssl option, so we
// build the pool config from discrete fields instead — this makes our `ssl`
// setting (encrypt, don't reject the chain) authoritative at runtime. The
// `.env` URL keeps `sslmode` for the Prisma CLI (migrate/studio), which uses a
// separate engine.
const dbUrl = new URL(process.env.DATABASE_URL as string);
const adapter = new PrismaPg({
    host: dbUrl.hostname,
    port: dbUrl.port ? Number(dbUrl.port) : 5432,
    user: decodeURIComponent(dbUrl.username),
    password: decodeURIComponent(dbUrl.password),
    database: dbUrl.pathname.replace(/^\//, ""),
    ssl: { rejectUnauthorized: false },
});

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
