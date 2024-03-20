import prisma from "@/app/lib/prisma";
import Link from "next/link";

export default async function NewTvShows() {
  const tvShows = await prisma.tvShow.findMany({
    orderBy: { name: "asc" },
  });
  return (
    <ul>
      {tvShows.map(({id, name}) => (
        <li key={id}><Link href={`/tvshows/new/${id}`}>{name}</Link></li>
      ))}
    </ul>
  );
}
