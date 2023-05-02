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
    "size" REAL NOT NULL
);
INSERT INTO "new_Image" ("caption", "height", "id", "name", "naturalHeight", "naturalWidth", "size", "type", "url", "width") SELECT "caption", "height", "id", "name", "naturalHeight", "naturalWidth", "size", "type", "url", "width" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
