import { useState } from "react";
import TextArea from "./components/TextArea";
import { Button, Card } from "react-bootstrap";
import RenderFrame from "./components/RenderFrame";

export default function Editor() {

  const [renderMode, setRenderMode] = useState(false);
  const [markdown, setMarkdown] = useState('');

  const switchModes = () => {
    setRenderMode(!renderMode);
  }

  const updateMarkdown = (content: string) => {
    setMarkdown(content);
  }

  return (
    <Card>
      <Card.Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <b>test_1.md</b>
        <Button variant="dark" onClick={switchModes}>{renderMode ? " Edit " : "Render"}</Button>
      </Card.Header>
      <Card.Body className="p-0">
        {renderMode ? <RenderFrame markdown={markdown} /> : <TextArea updateMarkdown={updateMarkdown}/>}
      </Card.Body>
    </Card>
  );
}
