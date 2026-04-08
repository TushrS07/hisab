import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ setAuth }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setAuth(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <Link to="/" style={{ cursor: "pointer" }}>Dashboard</Link>
        <Link to="/users" style={{ cursor: "pointer" }}>Users</Link>
      </div>
      <button className="btn-danger" onClick={logout}>
        Logout
      </button>
    </nav>
  );
}