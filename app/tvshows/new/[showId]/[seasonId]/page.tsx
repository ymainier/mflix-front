import prisma from "@/app/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

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
    <main className="mx-auto max-w-3xl px-6 pt-12 pb-32 sm:px-12">
      <div className="relative h-[300px]">
        {/* Background image */}
        <img
          src={`https://image.tmdb.org/t/p/w780${season.tmdbPosterPath}`}
          alt={name}
          className="w-full h-full object-cover rounded-lg"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black rounded-lg"></div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-4">
          {/* Title and metadata */}
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-2">{name}</h1>
            <p className="text-sm">{season.tmdbOverview}</p>
          </div>
        </div>
      </div>
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
    </main>
  );
}
