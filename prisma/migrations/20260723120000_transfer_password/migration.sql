-- AlterTable: optional password gate for transfers
ALTER TABLE "transfer" ADD COLUMN "passwordHash" TEXT;
ALTER TABLE "transfer" ADD COLUMN "passwordSalt" TEXT;
