import { filenameParse } from "@ctrl/video-filename-parser";

export type FileObject = {
  name: string;
  fullpath: string;
  isCompleted: boolean;
  secondsPlayed: number;
  episode?: number;
};
type DirectoryObject = {
  name: string;
  files: Array<FileObject>;
  directories: Array<DirectoryObject>;
  fullpath: string;
  isCompleted: boolean;
};
export type FileTree = {
  files: Array<FileObject>;
  directories: Array<DirectoryObject>;
};

const tvShowSorter = (a: FileObject, b: FileObject) => {
  return a.episode! - b.episode!;
};

function orderFilesByEpisode(files: Array<FileObject>): Array<FileObject> {
  return files.sort(tvShowSorter);
}

function orderDirectoryByEpisode(dir: DirectoryObject): DirectoryObject {
  return {
    ...dir,
    files: orderFilesByEpisode(dir.files),
    directories: dir.directories.map(orderDirectoryByEpisode),
  };
}

function orderByEpisode(fileTree: FileTree): FileTree {
  return {
    directories: fileTree.directories.map(orderDirectoryByEpisode),
    files: fileTree.files.sort(tvShowSorter),
  };
}

let pathToEpisode = new Map<string, number | undefined>()

function getEpisode(pathPart: string, tvShow?: boolean) {
  if (!tvShow) return undefined;
  if (pathToEpisode.has(pathPart)) return pathToEpisode.get(pathPart);
  // @ts-expect-error filenameParse typing issue
  const episode: number | undefined = filenameParse(pathPart, true).episodeNumbers[0];
  pathToEpisode.set(pathPart, episode);
}

export function buildFileTree(
  files: Array<{ path: string; isCompleted: boolean; secondsPlayed: number }>,
  prefixToIgnore: string,
  tvShow?: boolean
): FileTree {
  // Create an object to hold the file tree
  const fileTree: FileTree = { files: [], directories: [] };

  // Loop through each file path
  for (let i = 0; i < files.length; i++) {
    const filePath = files[i].path;

    // Split the file path into an array of directory and file names
    const filenameToConsider = prefixToIgnore
      ? filePath.replace(new RegExp(`^${prefixToIgnore}`), "")
      : filePath;
    const pathParts = filenameToConsider.split("/");

    // Start at the root of the file tree
    let currentNode: FileTree = fileTree;

    // Loop through each part of the file path
    for (let j = 0; j < pathParts.length; j++) {
      const pathPart = pathParts[j];

      // If the path part isn't a file name (i.e., it's a directory name)
      if (j < pathParts.length - 1) {
        let directory = currentNode.directories.find(
          (d) => d.name === pathPart
        );
        // If the directory doesn't already exist in the file tree, create it
        if (!directory) {
          const fullpath = `${prefixToIgnore}${pathParts
            .slice(0, j + 1)
            .join("/")}`;
          const isCompleted = files
            .filter((f) => f.path.startsWith(fullpath))
            .every((f) => f.isCompleted);
          directory = {
            name: pathPart,
            files: [],
            directories: [],
            fullpath,
            isCompleted,
          };
          currentNode.directories.push(directory);
        }

        // Move down to the next level in the file tree
        currentNode = directory;
      }
      // Otherwise, the path part is a file name
      else {
        // Add the file name to the current directory's list of files
        currentNode.files.push({
          name: pathPart,
          fullpath: filePath,
          isCompleted: files[i].isCompleted,
          secondsPlayed: files[i].secondsPlayed,
          episode: getEpisode(pathPart, tvShow),
        });
      }
    }
  }

  return tvShow ? orderByEpisode(fileTree) : fileTree;
}
