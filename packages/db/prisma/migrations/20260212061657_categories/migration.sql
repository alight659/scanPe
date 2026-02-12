/*
  Warnings:

  - You are about to drop the column `spent` on the `budget` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `budget` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `iconBgColor` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `iconColor` on the `transaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,categoryId,period]` on the table `budget` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryId` to the `budget` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Period" AS ENUM ('daily', 'monthly', 'yearly');

-- DropIndex
DROP INDEX "budget_userId_type_key";

-- AlterTable
ALTER TABLE "budget" DROP COLUMN "spent",
DROP COLUMN "type",
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "period" "Period" NOT NULL DEFAULT 'monthly';

-- AlterTable
ALTER TABLE "transaction" DROP COLUMN "category",
DROP COLUMN "icon",
DROP COLUMN "iconBgColor",
DROP COLUMN "iconColor",
ADD COLUMN     "description" TEXT;

-- DropEnum
DROP TYPE "BudgetType";

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'folder',
    "color" TEXT NOT NULL DEFAULT '#10B981',
    "userId" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- CreateIndex
CREATE INDEX "category_userId_idx" ON "category"("userId");

-- CreateIndex
CREATE INDEX "budget_categoryId_idx" ON "budget"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "budget_userId_categoryId_period_key" ON "budget"("userId", "categoryId", "period");

-- AddForeignKey
ALTER TABLE "budget" ADD CONSTRAINT "budget_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
