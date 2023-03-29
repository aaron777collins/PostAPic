import { createTheme } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Navigationbar from "./Navbar/Navigationbar";

function App() {
  const urlExtension = getProcessExtension();

  // Home
  // Search
  // Create
  // Admin
  // Profile
  // Login
  // Register
  return (
    <div className="App">
      <BrowserRouter>
        <Navigationbar urlExtension={urlExtension} />
        <Routes>
          <Route path={urlExtension + "/"} element={<h1>Home</h1>} />
          <Route path={urlExtension + "/home"} element={<h1>Home</h1>} />
          <Route path={urlExtension + "/search"} element={<h1>Search</h1>} />
          <Route path={urlExtension + "/create"} element={<h1>Create</h1>} />
          <Route path={urlExtension + "/admin"} element={<h1>Admin</h1>} />
          <Route path={urlExtension + "/profile"} element={<h1>Profile</h1>} />
          <Route path={urlExtension + "/login"} element={<h1>Login</h1>} />
          <Route
            path={urlExtension + "/register"}
            element={<h1>Register</h1>}
          />
          <Route path="*" element={<h1>404</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
function getProcessExtension(): string {
  if (process.env.REACT_APP_DEV === "true") {
    return "";
  } else {
    return "/COMP-2707-W23/project/frontend/build";
  }
}
