import Editor from "@/components/domains/editor/editor";
import Header from "@/components/domains/header/header";
import { FileSystemContextProvider } from "@/components/domains/sidebar/context/file-system.context";
import Sidebar from "@/components/domains/sidebar/sidebar";
import { ModalContextProvider } from "@/shared/modals/modal-manager.context";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header />
      <ResizablePanelGroup
        className="flex flex-1 overflow-hidden"
        direction="horizontal"
      >
        <ResizablePanel defaultSize={25}>
          <FileSystemContextProvider projectId={params.id}>
            <ModalContextProvider>
              <Sidebar />
            </ModalContextProvider>
          </FileSystemContextProvider>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={75}>
          <Editor />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
