/*
  Warnings:

  - You are about to drop the column `httpCheckMessage` on the `Uptime` table. All the data in the column will be lost.
  - Added the required column `httpCheckStatusCode` to the `Uptime` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Uptime" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "host" TEXT NOT NULL,
    "healthCheckIsAlive" TEXT NOT NULL,
    "healthCheckResponseBody" TEXT NOT NULL,
    "httpCheckIsAlive" TEXT NOT NULL,
    "httpCheckStatusCode" INTEGER NOT NULL,
    "pingCheckIsAlive" TEXT NOT NULL,
    "pingCheckTimeMs" INTEGER NOT NULL,
    "sslCheckIsAlive" TEXT NOT NULL,
    "sslCheckDaysLeft" INTEGER NOT NULL
);
INSERT INTO "new_Uptime" ("createdAt", "healthCheckIsAlive", "healthCheckResponseBody", "host", "httpCheckIsAlive", "id", "pingCheckIsAlive", "pingCheckTimeMs", "sslCheckDaysLeft", "sslCheckIsAlive") SELECT "createdAt", "healthCheckIsAlive", "healthCheckResponseBody", "host", "httpCheckIsAlive", "id", "pingCheckIsAlive", "pingCheckTimeMs", "sslCheckDaysLeft", "sslCheckIsAlive" FROM "Uptime";
DROP TABLE "Uptime";
ALTER TABLE "new_Uptime" RENAME TO "Uptime";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
