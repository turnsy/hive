"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TextArea from "./textarea/textarea";
import RenderArea from "./renderarea/renderarea";
import { NodeHtmlMarkdown } from "node-html-markdown";

export default function Editor() {
  const [view, setView] = useState("edit");
  const [markdown, setMarkdown] = useState("");

  const updateMarkdown = async (content: string) => {
    setMarkdown(content);
  };

  return (
    <main className="flex-1 p-4 sm:p-6">
      <Card className="h-full">
        <CardHeader className="flex justify-between border-b">
          <h2 className="text-2xl font-bold mt-1">file.md</h2>

          <div className="flex items-center gap-3">
            <Button
              variant={view === "edit" ? "secondary" : "outline"}
              onClick={() => setView("edit")}
            >
              Edit
            </Button>
            <Button
              variant={view === "view" ? "secondary" : "outline"}
              onClick={() => setView("view")}
            >
              View
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 p-0">
          {view === "edit" && (
            <div className="grid">
              <TextArea updateMarkdown={updateMarkdown} />
            </div>
          )}
          {view === "view" && (
            <div className="grid gap-4 p-3">
              <RenderArea markdown={markdown} />
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
