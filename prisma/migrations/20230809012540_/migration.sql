/*
  Warnings:

  - You are about to drop the column `status` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Category` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "promotionalPrice" INTEGER,
    "heros" INTEGER NOT NULL,
    "skins" INTEGER NOT NULL,
    "rank" TEXT NOT NULL,
    "gem" INTEGER NOT NULL,
    "publish" TEXT NOT NULL DEFAULT 'draft',
    "categoryId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("categoryId", "createdAt", "gem", "heros", "id", "name", "price", "promotionalPrice", "rank", "skins", "updatedAt") SELECT "categoryId", "createdAt", "gem", "heros", "id", "name", "price", "promotionalPrice", "rank", "skins", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE TABLE "new_Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "sold" INTEGER DEFAULT 0,
    "type" TEXT NOT NULL,
    "publish" TEXT NOT NULL DEFAULT 'draft',
    "imageId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Category_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Category" ("createdAt", "id", "imageId", "sold", "title", "type", "updatedAt") SELECT "createdAt", "id", "imageId", "sold", "title", "type", "updatedAt" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
