-- CreateTable
CREATE TABLE "screen_sessions" (
    "id" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "agent_name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'waiting',
    "offer" TEXT,
    "answer" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "screen_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "screen_ice_candidates" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "candidate" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "screen_ice_candidates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "screen_chat_msgs" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "screen_chat_msgs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultations" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "website" TEXT NOT NULL DEFAULT '',
    "agents" TEXT NOT NULL,
    "channels" TEXT NOT NULL DEFAULT '',
    "volume" TEXT NOT NULL,
    "tool" TEXT NOT NULL DEFAULT '',
    "notes" TEXT NOT NULL DEFAULT '',
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consultations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "quote" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT '',
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sent_emails" (
    "id" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "sent_by" TEXT NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'sent',
    "error" TEXT,

    CONSTRAINT "sent_emails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotional_campaigns" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "sent_by" TEXT NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" INTEGER NOT NULL DEFAULT 0,
    "succeeded" INTEGER NOT NULL DEFAULT 0,
    "failed" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "promotional_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promo_campaign_recipients" (
    "id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'sent',
    "error" TEXT,

    CONSTRAINT "promo_campaign_recipients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "screen_sessions_agent_id_idx" ON "screen_sessions"("agent_id");

-- CreateIndex
CREATE INDEX "screen_ice_candidates_session_id_role_idx" ON "screen_ice_candidates"("session_id", "role");

-- CreateIndex
CREATE INDEX "screen_chat_msgs_session_id_created_at_idx" ON "screen_chat_msgs"("session_id", "created_at");

-- CreateIndex
CREATE INDEX "consultations_status_idx" ON "consultations"("status");

-- CreateIndex
CREATE INDEX "consultations_created_at_idx" ON "consultations"("created_at");

-- CreateIndex
CREATE INDEX "reviews_user_id_idx" ON "reviews"("user_id");

-- CreateIndex
CREATE INDEX "reviews_is_published_idx" ON "reviews"("is_published");

-- CreateIndex
CREATE INDEX "sent_emails_sent_by_idx" ON "sent_emails"("sent_by");

-- CreateIndex
CREATE INDEX "sent_emails_sent_at_idx" ON "sent_emails"("sent_at");

-- CreateIndex
CREATE INDEX "promotional_campaigns_sent_by_idx" ON "promotional_campaigns"("sent_by");

-- CreateIndex
CREATE INDEX "promotional_campaigns_sent_at_idx" ON "promotional_campaigns"("sent_at");

-- CreateIndex
CREATE INDEX "promo_campaign_recipients_campaign_id_idx" ON "promo_campaign_recipients"("campaign_id");

-- AddForeignKey
ALTER TABLE "screen_ice_candidates" ADD CONSTRAINT "screen_ice_candidates_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "screen_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "screen_chat_msgs" ADD CONSTRAINT "screen_chat_msgs_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "screen_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sent_emails" ADD CONSTRAINT "sent_emails_sent_by_fkey" FOREIGN KEY ("sent_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotional_campaigns" ADD CONSTRAINT "promotional_campaigns_sent_by_fkey" FOREIGN KEY ("sent_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promo_campaign_recipients" ADD CONSTRAINT "promo_campaign_recipients_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "promotional_campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
