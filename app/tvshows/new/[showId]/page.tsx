import HeroImage from "@/app/components/HeroImage";
import { Viewable } from "@/app/components/Viewable";
import prisma from "@/app/lib/prisma";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { ToggleViewable } from "@/app/components/toggle-viewable";

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
        id={tvShow.id}
        kind="show"
        src={`https://image.tmdb.org/t/p/w780${tvShow.tmdbBackdropPath}`}
        title={tvShow.tmdbName ?? ""}
        description={tvShow.tmdbOverview ?? ""}
        isCompleted={tvShow.isCompleted}
      />
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-x-4 gap-y-8 mt-4">
        {tvShow.seasons.map((season) => (
          <li key={season.id}>
            <Link
              href={`/tvshows/new/${season.tvShowId}/${season.id}`}
              className="flex flex-col gap-2"
            >
              <div className="relative">
                <Viewable isCompleted={season.isCompleted}>
                  <img
                    src={`https://image.tmdb.org/t/p/w342${season.tmdbPosterPath}`}
                    alt={season.tmdbName ?? `Season ${season.number}`}
                    className="w-full h-auto rounded-lg"
                  />
                </Viewable>
                <ToggleViewable
                  id={season.id}
                  kind="season"
                  isCompleted={!season.isCompleted}
                  className="absolute top-2 right-2 w-12 h-12 leading-[3rem] bg-white rounded-full text-center border cursor-pointer"
                />
              </div>
              <span>{season.tmdbName ?? `Season ${season.number}`}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
