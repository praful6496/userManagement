import logo from "./logo.svg";
import "./App.css";
import { Route, Router, Routes } from "react-router-dom";
import AdminLogin from "./components/AdminLogin";
import AdminDashbord from "./components/AdminDashbord";
import { useState } from "react";
import Home from "./components/Home";
import Navbar from "./Navbar";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={<AdminLogin setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/admin"
          element={<AdminDashbord isAuthenticated={isAuthenticated} />}
        />
      </Routes>
    </div>
  );
}

export default App;
