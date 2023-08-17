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
    "naturalHeight" INTEGER,
    "naturalWidth" INTEGER,
    "size" REAL NOT NULL,
    "tableName" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "folderImageId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Image_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Image_folderImageId_fkey" FOREIGN KEY ("folderImageId") REFERENCES "FolderImage" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("adminId", "caption", "createdAt", "folderImageId", "height", "id", "name", "naturalHeight", "naturalWidth", "size", "tableName", "type", "updatedAt", "url", "width") SELECT "adminId", "caption", "createdAt", "folderImageId", "height", "id", "name", "naturalHeight", "naturalWidth", "size", "tableName", "type", "updatedAt", "url", "width" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
