"use client";
import { Fragment, useState } from "react";
import { FileTree } from "../lib/buildFileTree";
import { play } from "../lib/vlcInterface";

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

  // Render the file tree as a nested list with some styling using Tailwind CSS
  return (
    <Fragment>
      {fileTree.directories.map((directory) => {
        const key = directory.name;
        return (
          <Fragment key={key}>
            <button
              style={{ paddingLeft: `${depth}rem` }}
              className="w-full text-start p-2 indent-4 border-t text-red-700 hover:bg-red-100 cursor-pointer first:border-t-0"
              onClick={() => setOpened(toggle(key))}
              data-depth={depth}
            >
              {key}/
            </button>
            {opened.has(key) && (
              <FileTree fileTree={directory} depth={depth + 1} />
            )}
          </Fragment>
        );
      })}
      {fileTree.files.map((file) => (
        <button
          key={file.fullpath}
          style={{ paddingLeft: `${depth}rem` }}
          className="w-full p-2 indent-4 border-t text-start hover:bg-red-100 cursor-pointer first:border-t-0"
          onClick={() => play(file.fullpath)}
          data-depth={depth}
        >
          {file.name}
        </button>
      ))}
    </Fragment>
  );
}
