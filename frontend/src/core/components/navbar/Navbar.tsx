import {
  Button,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  Form,
  ListGroup,
  Navbar,
  NavDropdown,
  Row,
} from "react-bootstrap";
import { PiHexagonDuotone } from "react-icons/pi";
import { FaPlus, FaRegUser } from "react-icons/fa";
import { CiLink } from "react-icons/ci";

export default function NavBar() {
  return (
    <Navbar bg="dark" className="mb-3 justify-content-between">
      <Container fluid>
        <Navbar.Brand style={{ color: "white" }} className="align-centre">
          <PiHexagonDuotone
            color="white"
            size="25"
            style={{ marginRight: "5px" }}
          />
          Hive
        </Navbar.Brand>
        <NavDropdown
          drop="down-centered"
          title="project_1"
          id="basic-nav-dropdown"
          style={{ color: "white" }}
          menuVariant="dark"
        >
          <NavDropdown.Item>project_2</NavDropdown.Item>
          <NavDropdown.Item>project_3</NavDropdown.Item>
          <div className="d-grid gap-2">
            <Button className="m-2" variant="light" size="sm">
              <FaPlus
                color="black"
                size="10px"
                style={{ marginRight: "5px" }}
              />
              New Project
            </Button>
          </div>
        </NavDropdown>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Dropdown className="mx-3">
            <Dropdown.Toggle
              variant="light"
              id="dropdown-basic"
              className="align-items-center"
            >
              <FaRegUser /> 3
            </Dropdown.Toggle>
            <Dropdown.Menu className="mt-0">
              <ListGroup>
                <ListGroup.Item>User_1</ListGroup.Item>
                <ListGroup.Item>User_2</ListGroup.Item>
                <ListGroup.Item>User_3</ListGroup.Item>
              </ListGroup>
              <div className="d-grid gap-2">
                <Button className="m-2" variant="secondary" size="sm">
                  Invite
                  <CiLink
                color="white"
                size="20px"
                style={{ marginLeft: "3px" }}
                />
                </Button>
              </div>
            </Dropdown.Menu>
          </Dropdown>
          <Button variant="outline-secondary">Logout</Button>
        </div>
      </Container>
    </Navbar>
  );
}
