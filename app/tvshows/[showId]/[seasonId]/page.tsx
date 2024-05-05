import HeroImage from "@/app/components/HeroImage";
import prisma from "@/app/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Playable from "@/app/tvshows/[showId]/[seasonId]/playable";
import { ToggleViewable } from "@/app/components/toggle-viewable";
import { Viewable } from "@/app/components/Viewable";
import LightLink from "@/app/components/LightLink";
import { Focus } from "@/app/components/PlayerButtons";

// TODO revisit and use a better revalidation strategy
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page({
  params: { showId, seasonId },
  searchParams: { all },
}: {
  params: { showId: string; seasonId: string };
  searchParams: { all: string | undefined };
}) {
  const id = parseInt(seasonId, 10);
  const showAll = typeof all === "string";
  const filter = showAll ? {} : { isCompleted: false };

  const season = await prisma.season.findUnique({
    where: { id },
    include: {
      videos: {
        orderBy: {
          tmdbNumber: "asc",
        },
        where: {
          NOT: [
            {
              tmdbNumber: null,
            },
          ],
          ...filter,
        },
      },
      TvShow: true,
    },
  });

  if (!season) {
    notFound();
  }

  const name = `${season.TvShow?.name ?? ""} - ${season.tmdbName}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <LightLink href={`/tvshows/${showId}`}>back</LightLink>
        <Focus className="p-3" />
        <LightLink
          href={
            showAll
              ? `/tvshows/${showId}/${seasonId}`
              : `/tvshows/${showId}/${seasonId}?all`
          }
        >
          {showAll ? "not seen" : "show all"}
        </LightLink>
      </div>
      <HeroImage
        id={season.id}
        kind="season"
        src={`https://image.tmdb.org/t/p/w780${season.tmdbPosterPath}`}
        title={name}
        description={season.tmdbOverview ?? ""}
        isCompleted={season.isCompleted}
      />

      {season.videos.length === 0 && !showAll && (
        <p>
          All episodes have been seen,
          <Link
            href={`/tvshows/${showId}/${seasonId}?all`}
            className="bg-transparent hover:bg-red-700 text-red-700 font-semibold hover:text-white py-2 px-2 rounded"
          >
            show everything
          </Link>
        </p>
      )}

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-8 mt-4">
        {season.videos.map((video) => (
          <li key={video.id}>
            <div className="flex flex-col gap-2">
              <div className="relative">
                <Viewable isCompleted={video.isCompleted}>
                  <Playable
                    path={video.path}
                    secondsPlayed={video.secondsPlayed}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w342${video.tmdbStillPath}`}
                      alt={video.tmdbName ?? ""}
                      className="w-full h-auto rounded-lg transition ease-in-out"
                    />
                  </Playable>
                </Viewable>
                <ToggleViewable
                  id={video.id}
                  kind="episode"
                  isCompleted={!video.isCompleted}
                  className="absolute top-2 right-2 w-12 h-12 leading-[3rem] bg-white rounded-full text-center border cursor-pointer"
                />
              </div>
              <Viewable isCompleted={video.isCompleted}>
                <Playable path={video.path} secondsPlayed={video.secondsPlayed}>
                  <h2 className="font-bold transition ease-in-out">
                    {video.tmdbNumber} - {video.tmdbName}
                  </h2>
                </Playable>
              </Viewable>
              <Viewable isCompleted={video.isCompleted}>
                <p className="text-sm max-h-20 overflow-auto">
                  {video.tmdbOverview}
                </p>
              </Viewable>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
