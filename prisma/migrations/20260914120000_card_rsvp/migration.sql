-- RSVP responses to invitation cards.
CREATE TABLE "rsvp" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "attending" BOOLEAN NOT NULL,
    "guests" INTEGER NOT NULL DEFAULT 1,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "rsvp_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "rsvp_cardId_idx" ON "rsvp"("cardId");
ALTER TABLE "rsvp" ADD CONSTRAINT "rsvp_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE CASCADE ON UPDATE CASCADE;
