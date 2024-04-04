"use client";

import { ReactNode } from "react";
import toggleViewAction from "@/app/tvshows/new/[showId]/[seasonId]/toggle-view-action";
import { useRouter } from "next/navigation";

type Props = {
  id: number;
  isComplete: boolean;
  className?: string;
  children: ReactNode;
};

export function ToggleViewable({
  id,
  isComplete,
  className,
  children,
}: Props): JSX.Element {
  const router = useRouter();
  return (
    <button
      className={className}
      onClick={async () => {
        await toggleViewAction(id, isComplete);
        router.refresh();
      }}
    >
      {children}
    </button>
  );
}
