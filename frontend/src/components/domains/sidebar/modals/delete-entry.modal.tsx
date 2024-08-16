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

interface DeleteEntryModalProps {
  path: string;
}

export default function DeleteEntryModal({ path }: DeleteEntryModalProps) {
  const { deleteEntry } = useFileSystemContext();
  const { closeModal } = useModalContext();

  const handleDeleteEntry = async () => {
    await deleteEntry(path);
    closeModal();
  };
  return (
    <Dialog defaultOpen={true}>
      <DialogTrigger asChild />
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete?</DialogTitle>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button onClick={handleDeleteEntry}>Confirm</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
