import HeroImage from "@/app/components/HeroImage";
import prisma from "@/app/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

// TODO revisit and use a better revalidation strategy
export const dynamic = "force-dynamic";
export const revalidate = 0;

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
    <div className="flex flex-col gap-4">
      <div className="flex">
        <Link
          href="/tvshows/new"
          className="bg-transparent hover:bg-red-700 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-700 hover:border-transparent text-center rounded"
        >
          back
        </Link>
      </div>
      <HeroImage
        src={`https://image.tmdb.org/t/p/w780${tvShow.tmdbBackdropPath}`}
        title={tvShow.tmdbName ?? ""}
        description={tvShow.tmdbOverview ?? ""}
      />
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-x-4 gap-y-8 mt-4">
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
    </div>
  );
}
