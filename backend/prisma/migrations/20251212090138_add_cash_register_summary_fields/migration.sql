/*
  Warnings:

  - Made the column `initialValue` on table `cash_registers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "cash_registers" ADD COLUMN     "finalValue" DECIMAL(10,2),
ADD COLUMN     "paymentsBreakdown" JSONB,
ADD COLUMN     "totalPayments" DECIMAL(10,2),
ALTER COLUMN "initialValue" SET NOT NULL;
