import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

export default function HeaderComponent() {
  return (

    <Navbar
      expand="lg"
      className="fixed top-0 left-0 w-full bg-[#1E272C] text-white z-50 py-6"
      variant="dark"
    >

      <Container>
        <Navbar.Brand as={Link} to="./homepage">
          New Sirini Hotel
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/home">
              Home
            </Nav.Link>

            <Nav.Link as={Link} to="./resturant">
              Resturant
            </Nav.Link>

            <Nav.Link as={Link} to="./LiquorShop">
              Liquor Shop
            </Nav.Link>

            <Nav.Link as={Link} to="./receptionhall">
              Reception Hall
            </Nav.Link>

            <Nav.Link as={Link} to="./rooms">
              Rooms
            </Nav.Link>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

  )
}
