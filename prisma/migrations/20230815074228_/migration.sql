/*
  Warnings:

  - You are about to drop the column `field` on the `Setting` table. All the data in the column will be lost.
  - Added the required column `required` to the `Setting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Setting` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Setting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "details" TEXT,
    "value" TEXT,
    "required" BOOLEAN NOT NULL,
    "col" INTEGER,
    "canDelete" BOOLEAN,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "groupId" TEXT NOT NULL,
    CONSTRAINT "Setting_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "GroupSetting" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Setting" ("canDelete", "createdAt", "details", "groupId", "id", "name", "updatedAt", "value") SELECT "canDelete", "createdAt", "details", "groupId", "id", "name", "updatedAt", "value" FROM "Setting";
DROP TABLE "Setting";
ALTER TABLE "new_Setting" RENAME TO "Setting";
CREATE UNIQUE INDEX "Setting_name_key" ON "Setting"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
