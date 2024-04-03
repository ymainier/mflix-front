import { NextResponse } from "next/server";
import { errorResponse } from "@/app/api/utils";
import prisma from "@/app/lib/prisma";
import { promisePool } from "@/app/lib/promisePool";

function getShowUrl(show: string): string {
  return `https://api.themoviedb.org/3/search/tv?query=${encodeURI(
    show
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
      await prisma.tvShow.updateMany({
        data: {
          tmdbId: null,
          tmdbName: null,
          tmdbOverview: null,
          tmdbBackdropPath: null,
          tmdbPosterPath: null,
        },
      });
    }

    const showsToRequest = await prisma.tvShow.findMany({
      where: { tmdbId: null },
    });
    const promises = showsToRequest.map((show) => async () => {
      const data = await fetcher(getShowUrl(show.name));
      const result = data.results[0];
      const dbShow = await prisma.tvShow.update({
        where: { id: show.id },
        data: {
          tmdbId: `${result.id}`,
          tmdbName: result.name,
          tmdbOverview: result.overview,
          tmdbBackdropPath: result.backdrop_path,
          tmdbPosterPath: result.poster_path,
        },
      });
      return dbShow;
    });

    const updated = await promisePool(promises, 2);

    return NextResponse.json({ data: { updated } });
  } catch (e) {
    return errorResponse(e, 500);
  }
}
