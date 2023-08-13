/*
  Warnings:

  - Added the required column `adminId` to the `FolderImage` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FolderImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "tableName" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "parentId" TEXT,
    CONSTRAINT "FolderImage_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FolderImage_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "FolderImage" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_FolderImage" ("id", "name", "parentId", "tableName") SELECT "id", "name", "parentId", "tableName" FROM "FolderImage";
DROP TABLE "FolderImage";
ALTER TABLE "new_FolderImage" RENAME TO "FolderImage";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
