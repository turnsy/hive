"use client";

import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFileSystemContext } from "../context/file-system.context";
import { useModalContext } from "@/shared/modals/modal-manager.context";

interface RenameEntryModalProps {
  path: string;
  isDir: boolean;
}

export default function RenameEntryModal({
  path,
  isDir,
}: RenameEntryModalProps) {
  const [entryRename, setEntryRename] = useState("");

  const { renameEntry } = useFileSystemContext();
  const { closeModal } = useModalContext();

  return (
    <Dialog defaultOpen={true}>
      <DialogTrigger asChild />
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Rename {isDir ? "folder" : "file"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="entryRename">Name</Label>
            <Input
              id="entryRename"
              placeholder=""
              value={entryRename}
              onChange={(e) => setEntryRename(e.target.value)}
            />
          </div>
          <div className="grid gap-2"></div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button onClick={() => renameEntry(path, entryRename)}>
              Confirm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
