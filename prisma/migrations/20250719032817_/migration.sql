/*
  Warnings:

  - A unique constraint covering the columns `[userId,date]` on the table `WorkLog` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WorkLog_userId_date_key" ON "WorkLog"("userId", "date");
