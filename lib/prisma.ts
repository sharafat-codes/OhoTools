import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma 7: the runtime client connects through a driver adapter instead of a
// URL in schema.prisma. PrismaPg accepts a connection string directly and works
// with any Postgres (Neon, Supabase, local).
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// Runtime connection. Prefer DATABASE_POOL_URL (Supabase transaction pooler,
// port 6543 — built for serverless / many short-lived clients); fall back to
// DATABASE_URL. Migrations always use DATABASE_URL (session pooler / direct)
// via prisma.config.ts, since migrate needs session features.
const runtimeUrl = process.env.DATABASE_POOL_URL || process.env.DATABASE_URL;

// Supabase (and most hosted Postgres) serve a certificate chain that fails full
// verification, and pg v9 treats `sslmode=require` as `verify-full`. We build
// the pool config from discrete fields so our `ssl` setting (encrypt, don't
// reject the chain) is authoritative at runtime.
const dbUrl = new URL(runtimeUrl as string);
const adapter = new PrismaPg({
    host: dbUrl.hostname,
    port: dbUrl.port ? Number(dbUrl.port) : 5432,
    user: decodeURIComponent(dbUrl.username),
    password: decodeURIComponent(dbUrl.password),
    database: dbUrl.pathname.replace(/^\//, ""),
    ssl: { rejectUnauthorized: false },
    // Cap connections per instance so we never exhaust Supabase's pooler
    // (free tier session pool is only 15). Idle connections are released.
    max: 3,
    idleTimeoutMillis: 15_000,
    connectionTimeoutMillis: 10_000,
});

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
