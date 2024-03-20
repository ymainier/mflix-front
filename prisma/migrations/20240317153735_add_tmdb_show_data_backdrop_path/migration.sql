/*
  Warnings:

  - You are about to drop the column `tmdbStillPath` on the `TvShow` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TvShow" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "tmdbId" TEXT,
    "tmdbName" TEXT,
    "tmdbOverview" TEXT,
    "tmdbPosterPath" TEXT,
    "tmdbBackdropPath" TEXT
);
INSERT INTO "new_TvShow" ("id", "name", "tmdbId", "tmdbName", "tmdbOverview", "tmdbPosterPath") SELECT "id", "name", "tmdbId", "tmdbName", "tmdbOverview", "tmdbPosterPath" FROM "TvShow";
DROP TABLE "TvShow";
ALTER TABLE "new_TvShow" RENAME TO "TvShow";
CREATE UNIQUE INDEX "TvShow_name_key" ON "TvShow"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
