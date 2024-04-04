import HeroImage from "@/app/components/HeroImage";
import prisma from "@/app/lib/prisma";
import { notFound } from "next/navigation";
import { Fragment } from "react";

export default async function Page({
  params: { seasonId },
}: {
  params: { seasonId: string };
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
    <Fragment>
      <HeroImage
        src={`https://image.tmdb.org/t/p/w780${season.tmdbPosterPath}`}
        title={name}
        description={season.tmdbOverview ?? ""}
      />

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-x-4 gap-y-8 mt-12">
        {season.videos.map((video) => (
          <li key={video.id}>
            <div className="flex flex-col gap-2">
              <img
                src={`https://image.tmdb.org/t/p/w342${video.tmdbStillPath}`}
                alt={video.tmdbName ?? ""}
                className="w-full h-auto rounded-lg"
              />
              <h2 className="font-bold">{video.tmdbName}</h2>
              <p className="text-sm">{video.tmdbOverview}</p>
            </div>
          </li>
        ))}
      </ul>
    </Fragment>
  );
}
