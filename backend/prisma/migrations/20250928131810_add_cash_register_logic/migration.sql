/*
  Warnings:

  - Added the required column `cashRegisterId` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cashRegisterId` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."CashRegisterStatus" AS ENUM ('OPEN', 'CLOSED');

-- AlterEnum
ALTER TYPE "public"."OrderStatus" ADD VALUE 'PAID';

-- AlterTable
ALTER TABLE "public"."orders" ADD COLUMN     "cashRegisterId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."payments" ADD COLUMN     "cashRegisterId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."cash_registers" (
    "id" TEXT NOT NULL,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),
    "status" "public"."CashRegisterStatus" NOT NULL DEFAULT 'OPEN',
    "initialValue" DECIMAL(10,2),

    CONSTRAINT "cash_registers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_cashRegisterId_fkey" FOREIGN KEY ("cashRegisterId") REFERENCES "public"."cash_registers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_cashRegisterId_fkey" FOREIGN KEY ("cashRegisterId") REFERENCES "public"."cash_registers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
