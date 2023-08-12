-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PermissionsOnRoles" (
    "roleId" TEXT NOT NULL,
    "permissionKey" TEXT NOT NULL,
    "permissionTableName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,

    PRIMARY KEY ("roleId", "permissionKey", "permissionTableName"),
    CONSTRAINT "PermissionsOnRoles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PermissionsOnRoles_permissionKey_permissionTableName_fkey" FOREIGN KEY ("permissionKey", "permissionTableName") REFERENCES "Permission" ("key", "tableName") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PermissionsOnRoles" ("createdAt", "permissionKey", "permissionTableName", "roleId", "updatedAt") SELECT "createdAt", "permissionKey", "permissionTableName", "roleId", "updatedAt" FROM "PermissionsOnRoles";
DROP TABLE "PermissionsOnRoles";
ALTER TABLE "new_PermissionsOnRoles" RENAME TO "PermissionsOnRoles";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
