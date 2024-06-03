import React, { useEffect, useRef } from 'react';
import './App.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import useWebSocket, {ReadyState} from 'react-use-websocket';
import Markdown from 'react-markdown';
import { DeltaStatic } from '../node_modules/react-quill/node_modules/@types/quill/index';
import { handleSocketMessage } from './services/socket.utils';

function App() {
  // get reference to quill editor
  const editorRef = useRef<ReactQuill>(null);

  // set up web socket
  const socketUrl = "ws://localhost:8080/ws";
  const {sendMessage, lastMessage, readyState} = useWebSocket(socketUrl);

  // used to display connection status
  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Connected',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  // handleChange is used to actually fire off the websocket messages,
  // whenever a user makes a change themselves
  function handleChange(_value: string, delta: DeltaStatic, source: any, _editor: any) {
    if (source === "user") {
      sendMessage(JSON.stringify(delta));
    }
  }

  useEffect(() => {
    if (lastMessage !== null) {
      handleSocketMessage(lastMessage, editorRef);
    }
  }, [lastMessage])


  return (
    <div className="App">
      <h1>Hive</h1>
      <div className="editorContainer">
        <ReactQuill theme="snow" onChange={handleChange} ref={editorRef} />
      </div>
      <h6>Status: {connectionStatus} </h6>
    </div>
  );
}

export default App;
