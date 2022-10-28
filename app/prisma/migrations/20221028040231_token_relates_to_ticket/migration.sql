/*
  Warnings:

  - You are about to drop the column `tokenId` on the `Dream` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Dream" DROP CONSTRAINT "Dream_tokenId_fkey";

-- AlterTable
ALTER TABLE "Dream" DROP COLUMN "tokenId";

-- AddForeignKey
ALTER TABLE "DreamTicket" ADD CONSTRAINT "DreamTicket_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "DreamToken"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
