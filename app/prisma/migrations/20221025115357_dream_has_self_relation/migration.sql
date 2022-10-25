/*
  Warnings:

  - Added the required column `generation` to the `Dream` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dream" ADD COLUMN     "generation" INTEGER NOT NULL,
ADD COLUMN     "parentId" INTEGER;

-- AddForeignKey
ALTER TABLE "Dream" ADD CONSTRAINT "Dream_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Dream"("id") ON DELETE SET NULL ON UPDATE CASCADE;
