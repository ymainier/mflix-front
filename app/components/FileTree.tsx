"use client";
import { useState } from "react";
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
    <ul>
      {fileTree.directories.map((directory) => {
        const key = directory.name;
        return (
          <li key={key}>
            <p
              style={{ paddingLeft: `${depth}rem` }}
              className="text-red-700 hover:bg-red-100 p-1 cursor-pointer"
              onClick={() => setOpened(toggle(key))}
            >
              {key}/
            </p>
            {opened.has(key) && (
              <FileTree fileTree={directory} depth={depth + 1} />
            )}
          </li>
        );
      })}
      {fileTree.files.map((file) => (
        <li
          key={file.fullpath}
          style={{ paddingLeft: `${depth}rem` }}
          className={`cursor-pointer hover:bg-red-100`}
          onClick={() => play(file.fullpath)}
        >
          <p className="p-1">{file.name}</p>
        </li>
      ))}
    </ul>
  );
}
