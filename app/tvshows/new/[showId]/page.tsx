import HeroImage from "@/app/components/HeroImage";
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
      <HeroImage
        src={`https://image.tmdb.org/t/p/w780${tvShow.tmdbBackdropPath}`}
        title={tvShow.tmdbName ?? ""}
        description={tvShow.tmdbOverview ?? ""}
      />
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
