/*
  Warnings:

  - You are about to drop the column `cakeId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `cakeName` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `cakeType` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `customMessage` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `Order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_cakeId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "cakeId",
DROP COLUMN "cakeName",
DROP COLUMN "cakeType",
DROP COLUMN "customMessage",
DROP COLUMN "note",
ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "cakeId" TEXT,
    "cakeName" TEXT NOT NULL,
    "cakeType" TEXT,
    "priceAtTime" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "customMessage" TEXT,
    "note" TEXT,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_cakeId_fkey" FOREIGN KEY ("cakeId") REFERENCES "Cake"("id") ON DELETE SET NULL ON UPDATE CASCADE;
