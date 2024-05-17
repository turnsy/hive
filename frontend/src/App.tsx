import React, { useEffect, useState } from 'react';
import './App.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import useWebSocket, {ReadyState} from 'react-use-websocket';
import Markdown from 'react-markdown';

function App() {
  const [content, setContent] = useState("");
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
    setContent(content);
  }

  useEffect(() => {
    if (lastMessage !== null) {
      refreshContent();
    }
  }, [lastMessage])

  async function refreshContent() {
    // get file data from server
    
    const res = await fetch('http://localhost:8080/static/test.txt');
    const content = await res.text();
    console.log(content);
 
  }

  return (
    <div className="App">
      <h1>Hive</h1>
      <div className="editorContainer">
        <ReactQuill theme="snow" value={content} onChange={handleChange} />
      </div>
      <h6>Status: {connectionStatus} </h6>
      <div>
        <Markdown children={content} />
      </div>
    </div>
  );
}

export default App;
