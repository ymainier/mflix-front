import LinkButton from "./components/LinkButton";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl flex flex-col sm:flex-row items-center sm:items-start min-h-screen p-6 pt-12 sm:p-12 gap-6 sm:gap-12">
      <LinkButton href="/tvshows" className="w-full text-center">TV&nbsp;Shows</LinkButton>
      <LinkButton href="/movies" className="w-full text-center">Movies</LinkButton>
    </main>
  );
}
