/*
  Warnings:

  - Made the column `dreamId` on table `DreamRequest` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "DreamRequest" DROP CONSTRAINT "DreamRequest_dreamId_fkey";

-- DropIndex
DROP INDEX "Account_address_key";

-- AlterTable
ALTER TABLE "DreamRequest" ALTER COLUMN "dreamId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "DreamRequest" ADD CONSTRAINT "DreamRequest_dreamId_fkey" FOREIGN KEY ("dreamId") REFERENCES "Dream"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
