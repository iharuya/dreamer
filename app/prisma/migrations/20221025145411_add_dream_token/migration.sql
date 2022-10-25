-- AlterTable
ALTER TABLE "Dream" ADD COLUMN     "tokenId" INTEGER;

-- CreateTable
CREATE TABLE "DreamToken" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DreamToken_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Dream" ADD CONSTRAINT "Dream_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "DreamToken"("id") ON DELETE SET NULL ON UPDATE CASCADE;
