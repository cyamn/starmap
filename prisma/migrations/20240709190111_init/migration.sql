/*
  Warnings:

  - You are about to drop the column `description` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `home` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `Mindmap` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Rule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RoleToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "BlockType" AS ENUM ('DEFAULT', 'HINT', 'INFO', 'WARNING', 'ERROR');

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "description",
DROP COLUMN "home",
DROP COLUMN "name",
ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'Cheat Sheet',
ALTER COLUMN "ownerId" DROP NOT NULL;

-- DropTable
DROP TABLE "Mindmap";

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "Rule";

-- DropTable
DROP TABLE "_RoleToUser";

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "index" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Page',
    "sheetId" TEXT NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Block" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "BlockType" NOT NULL,
    "title" TEXT NOT NULL,
    "markdown" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Page_sheetId_idx" ON "Page"("sheetId");

-- CreateIndex
CREATE INDEX "Block_pageId_idx" ON "Block"("pageId");
