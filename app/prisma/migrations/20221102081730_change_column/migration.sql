/*
  Warnings:

  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_dreamId_fkey";

-- DropTable
DROP TABLE "Image";

-- CreateTable
CREATE TABLE "DreamImage" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "dreamId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DreamImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DreamImage_dreamId_key" ON "DreamImage"("dreamId");

-- AddForeignKey
ALTER TABLE "DreamImage" ADD CONSTRAINT "DreamImage_dreamId_fkey" FOREIGN KEY ("dreamId") REFERENCES "Dream"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
