/*
  Warnings:

  - You are about to drop the column `nswf` on the `Dream` table. All the data in the column will be lost.
  - You are about to drop the `DreamRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "DreamTicketStatus" AS ENUM ('COMPLETED', 'PROCESSING', 'PENDING');

-- AlterEnum
ALTER TYPE "DreamStatus" ADD VALUE 'BANNED';

-- DropForeignKey
ALTER TABLE "DreamRequest" DROP CONSTRAINT "DreamRequest_dreamId_fkey";

-- DropForeignKey
ALTER TABLE "DreamRequest" DROP CONSTRAINT "DreamRequest_senderAddress_fkey";

-- AlterTable
ALTER TABLE "Dream" DROP COLUMN "nswf";

-- DropTable
DROP TABLE "DreamRequest";

-- DropEnum
DROP TYPE "DreamRequestStatus";

-- CreateTable
CREATE TABLE "DreamTicket" (
    "id" SERIAL NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "expiresAt" INTEGER NOT NULL,
    "status" "DreamTicketStatus" NOT NULL DEFAULT 'PENDING',
    "senderAddress" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "dreamId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DreamTicket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DreamTicket_senderAddress_key" ON "DreamTicket"("senderAddress");

-- CreateIndex
CREATE UNIQUE INDEX "DreamTicket_dreamId_key" ON "DreamTicket"("dreamId");

-- AddForeignKey
ALTER TABLE "DreamTicket" ADD CONSTRAINT "DreamTicket_senderAddress_fkey" FOREIGN KEY ("senderAddress") REFERENCES "Account"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DreamTicket" ADD CONSTRAINT "DreamTicket_dreamId_fkey" FOREIGN KEY ("dreamId") REFERENCES "Dream"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
