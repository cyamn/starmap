/*
  Warnings:

  - You are about to drop the `Cell` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Column` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Page` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RoleAccessPage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Row` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Table` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Cell";

-- DropTable
DROP TABLE "Column";

-- DropTable
DROP TABLE "Page";

-- DropTable
DROP TABLE "RoleAccessPage";

-- DropTable
DROP TABLE "Row";

-- DropTable
DROP TABLE "Table";

-- CreateTable
CREATE TABLE "Mindmap" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "data" TEXT NOT NULL DEFAULT '',
    "style" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Mindmap_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Mindmap_projectId_key" ON "Mindmap"("projectId");
