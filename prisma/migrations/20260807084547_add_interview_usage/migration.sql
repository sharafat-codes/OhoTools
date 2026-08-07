-- CreateTable
CREATE TABLE "interview_usage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "interview_usage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "interview_usage_userId_idx" ON "interview_usage"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "interview_usage_userId_day_key" ON "interview_usage"("userId", "day");

-- AddForeignKey
ALTER TABLE "interview_usage" ADD CONSTRAINT "interview_usage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
