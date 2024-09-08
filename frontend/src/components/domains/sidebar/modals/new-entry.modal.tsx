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
import { Checkbox } from "@/components/ui/checkbox";

interface NewEntryModalProps {
  path: string;
}

export default function NewEntryModal({ path }: NewEntryModalProps) {
  const [entryName, setEntryName] = useState("");
  const [entryType, setEntryType] = useState("file");

  const { newEntry } = useFileSystemContext();
  const { closeModal } = useModalContext();

  const handleNewEntry = async () => {
    await newEntry(path + "/" + entryName, entryType === "dir");
    closeModal();
  };
  return (
    <Dialog defaultOpen={true}>
      <DialogTrigger asChild />
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>New File or Directory</DialogTitle>
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
            {/* TODO: a shadcn dropdown should live here. */}
            <select
              className="border rounded-md h-10 p-2 focus:border-black"
              value={entryType}
              onChange={(e) => setEntryType(e.target.value)}
            >
              <option value="file">File</option>
              <option value="dir">Directory</option>
            </select>
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
