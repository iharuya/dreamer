-- CreateEnum
CREATE TYPE "DreamStatus" AS ENUM ('PUBLISHED', 'PENDING', 'DRAFT');

-- CreateEnum
CREATE TYPE "DreamRequestStatus" AS ENUM ('EXPIRED', 'COMPLETED', 'PROCESSING', 'PENDING');

-- CreateTable
CREATE TABLE "Account" (
    "address" TEXT NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("address")
);

-- CreateTable
CREATE TABLE "Dream" (
    "id" SERIAL NOT NULL,
    "body" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "status" "DreamStatus" NOT NULL DEFAULT 'DRAFT',
    "nswf" BOOLEAN NOT NULL DEFAULT false,
    "dreamerAddress" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dream_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "dreamId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DreamRequest" (
    "id" SERIAL NOT NULL,
    "senderAddress" TEXT NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "expires" INTEGER NOT NULL,
    "status" "DreamRequestStatus" NOT NULL DEFAULT 'PENDING',
    "dreamId" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DreamRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_address_key" ON "Account"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Dream_dreamerAddress_key" ON "Dream"("dreamerAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Image_dreamId_key" ON "Image"("dreamId");

-- CreateIndex
CREATE UNIQUE INDEX "DreamRequest_senderAddress_key" ON "DreamRequest"("senderAddress");

-- CreateIndex
CREATE UNIQUE INDEX "DreamRequest_dreamId_key" ON "DreamRequest"("dreamId");

-- AddForeignKey
ALTER TABLE "Dream" ADD CONSTRAINT "Dream_dreamerAddress_fkey" FOREIGN KEY ("dreamerAddress") REFERENCES "Account"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_dreamId_fkey" FOREIGN KEY ("dreamId") REFERENCES "Dream"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DreamRequest" ADD CONSTRAINT "DreamRequest_senderAddress_fkey" FOREIGN KEY ("senderAddress") REFERENCES "Account"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DreamRequest" ADD CONSTRAINT "DreamRequest_dreamId_fkey" FOREIGN KEY ("dreamId") REFERENCES "Dream"("id") ON DELETE SET NULL ON UPDATE CASCADE;
