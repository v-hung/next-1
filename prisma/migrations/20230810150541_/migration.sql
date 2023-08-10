/*
  Warnings:

  - You are about to drop the column `image` on the `Admin` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "FolderImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    CONSTRAINT "FolderImage_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "FolderImage" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Image" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "caption" TEXT,
    "url" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "naturalHeight" INTEGER NOT NULL,
    "naturalWidth" INTEGER NOT NULL,
    "size" REAL NOT NULL,
    "table" TEXT,
    "folderImageId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Image_folderImageId_fkey" FOREIGN KEY ("folderImageId") REFERENCES "FolderImage" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("caption", "createdAt", "height", "id", "name", "naturalHeight", "naturalWidth", "size", "type", "updatedAt", "url", "width") SELECT "caption", "createdAt", "height", "id", "name", "naturalHeight", "naturalWidth", "size", "type", "updatedAt", "url", "width" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
CREATE TABLE "new_Admin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageId" TEXT,
    "publish" TEXT NOT NULL DEFAULT 'publish',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Admin_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Admin" ("createdAt", "email", "id", "name", "password", "updatedAt") SELECT "createdAt", "email", "id", "name", "password", "updatedAt" FROM "Admin";
DROP TABLE "Admin";
ALTER TABLE "new_Admin" RENAME TO "Admin";
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
