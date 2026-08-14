-- CreateTable
CREATE TABLE "card" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT,
    "occasion" TEXT NOT NULL DEFAULT 'birthday',
    "data" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "card_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "card_userId_createdAt_idx" ON "card"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "card" ADD CONSTRAINT "card_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
