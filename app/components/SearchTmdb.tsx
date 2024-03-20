"use client";
import { useEffect, useRef, useState } from "react";
import ShowCard from "@/app/components/ShowCard";
import useSWR from "swr";

function getUrl(show: string): string {
  return `https://api.themoviedb.org/3/search/tv?query=${encodeURI(
    show
  )}&include_adult=false&language=en-US&page=1`;
}

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0Y2VjZGJlMjcyYmI4ZDliNWEyNTE4ZTlmNzBhMjQzYyIsInN1YiI6IjYzOTYxNWM4YTFhOWJhMDBlMjA3MDVhNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JUXDMqzGHCBI_Qtgs20NUUjqGy76VCpD9f3KSVv8ot0",
  },
};

const fetcher = (url: string) => fetch(url, options).then((res) => res.json());

function TmdbShows({
  name,
  onSelect,
}: {
  name: string;
  onSelect: (data: unknown) => void;
}) {
  const { data, isLoading } = useSWR(name ? getUrl(name) : null, fetcher);

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if ((data?.results ?? []) > 0) {
    return <p>No results found for {name}</p>;
  }

  return (
    <ul className="mx-auto">
      {data.results.map((show: any) => (
        <li key={show.id} className="list-none">
          <div className="m-4">
            <ShowCard
              title={show.name}
              description={show.overview}
              imagePath={show.poster_path}
              onSelect={() => onSelect(show)}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
export default function SearchTmdb({ id, name }: { id: number; name: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [revealed, setRevealed] = useState(false);

  async function handleSelect(id: number, tmdb: unknown) {
    await fetch("/api/show", {
      method: "POST",
      body: JSON.stringify({ id, tmdb }),
    });
  }

  return (
    <div>
      <button
        onClick={() => {
          setSearch(inputRef.current?.value ?? "");
          setRevealed(true);
        }}
      >
        Search TMDB
      </button>
      <input
        style={{ width: revealed ? undefined : 0 }}
        defaultValue={name}
        ref={inputRef}
      />
      {search && (
        <TmdbShows name={search} onSelect={(data) => handleSelect(id, data)} />
      )}
    </div>
  );
}
