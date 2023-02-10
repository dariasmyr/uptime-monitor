-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Uptime" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "host" TEXT NOT NULL,
    "healthCheckIsAlive" TEXT NOT NULL,
    "healthCheckResponseBody" TEXT NOT NULL,
    "httpCheckIsAlive" TEXT NOT NULL,
    "httpCheckStatusCode" INTEGER,
    "pingCheckIsAlive" TEXT NOT NULL,
    "pingCheckTimeMs" INTEGER NOT NULL,
    "sslCheckIsAlive" TEXT NOT NULL,
    "sslCheckDaysLeft" INTEGER NOT NULL,
    "checkResolutions" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Uptime" ("createdAt", "healthCheckIsAlive", "healthCheckResponseBody", "host", "httpCheckIsAlive", "httpCheckStatusCode", "id", "pingCheckIsAlive", "pingCheckTimeMs", "sslCheckDaysLeft", "sslCheckIsAlive") SELECT "createdAt", "healthCheckIsAlive", "healthCheckResponseBody", "host", "httpCheckIsAlive", "httpCheckStatusCode", "id", "pingCheckIsAlive", "pingCheckTimeMs", "sslCheckDaysLeft", "sslCheckIsAlive" FROM "Uptime";
DROP TABLE "Uptime";
ALTER TABLE "new_Uptime" RENAME TO "Uptime";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
