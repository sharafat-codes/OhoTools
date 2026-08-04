-- CreateTable
CREATE TABLE "api_usage" (
    "userId" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "api_usage_pkey" PRIMARY KEY ("userId","period")
);
