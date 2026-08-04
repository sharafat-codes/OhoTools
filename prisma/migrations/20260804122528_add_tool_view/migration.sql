-- CreateTable
CREATE TABLE "tool_view" (
    "slug" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "tool_view_pkey" PRIMARY KEY ("slug","day")
);
