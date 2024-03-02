import LinkButton from "./components/LinkButton";
import { Focus } from "./components/PlayerButtons";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl flex flex-col sm:flex-row items-center p-6 pt-12 sm:p-12 gap-6">
      <LinkButton href="/tvshows" className="w-full text-center">
        TV&nbsp;Shows
      </LinkButton>
      <Focus />
      <LinkButton href="/movies" className="w-full text-center">
        Movies
      </LinkButton>
    </main>
  );
}
