/*
  Warnings:

  - A unique constraint covering the columns `[number,tvShowId]` on the table `Season` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Season_number_tvShowId_key" ON "Season"("number", "tvShowId");
