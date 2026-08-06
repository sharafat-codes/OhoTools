-- CreateTable
CREATE TABLE "tool_request" (
    "id" TEXT NOT NULL,
    "tool" TEXT NOT NULL,
    "details" TEXT,
    "email" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tool_request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tool_request_status_idx" ON "tool_request"("status");
