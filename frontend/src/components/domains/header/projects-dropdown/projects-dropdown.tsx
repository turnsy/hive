"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  FolderIcon,
  PlusIcon,
  ChevronDownIcon,
  FileIcon,
} from "@/components/icons/icons";
import PocketBase from "pocketbase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreateProjectModal from "./create-project-modal/create-project-modal";

export default function ProjectsDropdown() {
  const db = new PocketBase("http://127.0.0.1:8090");
  const [projects, setProjects] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const userId = db.authStore.model?.id;

  const router = useRouter();
  const getProjects = async () => {
    const res = await db.collection("projects").getList(1, 50, {
      sort: "-created",
      filter: `user.id="${userId}"`,
    });
    return res.items as any[];
  };

  const handleCreateProject = async (projectName: string) => {
    // send a request to filesystem service to create folder on server

    // create db entry
    const res = await db.collection("projects").create({
      name: projectName,
      user: userId,
    });

    // redirect to new project
    router.replace(`${res.id}`);
  };

  const goToProject = (id: string) => {
    router.replace(`/projects/${id}`);
  };

  useEffect(() => {
    getProjects().then((res) => setProjects(res));
  }, []);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            <FolderIcon className="h-5 w-5" />
            <span>Projects</span>
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-[300px]">
          <DropdownMenuLabel>Your Projects</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {projects?.map((project) => {
            return (
              <DropdownMenuItem onClick={() => goToProject(project.id)}>
                <FileIcon className="h-4 w-4 mr-2" />
                <div className="flex-1">
                  <div className="font-medium">{project.name}</div>
                </div>
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowCreateModal(true)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Create New Project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateProjectModal
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        onCreate={handleCreateProject}
      />
    </>
  );
}
