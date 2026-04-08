import { Link } from "react-router-dom";

export default function Dashboard() {
  const cardStyle = {
    textDecoration: "none",
    cursor: "pointer",
  };

  const gradientCardStyle = (gradient) => ({
    background: gradient,
    color: "white",
    padding: "1.5rem",
    borderRadius: "0.75rem",
    boxShadow: "var(--shadow-lg)",
    transition: "all 0.3s ease",
  });

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📊 Dashboard</h2>
        </div>

        <div style={{ textAlign: "center", paddingTop: "1rem" }}>
          <p style={{ fontSize: "1rem", marginBottom: "1.5rem", color: "var(--text-light)" }}>
            Welcome to Hisab! Manage your users and loans efficiently.
          </p>

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: "1rem", 
            marginBottom: "1rem" 
          }}>
            <Link to="/users" style={cardStyle}>
              <div 
                style={gradientCardStyle("linear-gradient(135deg, #667eea 0%, #764ba2 100%)")}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>👥</div>
                <div style={{ fontSize: "1rem", fontWeight: "600" }}>Users</div>
                <div style={{ fontSize: "0.8rem", opacity: "0.9", marginTop: "0.5rem" }}>Manage users</div>
              </div>
            </Link>

            <Link to="/loans" style={cardStyle}>
              <div 
                style={gradientCardStyle("linear-gradient(135deg, #f093fb 0%, #f5576c 100%)")}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>💰</div>
                <div style={{ fontSize: "1rem", fontWeight: "600" }}>Loans</div>
                <div style={{ fontSize: "0.8rem", opacity: "0.9", marginTop: "0.5rem" }}>Track loans</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}