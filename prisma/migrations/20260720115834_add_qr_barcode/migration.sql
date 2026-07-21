-- CreateTable
CREATE TABLE "qr_code" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "data" TEXT NOT NULL,
    "fgColor" TEXT NOT NULL DEFAULT '#000000',
    "bgColor" TEXT NOT NULL DEFAULT '#ffffff',
    "size" INTEGER NOT NULL DEFAULT 512,
    "margin" INTEGER NOT NULL DEFAULT 2,
    "ecLevel" TEXT NOT NULL DEFAULT 'M',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "qr_code_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "barcode" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "data" TEXT NOT NULL,
    "format" TEXT NOT NULL DEFAULT 'code128',
    "scale" INTEGER NOT NULL DEFAULT 3,
    "height" INTEGER NOT NULL DEFAULT 60,
    "includeText" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "barcode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "qr_code_userId_createdAt_idx" ON "qr_code"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "barcode_userId_createdAt_idx" ON "barcode"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "qr_code" ADD CONSTRAINT "qr_code_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "barcode" ADD CONSTRAINT "barcode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
