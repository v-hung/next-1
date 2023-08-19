-- CreateTable
CREATE TABLE "GroupScene" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Scene" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "levels" TEXT NOT NULL,
    "faceSize" INTEGER NOT NULL,
    "initialViewParameters" TEXT NOT NULL,
    "audio" TEXT,
    "description" TEXT,
    "sort" INTEGER,
    "groupId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Scene_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "GroupScene" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InfoHotspot" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InfoHotspot_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "Scene" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LinkHotspot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "yaw" REAL NOT NULL,
    "pitch" REAL NOT NULL,
    "direction" TEXT,
    "target" TEXT NOT NULL,
    "type" TEXT,
    "sceneId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LinkHotspot_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "Scene" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Scene_slug_key" ON "Scene"("slug");
