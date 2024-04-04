"use client";
import { useEffect, useReducer, useRef } from "react";
import type { ReactNode } from "react";
import {
  status as queryStatus,
  togglePause,
  seek,
  stop,
  focus,
  subtitle,
} from "../lib/vlcInterface";
import { fetchClient } from "../lib/fetchClient";
import { useRouter } from "next/navigation";

type Status = "stopped" | "playing" | "paused";

type ButtonProps = {
  onClick?: () => void;
  children: ReactNode;
  className?: string;
};

function pad(value: number): string {
  return `${value}`.padStart(2, "0");
}

function duration(_seconds: number, type: "minutes" | "hours"): string {
  const seconds = Math.floor(_seconds);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (type === "minutes") {
    return `${pad(minutes)}:${pad(remainingSeconds)}`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}:${pad(remainingMinutes)}:${pad(remainingSeconds)}`;
  }
}

function Button({ onClick, children, className = "" }: ButtonProps) {
  return (
    <button
      className={`text-white bg-red-700 rounded-full p-3 text-center inline-flex items-center ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

type Action =
  | {
      type: "UPDATE_STATUS";
      status: Status;
      time: number;
      length: number;
      fullpath: string;
      subtitles: Array<{ value: string; name: string }>;
    }
  | { type: "UPDATE_TIME"; time: number };

type State = {
  status: Status;
  time: number;
  length: number;
  fullpath: string;
  title: string;
  subtitles: Array<{ value: string; name: string }>;
};

const INTIAL_STATE: State = {
  status: "stopped",
  time: 0,
  length: 0,
  fullpath: "",
  title: "",
  subtitles: [],
};

const SKIP = "_";

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "UPDATE_STATUS": {
      if (state.status !== action.status && action.status === "stopped") {
        return INTIAL_STATE;
      } else {
        return {
          ...state,
          status: action.status,
          time: action.time,
          length: action.length,
          fullpath: action.fullpath,
          title: action.fullpath,
          subtitles: action.subtitles,
        };
      }
    }
    case "UPDATE_TIME": {
      if (state.status !== "stopped") {
        return { ...state, time: action.time };
      }
      return state;
    }
  }
  throw new Error("Unknown action");
}

function usePrevious<T>(state: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = state;
  });

  return ref.current;
}

export default function MiniPlayer() {
  const selectRef = useRef<HTMLSelectElement>(null);
  const router = useRouter();
  const [{ status, time, length, title, subtitles }, dispatch] = useReducer(
    reducer,
    INTIAL_STATE
  );
  const previousTitle = usePrevious(title);

  useEffect(() => {
    if (previousTitle && previousTitle !== title) {
      router.refresh();
      if (typeof selectRef.current?.value === "string") {
        selectRef.current.value = SKIP;
      }
    }
  }, [previousTitle, router, title]);

  useEffect(() => {
    let mounted = true;
    const id = setInterval(async () => {
      const result = await queryStatus();
      if (mounted) {
        dispatch({
          type: "UPDATE_STATUS",
          status: result.data.status,
          time: result.data.time,
          length: result.data.length,
          fullpath: result.data.fullpath,
          subtitles: result.data.subtitles,
        });
      }
      if (result.data.status === "playing") {
        const qs: {
          path: string;
          secondsPlayed: string;
          isCompleted?: "true";
        } = {
          path: result.data.fullpath,
          secondsPlayed: result.data.time,
        };
        if (result.data.time / result.data.length > 0.9) {
          qs.isCompleted = "true";
        }
        fetchClient("/api/path/update", qs, { method: "POST" });
      }
    }, 1000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  if (status === "stopped") return null;
  const durationType = length < 3600 ? "minutes" : "hours";

  const titleElements = title.split('/');

  return (
    <div className="fixed bottom-0 w-full bg-white shadow-[0_-2px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-2px_rgba(0,0,0,0.1)]">
      <div className="flex flex-col gap-1 max-w-3xl mx-auto py-2 px-6 sm:px-12">
        <p className="text-sm text-center truncate">{titleElements[titleElements.length - 1]}</p>
        <input
          className="w-full"
          type="range"
          min="0"
          max={length}
          value={time}
          step="1"
          onChange={(e) => {
            const { value } = e.target;
            dispatch({ type: "UPDATE_TIME", time: parseInt(value, 10) });
            seek(parseInt(value));
          }}
        />
        <div className="flex">
          <span className="basis-1/5 text-xs text-start">
            {duration(time, durationType)}
          </span>
          <div className="text-center flex-grow basis-3/5 flex gap-2 justify-center">
            <Button onClick={togglePause}>
              {status === "playing" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                  aria-label="pause"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                  aria-label="play"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </Button>
            <Button onClick={stop}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
                aria-label="stop"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
            <Button onClick={focus}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z"
                />
              </svg>
              <span className="sr-only">Focus</span>
            </Button>
            {subtitles.length >= 1 && (
              <div className="relative">
                <Button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                    />
                  </svg>

                  <span className="sr-only">Focus</span>
                </Button>
                <select
                  ref={selectRef}
                  onChange={async (e) => {
                    const val = e.target.value;
                    if (val !== SKIP) {
                      await subtitle(val);
                    }
                  }}
                  // className="border border-red-700 rounded w-16 h-[30px] p-1"
                  className="absolute opacity-0 w-full h-full inset-0"
                >
                  <option value={SKIP}>Subtitle?</option>
                  <option value="-1">none</option>
                  {subtitles.map(({ name, value }) => (
                    <option key={value} value={value}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <span className="basis-1/5 text-xs text-end">
            {duration(length, durationType)}
          </span>
        </div>
      </div>
    </div>
  );
}
