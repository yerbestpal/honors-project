import { Navbar, Nav, Container } from "react-bootstrap"

const NavBar = ({ room }) => {
  return (
    <Navbar bg="primary" variant="dark">
      <Container>
        <Navbar.Brand href="/"><span className="fw-bold">Room: </span>{room}</Navbar.Brand>
        <Nav className="me-auto">
        </Nav>
      </Container>
    </Navbar>
  )
}

export default NavBar