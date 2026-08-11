-- CreateTable
CREATE TABLE "favorite_tool" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorite_tool_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "favorite_tool_userId_idx" ON "favorite_tool"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "favorite_tool_userId_slug_key" ON "favorite_tool"("userId", "slug");

-- AddForeignKey
ALTER TABLE "favorite_tool" ADD CONSTRAINT "favorite_tool_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
