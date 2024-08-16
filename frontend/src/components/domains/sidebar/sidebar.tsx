"use client";

import React, { useEffect, useState } from "react";
import { TreeItem } from "@/components/ui/treeview";
import { Tree, TreeViewElement } from "@/components/ui/tree-view-api";
import { PlusIcon } from "@/components/icons/icons";
import { newEntry } from "./services/file-system-api.service";
import NewModal from "./modals/new.modal";

interface SidebarProps {
  projectId: string;
}
export default async function Sidebar({ projectId }: SidebarProps) {
  const [elements, setElements] = useState<TreeViewElement[]>([]);
  const [showTree, setShowTree] = useState<boolean>(false);
  const [loadingProjects, setLoadingProjects] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [workingPath, setWorkingPath] = useState(``);

  const handleOp = async (op: string, path: string, isFile: boolean) => {
    // do action
    switch (op) {
      case "new":
        await newEntry(path, projectId, isFile);
        break;
    }
    //fetchProjectDir();
  };

  const fetchProjectDir = async () => {
    setLoadingProjects(true);
    try {
      const res = await fetch(`http://localhost:8081/projects/${projectId}`);
      const data = await res.json();
      setElements(data);
      console.log(elements);
      if (data.length > 0) {
        setShowTree(true);
      } else {
        setShowTree(false);
      }
    } catch (e) {
      console.log(e);
    }
    setLoadingProjects(false);
  };
  useEffect(() => {
    fetchProjectDir();
  }, []);

  return (
    <nav className="flex h-[100%] flex-col gap-2 border-r bg-background p-2">
      {showTree ? (
        <Tree className="w-full h-60 bg-background rounded-md" indicator={true}>
          {elements.map((element, _) => (
            <TreeItem key={element.id} elements={[element]} fileOp={handleOp} />
          ))}
        </Tree>
      ) : loadingProjects ? (
        <>...</>
      ) : (
        <div
          className="flex self-center h-[100%] w-[100%] items-center justify-center rounded-md border border-black border-dashed text-md"
          onClick={() => setShowModal(true)}
        >
          <PlusIcon /> Add new file or directory
        </div>
      )}
      <NewModal
        showNewModal={showModal}
        toggleModal={setShowModal}
        path={workingPath}
        projectId={projectId}
      />
    </nav>
  );
}
