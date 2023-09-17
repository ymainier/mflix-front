import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col sm:flex-row justify-evenly items-center min-h-screen p-6 md:p-12">
      <Link href="/tvshows">TV&nbsp;Shows</Link>
      <Link href="/movies">Movies</Link>
    </main>
  );
}
