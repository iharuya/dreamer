/*
  Warnings:

  - You are about to drop the column `body` on the `Dream` table. All the data in the column will be lost.
  - Added the required column `title` to the `Dream` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dream" DROP COLUMN "body",
ADD COLUMN     "caption" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;
