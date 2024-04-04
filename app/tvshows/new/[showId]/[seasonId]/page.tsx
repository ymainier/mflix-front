import HeroImage from "@/app/components/HeroImage";
import prisma from "@/app/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Playable from "@/app/tvshows/new/[showId]/[seasonId]/playable";

export default async function Page({
  params: { showId, seasonId },
}: {
  params: { showId: string; seasonId: string };
}) {
  const season = await prisma.season.findUnique({
    where: { id: parseInt(seasonId, 10) },
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
      <div className="flex">
        <Link
          href={`/tvshows/new/${showId}`}
          className="bg-transparent hover:bg-red-700 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-700 hover:border-transparent text-center rounded"
        >
          back
        </Link>
      </div>
      <HeroImage
        src={`https://image.tmdb.org/t/p/w780${season.tmdbPosterPath}`}
        title={name}
        description={season.tmdbOverview ?? ""}
      />

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-8 mt-4">
        {season.videos.map((video) => (
          <li key={video.id}>
            <div className="flex flex-col gap-2">
              <div className="relative">
                <Playable path={video.path} secondsPlayed={video.secondsPlayed}>
                  <img
                    src={`https://image.tmdb.org/t/p/w342${video.tmdbStillPath}`}
                    alt={video.tmdbName ?? ""}
                    className="w-full h-auto rounded-lg"
                  />
                </Playable>
              </div>
              <Playable path={video.path} secondsPlayed={video.secondsPlayed}>
                <h2 className="font-bold">{video.tmdbName}</h2>
              </Playable>
              <p className="text-sm max-h-20 overflow-auto">
                {video.tmdbOverview}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
