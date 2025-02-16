import logo from "./logo.svg";
import "./App.css";
import { Route, Router, Routes } from "react-router-dom";
import AdminLogin from "./components/AdminLogin";
import AdminDashbord from "./components/AdminDashbord";
import { useState, useEffect} from "react";
import Home from "./components/Home";
import Navbar from "./Navbar";
import Cart from "./components/Cart";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
      fetchCartCount();
  }, []);

  const fetchCartCount = async () => {
      const res = await fetch("http://localhost:5000/cart");
      const data = await res.json();
      setCartCount(data.length);
  };

  return (
    <div className="App">
      <Navbar cartCount={cartCount} />
      <Routes>
        <Route path="/" element={<Home  fetchCartCount={fetchCartCount} />} />
        <Route path="/cart" element={<Cart fetchCartCount={fetchCartCount} />}  />
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
