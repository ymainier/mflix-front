-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Season" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" INTEGER NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "tmdbId" INTEGER,
    "tmdbNumber" INTEGER,
    "tmdbName" TEXT,
    "tmdbOverview" TEXT,
    "tmdbPosterPath" TEXT,
    "tvShowId" INTEGER,
    CONSTRAINT "Season_tvShowId_fkey" FOREIGN KEY ("tvShowId") REFERENCES "TvShow" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Season" ("id", "number", "tmdbId", "tmdbName", "tmdbNumber", "tmdbOverview", "tmdbPosterPath", "tvShowId") SELECT "id", "number", "tmdbId", "tmdbName", "tmdbNumber", "tmdbOverview", "tmdbPosterPath", "tvShowId" FROM "Season";
DROP TABLE "Season";
ALTER TABLE "new_Season" RENAME TO "Season";
CREATE UNIQUE INDEX "Season_number_tvShowId_key" ON "Season"("number", "tvShowId");
CREATE TABLE "new_TvShow" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "tmdbId" TEXT,
    "tmdbName" TEXT,
    "tmdbOverview" TEXT,
    "tmdbPosterPath" TEXT,
    "tmdbBackdropPath" TEXT
);
INSERT INTO "new_TvShow" ("id", "name", "tmdbBackdropPath", "tmdbId", "tmdbName", "tmdbOverview", "tmdbPosterPath") SELECT "id", "name", "tmdbBackdropPath", "tmdbId", "tmdbName", "tmdbOverview", "tmdbPosterPath" FROM "TvShow";
DROP TABLE "TvShow";
ALTER TABLE "new_TvShow" RENAME TO "TvShow";
CREATE UNIQUE INDEX "TvShow_name_key" ON "TvShow"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
