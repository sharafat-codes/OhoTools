-- AlterTable
ALTER TABLE "card" ADD COLUMN "shortCode" TEXT;
ALTER TABLE "card" ADD COLUMN "views" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "card_shortCode_key" ON "card"("shortCode");
