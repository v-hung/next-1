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
    "imageId" TEXT,
    "audioId" TEXT,
    "groupId" TEXT,
    "publish" TEXT NOT NULL DEFAULT 'publish',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Scene_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Scene_audioId_fkey" FOREIGN KEY ("audioId") REFERENCES "File" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Scene_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "GroupScene" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Scene" ("audioId", "createdAt", "description", "faceSize", "groupId", "id", "imageId", "initialViewParameters", "levels", "name", "slug", "sort", "updatedAt", "url") SELECT "audioId", "createdAt", "description", "faceSize", "groupId", "id", "imageId", "initialViewParameters", "levels", "name", "slug", "sort", "updatedAt", "url" FROM "Scene";
DROP TABLE "Scene";
ALTER TABLE "new_Scene" RENAME TO "Scene";
CREATE UNIQUE INDEX "Scene_slug_key" ON "Scene"("slug");
CREATE TABLE "new_GroupScene" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "sort" INTEGER,
    "publish" TEXT NOT NULL DEFAULT 'publish',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_GroupScene" ("createdAt", "id", "name", "sort", "updatedAt") SELECT "createdAt", "id", "name", "sort", "updatedAt" FROM "GroupScene";
DROP TABLE "GroupScene";
ALTER TABLE "new_GroupScene" RENAME TO "GroupScene";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
