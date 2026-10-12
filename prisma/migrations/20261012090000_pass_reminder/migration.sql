-- One row per pass-expiry reminder email (lib/pass-emails.ts).
-- CreateTable
CREATE TABLE "pass_reminder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "proUntil" TIMESTAMP(3) NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pass_reminder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pass_reminder_userId_proUntil_key" ON "pass_reminder"("userId", "proUntil");

-- AddForeignKey
ALTER TABLE "pass_reminder" ADD CONSTRAINT "pass_reminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

