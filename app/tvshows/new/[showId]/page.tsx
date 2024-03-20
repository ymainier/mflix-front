import SearchTmdb from "@/app/components/SearchTmdb";
import prisma from "@/app/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

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
    <section>
      <h1>{tvShow.name}</h1>
      <SearchTmdb id={tvShow.id} name={tvShow.name} />
      <ul>
        {tvShow.seasons.map((season) => (
          <li key={season.id}>
            <Link href={`/tvshows/new/${season.tvShowId}/${season.id}`}>
              {season.number}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
