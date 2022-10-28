-- DropForeignKey
ALTER TABLE "DreamTicket" DROP CONSTRAINT "DreamTicket_tokenId_fkey";

-- AddForeignKey
ALTER TABLE "DreamTicket" ADD CONSTRAINT "DreamTicket_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "DreamToken"("id") ON DELETE CASCADE ON UPDATE CASCADE;
