import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import UserDetail from "./pages/UserDetails";
import AddLoan from "./pages/AddLoan";
import Navbar from "./components/Navbar";

function App() {
  const [auth, setAuth] = useState(!!localStorage.getItem("token"));

  if (!auth) return <Login setAuth={setAuth} />;

  return (
    <BrowserRouter>
      <Navbar setAuth={setAuth} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/user/:name" element={<UserDetail />} />
        <Route path="/add-loan/:name" element={<AddLoan />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;