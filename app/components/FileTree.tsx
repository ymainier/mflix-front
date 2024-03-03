"use client";
import { Fragment, useMemo, useState } from "react";
import { FileObject, FileTree } from "../lib/buildFileTree";
import { play, seek } from "../lib/vlcInterface";
import { useRouter } from "next/navigation";
import { fetchClient } from "../lib/fetchClient";
import { filenameParse } from "@ctrl/video-filename-parser";

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

const FileTree = ({
  fileTree,
  depth = 0,
}: FileTreeProps): JSX.Element => {
  const [opened, setOpened] = useState(new Set<string>());
  const router = useRouter();

  const toggleCompletedFor =
    (path: string, wasCompleted: boolean) => async () => {
      await fetchClient(
        "/api/path/update",
        { path, isCompleted: wasCompleted ? "false" : "true" },
        { method: "POST" }
      );
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
              <FileTree
                fileTree={directory}
                depth={depth + 1}
              />
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
            onClick={async () => {
              await play(file.fullpath);
              if (file.secondsPlayed > 0) {
                await seek(file.secondsPlayed);
              }
            }}
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
};

export default FileTree;
