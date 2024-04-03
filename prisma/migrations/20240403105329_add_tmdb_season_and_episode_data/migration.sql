-- AlterTable
ALTER TABLE "Season" ADD COLUMN "tmdbId" INTEGER;
ALTER TABLE "Season" ADD COLUMN "tmdbName" TEXT;
ALTER TABLE "Season" ADD COLUMN "tmdbNumber" INTEGER;
ALTER TABLE "Season" ADD COLUMN "tmdbOverview" TEXT;
ALTER TABLE "Season" ADD COLUMN "tmdbPosterPath" TEXT;

-- AlterTable
ALTER TABLE "Video" ADD COLUMN "tmdbId" INTEGER;
ALTER TABLE "Video" ADD COLUMN "tmdbName" TEXT;
ALTER TABLE "Video" ADD COLUMN "tmdbNumber" INTEGER;
ALTER TABLE "Video" ADD COLUMN "tmdbOverview" TEXT;
ALTER TABLE "Video" ADD COLUMN "tmdbStillPath" TEXT;
