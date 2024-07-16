"use client";

import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { LogOutIcon, HexagonIcon } from "@/components/icons/icons";
import { useRouter } from "next/navigation";
import ProjectsDropdown from "./projects-dropdown/projects-dropdown";

export default function Header() {
  const router = useRouter();
  const logout = () => {
    router.replace("/");
  };
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 sm:px-6">
      <Link href="#" className="flex items-center gap-2" prefetch={false}>
        <HexagonIcon className="h-6 w-6" />
        <span className="text-lg font-semibold">Hive</span>
      </Link>
      <ProjectsDropdown />
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={logout}
      >
        <LogOutIcon className="h-5 w-5" />
        <span className="sr-only">Logout</span>
      </Button>
    </header>
  );
}
