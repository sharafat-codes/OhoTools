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

// The transaction pooler (port 6543) multiplexes many clients onto few server
// connections, so a few per instance is safe. The session pooler / direct
// connection (5432) shares only ~15 server connections across the WHOLE project,
// so on serverless we keep it minimal to avoid EMAXCONNSESSION under fan-out.
// (2, not 1, so an interactive transaction + a concurrent query can't deadlock.)
const onTransactionPooler = dbUrl.port === "6543";
const maxConnections = onTransactionPooler ? 3 : 2;

const adapter = new PrismaPg({
    host: dbUrl.hostname,
    port: dbUrl.port ? Number(dbUrl.port) : 5432,
    user: decodeURIComponent(dbUrl.username),
    password: decodeURIComponent(dbUrl.password),
    database: dbUrl.pathname.replace(/^\//, ""),
    ssl: { rejectUnauthorized: false },
    max: maxConnections,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
});

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
