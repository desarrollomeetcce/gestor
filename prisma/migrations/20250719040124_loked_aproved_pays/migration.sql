-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WorkLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "hours" REAL NOT NULL,
    "description" TEXT,
    "assignedBy" INTEGER,
    "approvedBy" INTEGER,
    "costPerHour" REAL,
    "totalCost" REAL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WorkLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WorkLog_assignedBy_fkey" FOREIGN KEY ("assignedBy") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "WorkLog_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_WorkLog" ("assignedBy", "costPerHour", "createdAt", "date", "description", "hours", "id", "paid", "totalCost", "userId") SELECT "assignedBy", "costPerHour", "createdAt", "date", "description", "hours", "id", "paid", "totalCost", "userId" FROM "WorkLog";
DROP TABLE "WorkLog";
ALTER TABLE "new_WorkLog" RENAME TO "WorkLog";
CREATE UNIQUE INDEX "WorkLog_userId_date_key" ON "WorkLog"("userId", "date");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
