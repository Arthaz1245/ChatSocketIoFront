import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import NavBar from "./components/NavBar";
import { Container } from "react-bootstrap";
function App() {
  const auth = useSelector((state) => state.auth);
  const name = auth.name;
  const isAuth = auth._id;
  return (
    <>
      <NavBar name={name} />
      <Container>
        <Routes>
          <Route path="/" element={isAuth ? <Chat /> : <Login />} />
          <Route path="/register" element={isAuth ? <Chat /> : <Register />} />
          <Route path="/login" element={isAuth ? <Chat /> : <Login />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
