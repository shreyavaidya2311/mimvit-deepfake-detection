import { React } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import Home from "./pages/Home";
import Play from "./pages/Play";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Creator from "./pages/Creator";

function App() {
  function PrivateRoute({ element: Component }) {
    let isValidToken = false;
    const apiAccessToken = localStorage.getItem("api_access_token");
    try {
      isValidToken =
        apiAccessToken &&
        JSON.parse(atob(apiAccessToken.split(".")[1])).exp * 1000 > Date.now();
    } catch {
      isValidToken = false;
    }

    if (!isValidToken) localStorage.removeItem("api_access_token");

    return isValidToken ? <Component /> : <Navigate to="/" replace />;
  }

  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route element={<Login />} path="/" />
          <Route element={<Signup />} path="/signup" />
          <Route element={<PrivateRoute element={Home} />} path="/home" />
          <Route element={<PrivateRoute element={Play} />} path="/play" />
          <Route element={<PrivateRoute element={Creator} />} path="/create" />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
