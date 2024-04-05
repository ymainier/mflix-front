"use client";

import { ReactNode } from "react";
import {
  toggleShowViewAction,
  toggleSeasonViewAction,
  toggleEpisodeViewAction,
} from "@/app/components/toggle-view-action";
import { useRouter } from "next/navigation";

type Props = {
  id: number;
  kind: "show" | "season" | "episode";
  isCompleted: boolean;
  className?: string;
};

export function ToggleViewable({
  id,
  kind,
  isCompleted,
  className,
}: Props): JSX.Element {
  const router = useRouter();
  return (
    <button
      className={className}
      onClick={async (e) => {
        e.preventDefault();
        if (kind === "show") {
          await toggleShowViewAction(id, isCompleted);
        } else if (kind === "season") {
          await toggleSeasonViewAction(id, isCompleted);
        } else {
          await toggleEpisodeViewAction(id, isCompleted);
        }
        router.refresh();
      }}
    >
      {isCompleted ? "🙈" : "👀"}
    </button>
  );
}
