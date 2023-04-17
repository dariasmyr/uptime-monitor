/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Post";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Uptime" (
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
