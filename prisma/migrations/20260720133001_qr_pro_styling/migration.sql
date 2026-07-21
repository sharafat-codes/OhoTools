-- AlterTable
ALTER TABLE "qr_code" ADD COLUMN     "fgColor2" TEXT,
ADD COLUMN     "gradient" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "logo" TEXT,
ADD COLUMN     "moduleStyle" TEXT NOT NULL DEFAULT 'square';
