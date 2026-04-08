import { useEffect, useState } from "react";
import API from "../api/api";
import { useParams, Link } from "react-router-dom";

export default function UserDetail() {
  const { name } = useParams();
  const [loans, setLoans] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchLoans = async () => {
    const res = await API.get(`/loans/${name}`);
    setLoans(res.data);
  };

  const fetchUsers = async () => {
    const res = await API.get("/users");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchLoans();
    fetchUsers();
  }, [name]);

  const calculate = () => {
    let total = 0;
    let interest = 0;

    loans.forEach((l) => {
      total += l.amount;

      const days = (Date.now() - new Date(l.date)) / (1000*60*60*24);
      const years = days / 365;

      interest += (l.amount * l.interestRate * years) / 100;
    });

    return { total, interest };
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysAgo = (date) => {
    const days = Math.floor((Date.now() - new Date(date)) / (1000*60*60*24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  const { total, interest } = calculate();

  return (
    <div className="user-details-wrapper">
      {/* Main Content */}
      <div className="user-details-main">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">💼 {name}'s Hisab</h2>
            <p style={{ marginTop: "0.5rem", color: "var(--text-light)", fontSize: "0.9rem" }}>
              Loan details and settlement
            </p>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <Link to={`/add-loan/${name}`} className="btn-primary" style={{ display: "inline-block", marginBottom: "1.5rem" }}>
              + Add Loan
            </Link>
          </div>

          {loans.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <div className="empty-state-text">No loans yet. Add one to get started!</div>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: "2rem" }}>
                <h3 className="form-section-title">📝 Loans List</h3>
                <div style={{ overflowX: "auto" }}>
                  <table className="loans-table">
                    <thead>
                      <tr>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Voucher #</th>
                        <th>Interest %</th>
                        <th>Days</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loans.map((l) => {
                        const days = Math.floor((Date.now() - new Date(l.date)) / (1000*60*60*24));
                        return (
                          <tr key={l._id}>
                            <td><strong>₹{l.amount.toLocaleString('en-IN')}</strong></td>
                            <td>{formatDate(l.date)}</td>
                            <td>{l.voucherNumber || "-"}</td>
                            <td>{l.interestRate}%</td>
                            <td>{days} days</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="form-section">
                <h3 className="form-section-title">💰 Settlement Summary</h3>
                
                <div className="summary-grid">
                  <div className="summary-card" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                    <div className="summary-card-label">Principal</div>
                    <div className="summary-card-value">₹{total.toLocaleString('en-IN')}</div>
                  </div>

                  <div className="summary-card" style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}>
                    <div className="summary-card-label">Interest</div>
                    <div className="summary-card-value">₹{interest.toFixed(2)}</div>
                  </div>

                  <div className="summary-card" style={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}>
                    <div className="summary-card-label">Total Due</div>
                    <div className="summary-card-value">₹{(total + interest).toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="user-details-sidebar card" style={{ height: "fit-content", position: "sticky", top: "2rem" }}>
        <div style={{ padding: "1rem", borderBottom: "2px solid var(--border)", marginBottom: "1rem" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: "600", margin: "0", color: "var(--text)" }}>👥 Users</h3>
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {users.map((u) => (
            <li key={u._id} style={{ marginBottom: "0.5rem" }}>
              <Link 
                to={`/user/${u.name}`}
                style={{
                  display: "block",
                  padding: "0.75rem",
                  borderRadius: "0.375rem",
                  textDecoration: "none",
                  background: name === u.name ? "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)" : "var(--bg-secondary)",
                  color: name === u.name ? "white" : "var(--primary)",
                  fontWeight: name === u.name ? "600" : "500",
                  border: name === u.name ? "2px solid var(--primary)" : "1px solid transparent",
                  transition: "all 0.3s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  if (name !== u.name) {
                    e.currentTarget.style.background = "rgba(102, 126, 234, 0.15)";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (name !== u.name) {
                    e.currentTarget.style.background = "var(--bg-secondary)";
                    e.currentTarget.style.transform = "translateX(0)";
                  }
                }}
              >
                {u.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}