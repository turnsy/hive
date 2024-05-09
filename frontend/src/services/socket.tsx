import React, { useState, useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

interface SocketTesterProps {
  text: string;
}

export default function SocketTester({ text }: SocketTesterProps) {
  //Public API that will echo messages sent to it back to the client
  const socketUrl = "ws://localhost:8080/ws";

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    sendMessage(text);
  }, [text])

  const handleClickSendMessage = useCallback(() => {
    sendMessage(text);
  }, []);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <div style={{display: "flex", flexDirection: "column"}}>
      <span>The WebSocket is currently {connectionStatus}</span>
      {lastMessage ? <><span>Last message:</span> <span>{lastMessage.data}</span> </>: null}
    </div>
  );
}
