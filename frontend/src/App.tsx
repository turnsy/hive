import React from "react";
import "./App.css";
import "react-quill/dist/quill.snow.css";
import Editor from "./core/components/editor/Editor";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import Sidebar from "./core/components/sidebar/Sidebar";
import NavBar from "./core/components/navbar/Navbar";

function App(): React.ReactElement {
  return (
    <div className="App">
      <Container fluid>
        <Row>
          <NavBar />
        </Row>
        <Row>
          <Col sm={4} variant={"dark"}>
            <Sidebar />
          </Col>
          <Col sm={8}>
            <Editor />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
