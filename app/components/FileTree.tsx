"use client";
import { Fragment, useState } from "react";
import { FileTree } from "../lib/buildFileTree";
import { play } from "../lib/vlcInterface";
import { useRouter } from "next/navigation";

interface FileTreeProps {
  fileTree: FileTree;
  depth?: number;
}

const toggle =
  <T,>(key: T) =>
  (oldSet: Set<T>) => {
    const newSet = new Set(oldSet);
    if (newSet.has(key)) {
      newSet.delete(key);
    } else {
      newSet.add(key);
    }
    return newSet;
  };

export default function FileTree({
  fileTree,
  depth = 0,
}: FileTreeProps): JSX.Element {
  const [opened, setOpened] = useState(new Set<string>());
  const router = useRouter();

  const toggleCompletedFor =
    (path: string, wasCompleted: boolean) => async () => {
      if (typeof window === "undefined") {
        return;
      }
      const { origin } = window.location;
      const url = new URL("/api/path/update", origin);
      url.searchParams.set("path", path);
      url.searchParams.set("isCompleted", wasCompleted ? "false" : "true");
      await fetch(url, { method: "POST" });
      router.refresh();
    };

  // Render the file tree as a nested list with some styling using Tailwind CSS
  return (
    <Fragment>
      {fileTree.directories.map((directory) => {
        const key = directory.name;
        return (
          <Fragment key={key}>
            <p
              style={{ paddingLeft: `${depth}rem` }}
              className="flex p-2 indent-4 border-t text-red-700 hover:bg-red-100 cursor-pointer first:border-t-0"
              data-depth={depth}
            >
              <button
                className={`flex-auto truncate w-full text-start${
                  directory.isCompleted ? " line-through" : ""
                }`}
                onClick={() => setOpened(toggle(key))}
              >
                {key}/
              </button>
              <button
                className="flex-none px-2"
                onClick={toggleCompletedFor(
                  directory.fullpath,
                  directory.isCompleted
                )}
              >
                {directory.isCompleted ? "🙈" : "👀"}
              </button>
            </p>
            {opened.has(key) && (
              <FileTree fileTree={directory} depth={depth + 1} />
            )}
          </Fragment>
        );
      })}
      {fileTree.files.map((file) => (
        <p
          key={file.fullpath}
          style={{ paddingLeft: `${depth}rem` }}
          className="flex p-2 indent-4 border-t hover:bg-red-100 cursor-pointer first:border-t-0 truncate"
          data-depth={depth}
        >
          <button
            className={`flex-auto truncate w-full text-start${
              file.isCompleted ? " line-through" : ""
            }`}
            onClick={() => play(file.fullpath)}
          >
            {file.name}
          </button>
          <button
            className="flex-none px-2"
            onClick={toggleCompletedFor(file.fullpath, file.isCompleted)}
          >
            {file.isCompleted ? "🙈" : "👀"}
          </button>
        </p>
      ))}
    </Fragment>
  );
}
