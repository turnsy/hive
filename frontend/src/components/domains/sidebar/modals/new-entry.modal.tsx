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

interface NewEntryModalProps {
  path: string;
}

export default function NewEntryModal({ path }: NewEntryModalProps) {
  const [entryName, setEntryName] = useState("");
  const [isDir, setIsDir] = useState(false);

  const { newEntry } = useFileSystemContext();
  const { closeModal } = useModalContext();

  const handleNewEntry = async () => {
    await newEntry(path + "/" + entryName, isDir);
    closeModal();
  };
  return (
    <Dialog defaultOpen={true}>
      <DialogTrigger asChild />
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>New File or Folder</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="entryName">Name</Label>
            <Input
              id="entryName"
              placeholder=""
              value={entryName}
              onChange={(e) => setEntryName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            {/* TODO: a select dropdown should live here. */}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button onClick={handleNewEntry}>Confirm</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
