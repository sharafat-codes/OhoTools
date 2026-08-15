-- Card: allow anonymous tracked cards + record last-opened time
ALTER TABLE "card" ALTER COLUMN "userId" DROP NOT NULL;
ALTER TABLE "card" ADD COLUMN "lastOpenedAt" TIMESTAMP(3);

-- Watchers: who to email when a card is opened
CREATE TABLE "card_watch" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "notified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "card_watch_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "card_watch_cardId_email_key" ON "card_watch"("cardId", "email");
CREATE INDEX "card_watch_cardId_idx" ON "card_watch"("cardId");
ALTER TABLE "card_watch" ADD CONSTRAINT "card_watch_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Subscribers: marketing list for non-account emails
CREATE TABLE "subscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "source" TEXT,
    "consentMarketing" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "subscriber_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "subscriber_email_key" ON "subscriber"("email");
