-- CreateTable
CREATE TABLE "Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "host" TEXT NOT NULL,
    "healthCheckIsAlive" TEXT NOT NULL,
    "healthCheckResponseBody" TEXT NOT NULL,
    "httpCheckIsAlive" TEXT NOT NULL,
    "httpCheckMessage" TEXT NOT NULL,
    "pingCheckIsAlive" TEXT NOT NULL,
    "pingCheckTimeMs" INTEGER NOT NULL,
    "sslCheckIsAlive" TEXT NOT NULL,
    "sslCheckDaysLeft" INTEGER NOT NULL
);
