-- AlterTable
ALTER TABLE "chat_messages" ADD COLUMN     "admin_id" TEXT,
ADD COLUMN     "admin_name" TEXT;

-- CreateIndex
CREATE INDEX "chat_messages_admin_id_idx" ON "chat_messages"("admin_id");

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
