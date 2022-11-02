/*
  Warnings:

  - The primary key for the `DreamTicket` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `DreamToken` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "DreamTicket" DROP CONSTRAINT "DreamTicket_tokenId_fkey";

-- AlterTable
ALTER TABLE "DreamTicket" DROP CONSTRAINT "DreamTicket_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "tokenId" SET DATA TYPE TEXT,
ADD CONSTRAINT "DreamTicket_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "DreamTicket_id_seq";

-- AlterTable
ALTER TABLE "DreamToken" DROP CONSTRAINT "DreamToken_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "DreamToken_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "DreamToken_id_seq";

-- AddForeignKey
ALTER TABLE "DreamTicket" ADD CONSTRAINT "DreamTicket_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "DreamToken"("id") ON DELETE CASCADE ON UPDATE CASCADE;
