-- Saved mock-interview sessions — Pro "History & Progress" feature.
CREATE TABLE "interview_session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "readiness" TEXT NOT NULL,
    "report" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "interview_session_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "interview_session_userId_idx" ON "interview_session"("userId");
ALTER TABLE "interview_session" ADD CONSTRAINT "interview_session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
