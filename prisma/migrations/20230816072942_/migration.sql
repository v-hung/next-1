-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GroupSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "canDelete" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_GroupSetting" ("canDelete", "createdAt", "id", "name", "updatedAt") SELECT coalesce("canDelete", true) AS "canDelete", "createdAt", "id", "name", "updatedAt" FROM "GroupSetting";
DROP TABLE "GroupSetting";
ALTER TABLE "new_GroupSetting" RENAME TO "GroupSetting";
CREATE TABLE "new_Setting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "details" TEXT,
    "value" TEXT,
    "required" BOOLEAN NOT NULL,
    "col" INTEGER,
    "canDelete" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "groupId" TEXT NOT NULL,
    CONSTRAINT "Setting_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "GroupSetting" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Setting" ("canDelete", "col", "createdAt", "details", "groupId", "id", "name", "required", "type", "updatedAt", "value") SELECT coalesce("canDelete", true) AS "canDelete", "col", "createdAt", "details", "groupId", "id", "name", "required", "type", "updatedAt", "value" FROM "Setting";
DROP TABLE "Setting";
ALTER TABLE "new_Setting" RENAME TO "Setting";
CREATE UNIQUE INDEX "Setting_name_key" ON "Setting"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
