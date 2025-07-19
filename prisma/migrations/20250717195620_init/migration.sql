-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profileId" INTEGER NOT NULL,
    "isSuperAdmin" BOOLEAN NOT NULL DEFAULT false,
    "customRate" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "defaultRate" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Link" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "typeId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,
    CONSTRAINT "Link_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "LinkType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Link_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LinkType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "WorkLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "hours" REAL NOT NULL,
    "description" TEXT,
    "assignedBy" INTEGER,
    "costPerHour" REAL,
    "totalCost" REAL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WorkLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WorkLog_assignedBy_fkey" FOREIGN KEY ("assignedBy") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_PermissionToProfile" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_PermissionToProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "Permission" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PermissionToProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_SharedWithUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_SharedWithUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Link" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_SharedWithUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_SharedWithProfiles" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_SharedWithProfiles_A_fkey" FOREIGN KEY ("A") REFERENCES "Link" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_SharedWithProfiles_B_fkey" FOREIGN KEY ("B") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Link_ownerId_key" ON "Link"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "LinkType_name_key" ON "LinkType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_PermissionToProfile_AB_unique" ON "_PermissionToProfile"("A", "B");

-- CreateIndex
CREATE INDEX "_PermissionToProfile_B_index" ON "_PermissionToProfile"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SharedWithUsers_AB_unique" ON "_SharedWithUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_SharedWithUsers_B_index" ON "_SharedWithUsers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SharedWithProfiles_AB_unique" ON "_SharedWithProfiles"("A", "B");

-- CreateIndex
CREATE INDEX "_SharedWithProfiles_B_index" ON "_SharedWithProfiles"("B");
