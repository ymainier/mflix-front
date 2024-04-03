import { NextResponse } from "next/server";
import { errorResponse } from "@/app/api/utils";
import prisma from "@/app/lib/prisma";
import { promisePool } from "@/app/lib/promisePool";

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
      console.log(`[start] for ${show.name}`);
      try {
        const seasonNumbers = show.seasons
          .map((season) => season.number)
          .filter((n) => n >= 0);
        const data = await fetcher(showUrl(show.tmdbId!, seasonNumbers));

        for await (const tmdbSeason of data.seasons) {
          console.log(`  [season start] for ${show.name}, ${tmdbSeason.season_number}`);
          try {
            const season = await prisma.season.findFirst({
              where: {
                tvShowId: show.id,
                number: tmdbSeason.season_number,
                tmdbId: null,
              },
            });
            if (!season) {
              continue;
            }

            const udpated = await prisma.season.update({
              where: { id: season?.id },
              data: {
                tmdbId: tmdbSeason.id,
                tmdbNumber: tmdbSeason.season_number,
                tmdbName: tmdbSeason.name,
                tmdbOverview: tmdbSeason.overview,
                tmdbPosterPath: tmdbSeason.poster_path,
              },
            });
          } catch (e) {
            console.log("something went wrong updating seasons", e, show);
          }
          console.log(`  [season end] for ${show.name}, ${tmdbSeason.season_number}`);
        }
      } catch (err) {
        console.log("err", err);
      }
      console.log(`[end] for ${show.name}`);
      return;
    });

    const updated = await promisePool(promises, 2);

    return NextResponse.json({ data: { updated } });
  } catch (e) {
    return errorResponse(e, 500);
  }
}
