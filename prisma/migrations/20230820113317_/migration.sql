/*
  Warnings:

  - You are about to drop the column `createdAt` on the `LinkHotspot` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `LinkHotspot` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `InfoHotspot` table. All the data in the column will be lost.
  - You are about to drop the column `file` on the `InfoHotspot` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `InfoHotspot` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LinkHotspot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "yaw" REAL NOT NULL,
    "pitch" REAL NOT NULL,
    "direction" TEXT,
    "target" TEXT NOT NULL,
    "type" TEXT,
    "sceneId" TEXT NOT NULL,
    CONSTRAINT "LinkHotspot_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "Scene" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LinkHotspot" ("direction", "id", "pitch", "sceneId", "target", "type", "yaw") SELECT "direction", "id", "pitch", "sceneId", "target", "type", "yaw" FROM "LinkHotspot";
DROP TABLE "LinkHotspot";
ALTER TABLE "new_LinkHotspot" RENAME TO "LinkHotspot";
CREATE TABLE "new_InfoHotspot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "yaw" REAL NOT NULL,
    "pitch" REAL NOT NULL,
    "direction" TEXT,
    "title" TEXT,
    "description" TEXT,
    "image" TEXT,
    "type" TEXT,
    "video" TEXT,
    "sceneId" TEXT NOT NULL,
    CONSTRAINT "InfoHotspot_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "Scene" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_InfoHotspot" ("description", "direction", "id", "pitch", "sceneId", "title", "type", "yaw") SELECT "description", "direction", "id", "pitch", "sceneId", "title", "type", "yaw" FROM "InfoHotspot";
DROP TABLE "InfoHotspot";
ALTER TABLE "new_InfoHotspot" RENAME TO "InfoHotspot";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
