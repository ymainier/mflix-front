import { Viewable } from "@/app/components/Viewable";
import prisma from "@/app/lib/prisma";
import Link from "next/link";
import { ToggleViewable } from "@/app/components/toggle-viewable";

// TODO revisit and use a better revalidation strategy
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function NewTvShows() {
  const tvShows = await prisma.tvShow.findMany({
    orderBy: { name: "asc" },
  });
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
      {tvShows.map(({ id, name, tmdbPosterPath, isCompleted }) => (
        <li key={id}>
          <Link href={`/tvshows/new/${id}`} className="flex flex-col relative">
            <Viewable isCompleted={isCompleted}>
              <img
                src={`https://image.tmdb.org/t/p/w342${tmdbPosterPath}`}
                alt={name}
                className="w-full h-auto rounded-lg"
              />
              <ToggleViewable
                id={id}
                kind="show"
                isCompleted={!isCompleted}
                className="absolute top-2 right-2 w-12 h-12 leading-[3rem] bg-white rounded-full text-center border cursor-pointer"
              />
            </Viewable>
          </Link>
        </li>
      ))}
    </ul>
  );
}
