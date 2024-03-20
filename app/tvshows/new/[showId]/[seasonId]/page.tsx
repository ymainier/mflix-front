import prisma from "@/app/lib/prisma";
import { notFound } from "next/navigation";

export default async function Page({
  params: { seasonId },
}: {
  params: { seasonId: string };
}) {
  const season = await prisma.season.findUnique({
    where: { id: parseInt(seasonId, 10) },
    include: {
      videos: true,
      TvShow: true,
    },
  });

  if (!season) {
    notFound();
  }

  return (
    <section>
      <h1>
        {season.TvShow?.name} - Season {season.number}
      </h1>
      <ul>
        {season.videos.map((video) => (
          <li key={video.id}>
              {video.episodeNumber} - {video.path}
          </li>
        ))}
      </ul>
    </section>
  );
}
