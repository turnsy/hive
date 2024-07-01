import React, { useEffect, useState } from "react";
import TreeView, { flattenTree } from "react-accessible-treeview";
import "./Sidebar.scss";
import {
  getProjectDirectory,
  getPathFromId,
} from "./services/directory.service";
import { Row, Container, Button, Card } from "react-bootstrap";
import { FaRegFolder, FaRegFolderOpen } from "react-icons/fa";
import { GoPlus } from "react-icons/go";

export default function Sidebar() {
  const [dir, setDir] = useState({ name: "", children: [] });

  function handleSelect(node: any) {
    if (node.element.children.length == 0) {
      console.log(flattenTree(dir));
      const path = getPathFromId(node.element.id, flattenTree(dir));
      console.log(path);
    }
  }
  useEffect(() => {
    const project_uuid = "test_uuid";
    fetch(`http://localhost:8080/filetree/${project_uuid}`)
      .then((res) => res.json())
      .then((res) => {
        setDir({ ...dir, children: res.children });
      });
  }, []);
  return (
    <Container>
      <Row>
        <Button variant="dark">New Directory</Button>
      </Row>
      <Row>
        <Card bg="light" className="mt-3 p-0" style={{height: "590px"}}>
        <TreeView
          data={flattenTree(dir)}
          className="basic"
          aria-label="basic example tree"
          onNodeSelect={handleSelect}
          nodeRenderer={({
            element,
            getNodeProps,
            level,
            handleSelect,
            isBranch,
            isExpanded,
          }) => (
            <div
              {...getNodeProps()}
              style={{
                paddingLeft: 5 + (20 * (level - 1)),
                paddingRight: 5,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                height: "35px"
              }}
            >
              <div>
                {isBranch && <FolderIcon isOpen={isExpanded} />}
                {element.name}
              </div>
              {isBranch && <GoPlus color="grey" size="20px"/>}
            </div>
          )}
        />
        </Card>
      </Row>
    </Container>
  );
}

const FolderIcon = ({ isOpen }: any) =>
  isOpen ? (
    <FaRegFolderOpen color="grey" className="icon" style={{marginRight: "5px"}} />
  ) : (
    <FaRegFolder color="grey" className="icon" style={{marginRight: "5px"}} />
  );
