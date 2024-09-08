"use client";

import React from "react";
import { TreeItem } from "@/components/ui/treeview";
import { Tree } from "@/components/ui/tree-view-api";
import { PlusIcon } from "@/components/icons/icons";
import { useFileSystemContext } from "./context/file-system.context";
import { useModalContext } from "@/shared/modals/modal-manager.context";
import { ModalKey } from "@/shared/modals/types";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button";

interface SidebarProps {}
export default function Sidebar({}: SidebarProps) {
  const { fileTree } = useFileSystemContext();
  const { openModal } = useModalContext();

  return (
    <nav className="flex h-[100%] flex-col gap-2 border-r bg-background p-2 overflow-auto">
      {fileTree && fileTree.length > 0 ? (
        <>
          <Tree
            className="w-full h-100 bg-background rounded-md"
            indicator={true}
          >
            {fileTree.map((element, _) => (
              <TreeItem key={element.id} elements={[element]} />
            ))}
          </Tree>

          <Button
            onClick={() =>
              openModal(ModalKey.newEntry, {
                path: "/",
              })
            }
          >
            New File/Directory
          </Button>
        </>
      ) : (
        <div
          className="flex self-center h-[100%] w-[100%] items-center justify-center rounded-md border border-black border-dashed text-md"
          onClick={() =>
            openModal(ModalKey.newEntry, {
              path: "/",
            })
          }
        >
          <PlusIcon /> Add new file or directory
        </div>
      )}
    </nav>
  );
}
