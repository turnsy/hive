"use client";

// Context should include:
// project ID
// functions to add, rename, and delete
// projects and refresh projects functions
// paths would be sent to the handleOp service, depending on what's clicked. (maybe this is a hook in the tree items/dir)
// working path for operations
// on init we should populate the filetree

import React, { useCallback, useEffect, useState } from "react";
import { TreeViewElement } from "@/components/ui/tree-view-api";
import { createContext, useContext } from "react";

interface FileSystemContextResult {
  projectId: string | null;
  newEntry: (path: string, isDir: boolean) => Promise<any>;
  renameEntry: (path: string, rename: string) => Promise<any>;
  deleteEntry: (path: string) => Promise<any>;
  fileTree: TreeViewElement[];
  fetchFileTree: () => Promise<void>;
}

const fileSystemContext = createContext<FileSystemContextResult | undefined>(
  undefined
);

interface FileSystemContextProviderProps {
  projectId: string;
  children: React.ReactNode;
}

export const FileSystemContextProvider = ({
  projectId,
  children,
}: FileSystemContextProviderProps) => {
  const [fileTree, setFileTree] = useState<TreeViewElement[]>([]);

  const fetchFileTree = useCallback(async () => {
    try {
      console.log("fetching filetree");
      const res = await fetch(`http://localhost:8081/projects/${projectId}`);
      const data = await res.json();
      setFileTree(data);
    } catch (e) {
      console.log(e);
    }
  }, [projectId]);

  const newEntry = useCallback(
    async (path: string, isDir: boolean) => {
      try {
        await fetch(`http://localhost:8081/projects/${projectId}`, {
          method: "POST",
          body: JSON.stringify({
            path,
            isDir,
          }),
        });
        await fetchFileTree();
      } catch (e) {
        console.log(e);
      }
    },
    [projectId]
  );

  const renameEntry = useCallback(
    async (path: string, rename: string) => {
      try {
        await fetch(`http://localhost:8081/projects/${projectId}`, {
          method: "PATCH",
          body: JSON.stringify({
            path,
            rename,
          }),
        });
        await fetchFileTree();
      } catch (e) {
        console.log(e);
      }
    },
    [projectId]
  );

  const deleteEntry = useCallback(
    async (path: string) => {
      try {
        const res = await fetch(`http://localhost:8081/projects/${projectId}`, {
          method: "PATCH",
          body: JSON.stringify({
            path,
          }),
        });
        const data = await res.json();
        console.log(data);
        await fetchFileTree();
        return data;
      } catch (e) {
        console.log(e);
      }
    },
    [projectId]
  );

  useEffect(() => {
    fetchFileTree();
  }, [fetchFileTree]);

  const value = {
    projectId,
    newEntry,
    renameEntry,
    deleteEntry,
    fileTree,
    fetchFileTree,
  };

  return (
    <fileSystemContext.Provider value={value}>
      {children}
    </fileSystemContext.Provider>
  );
};

export const useFileSystemContext = () => {
  const context = useContext(fileSystemContext);
  if (context === undefined)
    throw new Error(
      "useFileSystemContext must be used within a FileSystemContext provider"
    );
  return context;
};
