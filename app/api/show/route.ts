import { NextResponse } from "next/server";
import { errorResponse } from "@/app/api/utils";
import prisma from "@/app/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const tvShow = await prisma.tvShow.update({
      where: {
        id: parseInt(data.id, 10),
      },
      data: {
        tmdbId: data.tmdb.id.toString(),
        tmdbName: data.tmdb.name,
        tmdbOverview: data.tmdb.overview,
        tmdbPosterPath: data.tmdb.poster_path,
        tmdbBackdropPath: data.tmdb.backdrop_path,
      },
    });

    return NextResponse.json({ data: tvShow });
  } catch (e) {
    return errorResponse(e, 500);
  }
}
