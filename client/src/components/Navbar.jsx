import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ setAuth }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const logout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      setAuth(false);
      navigate("/");
    }
  };

  return (
    <nav className="navbar">
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {!isHome && (
          <button className="btn-back" onClick={() => navigate(-1)} title="Back">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
        )}
        <Link to="/" className="navbar-brand" title="Home">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span className="brand-name">Khata Plus</span>
        </Link>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <Link to="/add-user" className="btn-nav" title="Add Customer">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </Link>
        <button className="btn-logout" onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}
