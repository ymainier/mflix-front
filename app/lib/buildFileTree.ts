type FileObject = { name: string; fullpath: string };
type DirectoryObject = {
  name: string;
  files: Array<FileObject>;
  directories: Array<DirectoryObject>;
};
export type FileTree = {
  files: Array<FileObject>;
  directories: Array<DirectoryObject>;
};

export function buildFileTree(filePaths: string[], prefixToIgnore: string): FileTree {
  // Create an object to hold the file tree
  const fileTree: FileTree = { files: [], directories: [] };

  // Loop through each file path
  for (let i = 0; i < filePaths.length; i++) {
    const filePath = filePaths[i];

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
          directory = { name: pathPart, files: [], directories: [] };
          currentNode.directories.push(directory);
        }

        // Move down to the next level in the file tree
        currentNode = directory;
      }
      // Otherwise, the path part is a file name
      else {
        // Add the file name to the current directory's list of files
        currentNode.files.push({ name: pathPart, fullpath: filePath });
      }
    }
  }

  return fileTree;
}
