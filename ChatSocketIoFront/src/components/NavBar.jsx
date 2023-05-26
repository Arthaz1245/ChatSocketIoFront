import React, { useContext } from "react";
import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Notification from "./chat/Notification";
const NavBar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  return (
    <Navbar
      className="navbar navbar-light "
      style={{ height: "3.75rem", backgroundColor: "#3cee10" }}
    >
      <Container>
        <h2>
          <Link to="/" className="link-light text-decoration-none">
            Chatsapp
          </Link>
        </h2>
        {user && (
          <span className="text-warning text-white font-bold">
            Logged in as {user?.name}
          </span>
        )}
        {!user && (
          <>
            <Nav>
              <Stack direction="horizontal" gap={3}>
                <Link to="/login" className="link-light text-decoration-none">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="link-light text-decoration-none"
                >
                  Register
                </Link>
              </Stack>
            </Nav>
          </>
        )}
        {user && (
          <>
            <Nav>
              <Stack direction="horizontal" gap={3}>
                <Notification />
                <Link
                  to="/login"
                  className="link-light text-decoration-none"
                  onClick={() => logoutUser()}
                >
                  Logout
                </Link>
              </Stack>
            </Nav>
          </>
        )}
      </Container>
    </Navbar>
  );
};

export default NavBar;
