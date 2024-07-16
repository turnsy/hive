import Editor from "@/components/domains/editor/editor";
import Header from "@/components/domains/header/header";
import Sidebar from "@/components/domains/sidebar/sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Suspense } from "react";
import Loading from "./loading";

export default function Page() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header />
      <ResizablePanelGroup
        className="flex flex-1 overflow-hidden"
        direction="horizontal"
      >
        <ResizablePanel defaultSize={25}>
          <Sidebar />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={75}>
          <Editor />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
