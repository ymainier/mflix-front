"use client";

import { play, seek } from "@/app/lib/vlcInterface";
import { ReactNode } from "react";

function playVideo(path: string, secondsPlayed: number) {
  return async () => {
    await play(path);
    if (secondsPlayed > 0) {
      await seek(secondsPlayed);
    }
  };
}

type Props = { path: string; secondsPlayed: number; children: ReactNode };

export default function Playable({
  path,
  secondsPlayed,
  children,
}: Props): JSX.Element {
  return (
    <div className="cursor-pointer" onClick={playVideo(path, secondsPlayed)}>
      {children}
    </div>
  );
}
