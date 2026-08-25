-- One-time Pro pass expiry (Safepay); null for Stripe/lifetime grants.
ALTER TABLE "user" ADD COLUMN "proUntil" TIMESTAMP(3);

-- One-time payments (Safepay Pro pass, etc.)
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'safepay',
    "reference" TEXT NOT NULL,
    "orderId" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'paid',
    "plan" "PlanTier" NOT NULL DEFAULT 'PRO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "payment_reference_key" ON "payment"("reference");
CREATE INDEX "payment_userId_idx" ON "payment"("userId");
ALTER TABLE "payment" ADD CONSTRAINT "payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
