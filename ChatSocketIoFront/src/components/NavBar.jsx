import React from "react";
import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/authSlice";
import { Link } from "react-router-dom";
const NavBar = ({ name }) => {
  const auth = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  return (
    <Navbar bg="dark" className="mb-4" style={{ height: "3.75rem" }}>
      <Container>
        <h2>
          <Link to="/" className="link-light text-decoration-none">
            Chatsapp
          </Link>
        </h2>
        {auth._id && <span className="text-warning">Logged in as {name}</span>}
        {!auth._id ? (
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
        ) : (
          <>
            <Nav>
              <Stack direction="horizontal" gap={3}>
                <Link
                  to="/login"
                  className="link-light text-decoration-none"
                  onClick={() => {
                    dispatch(logoutUser(null));
                  }}
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
