import { useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useWebSocket from "react-use-websocket";
import { DeltaStatic } from "react-quill/node_modules/@types/quill";
import { handleSocketMessage } from "./services/socket.utils";
//import "./TextArea.scss";

interface TextAreaProps {
  updateMarkdown: (content: string) => void;
}
export default function TextArea({ updateMarkdown }: TextAreaProps) {
  // get reference to quill editor
  const editorRef = useRef<ReactQuill>(null);

  // set up web socket
  const socketUrl = "ws://localhost:8080/ws";
  const { sendMessage, lastMessage } = useWebSocket(socketUrl);

  // handleChange is used to actually fire off the websocket messages,
  // whenever a user makes a change themselves
  function handleChange(
    content: string,
    delta: DeltaStatic,
    source: any,
    _editor: any
  ) {
    if (source === "user") {
      sendMessage(JSON.stringify(delta));
    }
    updateMarkdown(String(editorRef.current?.editor?.getText()));
  }
  useEffect(() => {
    if (lastMessage !== null) {
      handleSocketMessage(lastMessage, editorRef);
    }
  }, [lastMessage]);

  return (
    <div className="editorContainer">
      <ReactQuill
        theme="snow"
        onChange={handleChange}
        ref={editorRef}
        className="border-0"
      />
    </div>
  );
}
