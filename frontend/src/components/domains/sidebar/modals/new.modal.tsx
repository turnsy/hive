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
import { newEntry } from "../services/file-system-api.service";

interface CreateProjectModalProps {
  showNewModal: boolean;
  toggleModal: (state: boolean) => void;
  path: string;
  projectId: string;
}

export default function NewModal({
  showNewModal,
  toggleModal,
  path,
  projectId,
}: CreateProjectModalProps) {
  const [entryName, setEntryName] = useState("");
  const [isFile, setIsFile] = useState(false);
  const handleNew = async () => {
    await newEntry(path + entryName, projectId, isFile);
    toggleModal(false);
  };
  return (
    <Dialog open={showNewModal} onOpenChange={toggleModal}>
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
          <div className="grid gap-2"></div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => toggleModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleNew}>Confirm</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
