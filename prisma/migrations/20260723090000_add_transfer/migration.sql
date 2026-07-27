-- CreateTable
CREATE TABLE "transfer" (
    "id" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "metaCipher" TEXT NOT NULL,
    "metaIv" TEXT NOT NULL,
    "contentIv" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transfer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transfer_storagePath_key" ON "transfer"("storagePath");

-- CreateIndex
CREATE INDEX "transfer_expiresAt_idx" ON "transfer"("expiresAt");

-- CreateIndex
CREATE INDEX "transfer_userId_createdAt_idx" ON "transfer"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "transfer" ADD CONSTRAINT "transfer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
