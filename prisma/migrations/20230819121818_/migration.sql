/*
  Warnings:

  - You are about to drop the `FolderImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ImageToProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `audio` on the `Scene` table. All the data in the column will be lost.
  - You are about to drop the column `imageId` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `InfoHotspot` table. All the data in the column will be lost.
  - You are about to drop the column `video` on the `InfoHotspot` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `imageId` on the `Category` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "_ImageToProduct_B_index";

-- DropIndex
DROP INDEX "_ImageToProduct_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "FolderImage";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Image";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ImageToProduct";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "FolderFile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "tableName" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FolderFile_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FolderFile_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "FolderFile" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "caption" TEXT,
    "url" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "naturalHeight" INTEGER,
    "naturalWidth" INTEGER,
    "size" REAL NOT NULL,
    "tableName" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "folderFileId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "File_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "File_folderFileId_fkey" FOREIGN KEY ("folderFileId") REFERENCES "FolderFile" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_FileToProduct" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_FileToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "File" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_FileToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Scene" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "levels" TEXT NOT NULL,
    "faceSize" INTEGER NOT NULL,
    "initialViewParameters" TEXT NOT NULL,
    "description" TEXT,
    "sort" INTEGER,
    "audioId" TEXT,
    "groupId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Scene_audioId_fkey" FOREIGN KEY ("audioId") REFERENCES "File" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Scene_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "GroupScene" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Scene" ("createdAt", "description", "faceSize", "groupId", "id", "initialViewParameters", "levels", "name", "slug", "sort", "updatedAt", "url") SELECT "createdAt", "description", "faceSize", "groupId", "id", "initialViewParameters", "levels", "name", "slug", "sort", "updatedAt", "url" FROM "Scene";
DROP TABLE "Scene";
ALTER TABLE "new_Scene" RENAME TO "Scene";
CREATE UNIQUE INDEX "Scene_slug_key" ON "Scene"("slug");
CREATE TABLE "new_Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fileId" TEXT,
    "roleId" TEXT NOT NULL,
    "publish" TEXT NOT NULL DEFAULT 'publish',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Admin_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Admin_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Admin" ("createdAt", "email", "id", "name", "password", "publish", "roleId", "updatedAt") SELECT "createdAt", "email", "id", "name", "password", "publish", "roleId", "updatedAt" FROM "Admin";
DROP TABLE "Admin";
ALTER TABLE "new_Admin" RENAME TO "Admin";
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");
CREATE TABLE "new_InfoHotspot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "yaw" REAL NOT NULL,
    "pitch" REAL NOT NULL,
    "direction" TEXT,
    "title" TEXT,
    "description" TEXT,
    "file" TEXT,
    "type" TEXT,
    "sceneId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InfoHotspot_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "Scene" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_InfoHotspot" ("createdAt", "description", "direction", "id", "pitch", "sceneId", "title", "type", "updatedAt", "yaw") SELECT "createdAt", "description", "direction", "id", "pitch", "sceneId", "title", "type", "updatedAt", "yaw" FROM "InfoHotspot";
DROP TABLE "InfoHotspot";
ALTER TABLE "new_InfoHotspot" RENAME TO "InfoHotspot";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "file" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "emailVerified", "id", "name", "password", "updatedAt") SELECT "createdAt", "email", "emailVerified", "id", "name", "password", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "sold" INTEGER DEFAULT 0,
    "type" TEXT NOT NULL,
    "fileId" TEXT,
    "publish" TEXT NOT NULL DEFAULT 'publish',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Category_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Category" ("createdAt", "id", "publish", "sold", "title", "type", "updatedAt") SELECT "createdAt", "id", "publish", "sold", "title", "type", "updatedAt" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_FileToProduct_AB_unique" ON "_FileToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_FileToProduct_B_index" ON "_FileToProduct"("B");
