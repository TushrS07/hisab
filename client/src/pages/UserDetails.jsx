import { useEffect, useState } from "react";
import API from "../api/api";
import { useParams, Link } from "react-router-dom";

export default function UserDetail() {
  const { name } = useParams();
  const [loans, setLoans] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    API.get(`/loans/${name}`).then((res) => setLoans(res.data));
    API.get("/users").then((res) => setUsers(res.data));
  }, [name]);

  const total = loans.reduce((sum, l) => sum + l.amount, 0);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="page" style={{ maxWidth: "900px" }}>
      {/* User pills */}
      <div className="sidebar-links">
        {users.map((u) => (
          <Link key={u._id} to={`/user/${u.name}`} className={`sidebar-link ${name === u.name ? "active" : ""}`}>
            {u.name}
          </Link>
        ))}
      </div>

      <div className="card">
        <div className="card-title">{name}'s Entries</div>

        <div className="summary-row">
          <div className="summary-item">
            <div className="summary-label">Total</div>
            <div className="summary-value">{total.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">Entries</div>
            <div className="summary-value">{loans.length}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">Latest</div>
            <div className="summary-value" style={{ fontSize: "0.85rem" }}>{loans.length > 0 ? formatDate(loans[loans.length - 1].date) : "-"}</div>
          </div>
        </div>

        <Link to={`/add-loan/${name}`} className="btn-primary" style={{ display: "block", textAlign: "center", textDecoration: "none", marginBottom: "1rem" }}>
          + Add Entry
        </Link>

        {loans.length === 0 ? (
          <div className="empty">
            <div className="icon">📋</div>
            <div className="text">No entries yet</div>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="loans-table">
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Voucher</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((l) => (
                  <tr key={l._id}>
                    <td style={{ fontWeight: 700, color: "var(--primary)" }}>{l.amount.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}</td>
                    <td>{formatDate(l.date)}</td>
                    <td>{l.voucherNumber || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
