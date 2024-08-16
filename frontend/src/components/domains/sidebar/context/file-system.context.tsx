// Context should include:
// project ID
// functions to add, rename, and delete
// projects and refresh projects functions
// paths would be sent to the handleOp service, depending on what's clicked. (maybe this is a hook in the tree items/dir)
// working path for operations

import { TreeViewElement } from "@/components/ui/tree-view-api";
import { createContext, useContext } from "react";

interface FileSystemContextResult {
  projectId: string | null;
  addEntry: () => void;
  renameEntry: () => void;
  deleteEntry: () => void;
  fileTree: TreeViewElement[];
  fetchFileTree: () => TreeViewElement[];
  workingPath: string;
  setWorkingPath: (newWorkingPath: string) => void;
}

const initialFileSystemContextState: FileSystemContextResult = {
  projectId: null,
  addEntry: () => {},
  renameEntry: () => {},
  deleteEntry: () => {},
  fileTree: [],
  fetchFileTree: () => [],
  workingPath: "",
  setWorkingPath: () => {},
};

const fileSystemContext = createContext<FileSystemContextResult>(
  initialFileSystemContextState
);

export const useFileSystemContext = useContext(fileSystemContext);
