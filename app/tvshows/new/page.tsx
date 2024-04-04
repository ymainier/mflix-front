import prisma from "@/app/lib/prisma";
import Link from "next/link";

export default async function NewTvShows() {
  const tvShows = await prisma.tvShow.findMany({
    orderBy: { name: "asc" },
  });
  return (
    <ul className="grid grid-cols-[repeat(auto-fit,_minmax(10rem,_1fr))] gap-4">
      {tvShows.map(({ id, name, tmdbPosterPath }) => (
        <li key={id}>
          <Link href={`/tvshows/new/${id}`} className="flex flex-col">
            <img
              src={`https://image.tmdb.org/t/p/w342${tmdbPosterPath}`}
              alt={name}
              className="w-full h-auto rounded-lg"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
