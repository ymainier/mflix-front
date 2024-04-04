import { NextResponse } from "next/server";
import { errorResponse } from "@/app/api/utils";
import prisma from "@/app/lib/prisma";
import { promisePool } from "@/app/lib/promisePool";
import { filenameParse } from "@ctrl/video-filename-parser";

function showUrl(id: string, seasonNumbers: Array<number>): string {
  return `https://api.themoviedb.org/3/tv/${id}?append_to_response=${encodeURIComponent(
    seasonNumbers.map((n) => `season/${n}`).join(",")
  )}&include_adult=false&language=en-US&page=1`;
}

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
  },
};

const fetcher = (url: string) => fetch(url, options).then((res) => res.json());

function extractEpisodeNumber(path: string): number | null {
  const elts = path.split("/");
  const parsed = filenameParse(elts[elts.length - 1], true);
  // @ts-expect-error filenameParse types for tv show are wrong
  return parsed.episodeNumbers?.[0] ?? null;
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const shouldReset = searchParams.has("reset");

  try {
    if (shouldReset) {
      await prisma.season.updateMany({
        data: {
          tmdbId: null,
          tmdbNumber: null,
          tmdbName: null,
          tmdbOverview: null,
          tmdbPosterPath: null,
        },
      });

      await prisma.video.updateMany({
        data: {
          episodeNumber: null,
          tmdbId: null,
          tmdbNumber: null,
          tmdbName: null,
          tmdbOverview: null,
          tmdbStillPath: null,
        },
      });
    }

    const showsWithSeasonsAndEpisodes = await prisma.tvShow.findMany({
      where: {
        // tmdbId: "63926",
        tmdbId: {
          not: null,
        },
      },
      include: {
        seasons: {
          include: {
            videos: true,
          },
        },
      },
    });

    const promises = showsWithSeasonsAndEpisodes.map((show) => async () => {
      try {
        const seasonNumbers = show.seasons
          .map((season) => season.number)
          .filter((n) => n >= 0);
        const data = await fetcher(showUrl(show.tmdbId!, seasonNumbers));

        for await (const tmdbSeason of data.seasons) {
          try {
            const season = await prisma.season.findFirst({
              where: {
                tvShowId: show.id,
                number: tmdbSeason.season_number,
                tmdbId: null,
              },
              select: {
                id: true,
                videos: true,
              },
            });
            if (!season) {
              continue;
            }

            await prisma.season.update({
              where: { id: season?.id },
              data: {
                tmdbId: tmdbSeason.id,
                tmdbNumber: tmdbSeason.season_number,
                tmdbName: tmdbSeason.name,
                tmdbOverview: tmdbSeason.overview,
                tmdbPosterPath: tmdbSeason.poster_path,
              },
            });

            const detailledSeason = data[`season/${tmdbSeason.season_number}`];
            if (detailledSeason == null) continue;
            for await (const video of season.videos) {
              try {
                const episodeNumber =
                  video.episodeNumber ?? extractEpisodeNumber(video.path);
                if (episodeNumber == null) continue;
                const episode = detailledSeason.episodes.find(
                  (e: any) => e.episode_number === episodeNumber
                );
                if (!episode) continue;
                await prisma.video.update({
                  where: { id: video?.id },
                  data: {
                    episodeNumber,
                    tmdbId: episode.id,
                    tmdbNumber: episode.episode_number,
                    tmdbName: episode.name,
                    tmdbOverview: episode.overview,
                    tmdbStillPath: episode.still_path,
                  },
                });
              } catch (e) {
                console.log(
                  `something went wrong updating episode ${show.name} - ${tmdbSeason.name} (${tmdbSeason.season_number}) - ${video.episodeNumber} (${video.path})`,
                  e
                );
              }
            }
          } catch (e) {
            console.log(
              `something went wrong updating seasons ${show.name} - ${tmdbSeason.name} (${tmdbSeason.season_number})`,
              e
            );
          }
        }
      } catch (err) {
        console.log("err", err);
      }
      return;
    });

    const updated = await promisePool(promises, 2);

    return NextResponse.json({ data: { updated } });
  } catch (e) {
    return errorResponse(e, 500);
  }
}
