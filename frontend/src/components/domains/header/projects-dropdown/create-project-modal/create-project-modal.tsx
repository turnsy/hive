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
import PocketBase from "pocketbase";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface CreateProjectModalProps {
  showCreateModal: boolean;
  setShowCreateModal: (state: boolean) => void;
  onCreate: (projectName: string) => void;
}

export default function CreateProjectModal({
  showCreateModal,
  setShowCreateModal,
  onCreate,
}: CreateProjectModalProps) {
  const [projectName, setProjectName] = useState("");

  return (
    <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
      <DialogTrigger asChild />
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Enter a name for your new project.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => onCreate(projectName)}>Create</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
