-- CreateTable
CREATE TABLE "dynamic_link" (
    "id" TEXT NOT NULL,
    "shortCode" TEXT NOT NULL,
    "name" TEXT,
    "targetUrl" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "fgColor" TEXT NOT NULL DEFAULT '#000000',
    "bgColor" TEXT NOT NULL DEFAULT '#ffffff',
    "scanCount" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dynamic_link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scan_log" (
    "id" TEXT NOT NULL,
    "linkId" TEXT NOT NULL,
    "device" TEXT,
    "referrer" TEXT,
    "country" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scan_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dynamic_link_shortCode_key" ON "dynamic_link"("shortCode");

-- CreateIndex
CREATE INDEX "dynamic_link_userId_createdAt_idx" ON "dynamic_link"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "scan_log_linkId_createdAt_idx" ON "scan_log"("linkId", "createdAt");

-- AddForeignKey
ALTER TABLE "dynamic_link" ADD CONSTRAINT "dynamic_link_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scan_log" ADD CONSTRAINT "scan_log_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "dynamic_link"("id") ON DELETE CASCADE ON UPDATE CASCADE;
