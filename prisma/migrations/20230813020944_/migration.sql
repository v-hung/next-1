/*
  Warnings:

  - Added the required column `tableName` to the `FolderImage` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "GroupSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "details" TEXT,
    "value" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "groupId" TEXT NOT NULL,
    CONSTRAINT "Setting_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "GroupSetting" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FolderImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "tableName" TEXT NOT NULL,
    "parentId" TEXT,
    CONSTRAINT "FolderImage_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "FolderImage" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_FolderImage" ("id", "name", "parentId") SELECT "id", "name", "parentId" FROM "FolderImage";
DROP TABLE "FolderImage";
ALTER TABLE "new_FolderImage" RENAME TO "FolderImage";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Setting_name_key" ON "Setting"("name");
