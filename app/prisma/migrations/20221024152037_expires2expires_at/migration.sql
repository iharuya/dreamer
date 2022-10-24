/*
  Warnings:

  - You are about to drop the column `expires` on the `DreamRequest` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `DreamRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DreamRequest" DROP COLUMN "expires",
ADD COLUMN     "expiresAt" INTEGER NOT NULL;
