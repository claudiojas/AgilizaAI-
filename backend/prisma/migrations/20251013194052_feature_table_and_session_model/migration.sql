/*
  Warnings:

  - You are about to drop the column `wristbandId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `wristbandId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the `wristbands` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `sessionId` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionId` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."SessionStatus" AS ENUM ('ACTIVE', 'CLOSED');

-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_wristbandId_fkey";

-- DropForeignKey
ALTER TABLE "public"."payments" DROP CONSTRAINT "payments_wristbandId_fkey";

-- AlterTable
ALTER TABLE "public"."orders" DROP COLUMN "wristbandId",
ADD COLUMN     "sessionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."payments" DROP COLUMN "wristbandId",
ADD COLUMN     "sessionId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."wristbands";

-- CreateTable
CREATE TABLE "public"."tables" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,

    CONSTRAINT "tables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sessions" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "tableId" TEXT NOT NULL,
    "status" "public"."SessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tables_number_key" ON "public"."tables"("number");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_code_key" ON "public"."sessions"("code");

-- AddForeignKey
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "public"."tables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
