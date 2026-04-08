import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="page">
      <h1 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "1rem" }}>Dashboard</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Link to="/add-entry" className="dash-card" style={{ padding: "2.5rem 1rem" }}>
          <span className="icon" style={{ fontSize: "3rem" }}>➕</span>
          <span className="label" style={{ fontSize: "1.2rem" }}>Add Entry</span>
        </Link>
        <Link to="/view-entries" className="dash-card" style={{ padding: "2.5rem 1rem" }}>
          <span className="icon" style={{ fontSize: "3rem" }}>📋</span>
          <span className="label" style={{ fontSize: "1.2rem" }}>Hissab</span>
        </Link>
        <Link to="/manage-entries" className="dash-card" style={{ padding: "2.5rem 1rem" }}>
          <span className="icon" style={{ fontSize: "3rem" }}>📝</span>
          <span className="label" style={{ fontSize: "1.2rem" }}>View Entries</span>
        </Link>
      </div>
    </div>
  );
}
