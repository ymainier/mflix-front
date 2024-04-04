import prisma from "@/app/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";

export default async function Page({
  params: { showId },
}: {
  params: { showId: string };
}) {
  const tvShow = await prisma.tvShow.findUnique({
    where: { id: parseInt(showId, 10) },
    include: {
      seasons: true,
    },
  });

  if (!tvShow) {
    notFound();
  }

  return (
    <Fragment>
      <div className="relative h-[300px]">
        {/* Background image */}
        <img
          src={`https://image.tmdb.org/t/p/w780${tvShow.tmdbBackdropPath}`}
          alt={tvShow.tmdbName ?? ""}
          className="w-full h-full object-cover rounded-lg"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black rounded-lg"></div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-4">
          {/* Title and metadata */}
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-2">{tvShow.tmdbName}</h1>
            <p className="text-sm max-h-24 overflow-auto">{tvShow.tmdbOverview}</p>
          </div>
        </div>
      </div>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-x-4 gap-y-8 mt-12">
        {tvShow.seasons.map((season) => (
          <li key={season.id}>
            <Link
              href={`/tvshows/new/${season.tvShowId}/${season.id}`}
              className="flex flex-col gap-2"
            >
              <img
                src={`https://image.tmdb.org/t/p/w342${season.tmdbPosterPath}`}
                alt={season.tmdbName ?? `Season ${season.number}`}
                className="w-full h-auto rounded-lg"
              />
              <span>{season.tmdbName ?? `Season ${season.number}`}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Fragment>
  );
}
