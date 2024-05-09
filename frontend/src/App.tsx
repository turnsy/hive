import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import useWebSocket, {ReadyState} from 'react-use-websocket';

function App() {
  const [value, setValue] = useState("");
  const socketUrl = "ws://localhost:8080/ws";
  const {sendMessage, lastMessage, readyState} = useWebSocket(socketUrl);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Connected',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  function handleChange(content: any, delta: any, source:any, editor:any) {
    sendMessage(JSON.stringify(delta));
    setValue(content);
  }

  return (
    <div className="App">
      <h1>Hive</h1>
      <div className="editorContainer">
        <ReactQuill theme="snow" value={value} onChange={handleChange} />
      </div>
      <h6>Status: {connectionStatus} </h6>
    </div>
  );
}

export default App;
