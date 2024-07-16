"use client";

import React, { useEffect, useState } from "react";
import { TreeItem } from "@/components/ui/treeview";
import { Tree, TreeViewElement } from "@/components/ui/tree-view-api";
import { PlusIcon } from "@/components/icons/icons";
import { newFile } from "./services/file-system-api.service";

export default async function Sidebar() {
  const [elements, setElements] = useState<TreeViewElement[]>([]);
  const [showTree, setShowTree] = useState<boolean>(false);
  const [loadingProjects, setLoadingProjects] = useState<boolean>(false);

  const printPath = async (op: string, path: string) => {
    // do action
    switch (op) {
      case "new":
        newFile(path, "");
        break;
    }
    fetchProjectDir();
  };
  const fetchProjectDir = async () => {
    setLoadingProjects(true);
    try {
      const res = await fetch("http://localhost:8081/projects/test_proj");
      const data = await res.json();
      setElements(data);
      setShowTree(true);
      setLoadingProjects(false);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    fetchProjectDir();
  }, []);

  return (
    <nav className="flex h-[100%] flex-col gap-2 border-r bg-background p-2">
      {showTree ? (
        <Tree className="w-full h-60 bg-background rounded-md" indicator={true}>
          {elements.map((element, _) => (
            <TreeItem
              key={element.id}
              elements={[element]}
              fileOp={printPath}
              path={""}
            />
          ))}
        </Tree>
      ) : loadingProjects ? (
        <>...</>
      ) : (
        <div className="flex self-center h-[100%] w-[100%] items-center justify-center rounded-md border border-black border-dashed text-md">
          <PlusIcon /> Add new file or directory
        </div>
      )}
    </nav>
  );
}
