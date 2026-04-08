import { useState, useEffect } from "react";
import API from "../api/api";

const today = new Date().toISOString().split("T")[0];
const oneYearAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split("T")[0];

export default function ManageEntries() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [allDates, setAllDates] = useState(false);
  const [fromDate, setFromDate] = useState(oneYearAgo);
  const [toDate, setToDate] = useState(today);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editVoucher, setEditVoucher] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editType, setEditType] = useState("credit");

  useEffect(() => {
    API.get("/users").then((res) => setUsers(res.data));
  }, []);

  const fetchEntries = async () => {
    if (!selectedUser) return;
    setLoading(true);
    setError("");
    try {
      const res = await API.get(`/loans/${selectedUser}`);
      let data = res.data;
      if (!allDates) {
        if (fromDate) data = data.filter((e) => e.date.slice(0, 10) >= fromDate);
        if (toDate) data = data.filter((e) => e.date.slice(0, 10) <= toDate);
      }
      data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setEntries(data);
      setFetched(true);
    } catch {
      setEntries([]);
      setFetched(true);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setAllDates(false);
    setFromDate(oneYearAgo);
    setToDate(today);
    setSelectedUser("");
    setEntries([]);
    setFetched(false);
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      await API.delete(`/loans/${id}`);
      setEntries((prev) => prev.filter((e) => e._id !== id));
    } catch {
      setError("Error deleting entry");
    }
  };

  const startEdit = (e) => {
    setEditingId(e._id);
    setEditAmount(String(e.amount));
    setEditVoucher(e.voucherNumber || "");
    setEditDate(e.date.slice(0, 10));
    setEditType(e.entryType || "credit");
  };

  const handleEdit = async (id) => {
    try {
      setError("");
      await API.put(`/loans/${id}`, {
        amount: parseFloat(editAmount),
        entryType: editType,
        voucherNumber: editVoucher,
        date: editDate,
      });
      setEntries((prev) =>
        prev.map((e) =>
          e._id === id ? { ...e, amount: parseFloat(editAmount), entryType: editType, voucherNumber: editVoucher, date: editDate } : e
        )
      );
      setEditingId(null);
    } catch {
      setError("Error updating entry");
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });

  const fmt = (n) => Math.abs(n).toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

  return (
    <div className="page">
      <div className="card">
        <div className="card-title">View Entries</div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-group">
          <label>User</label>
          <select value={selectedUser} onChange={(e) => { setSelectedUser(e.target.value); setFetched(false); }}>
            <option value="">Select user</option>
            {users.map((u) => (
              <option key={u._id} value={u.name}>{u.name}</option>
            ))}
          </select>
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: "0.75rem 0", cursor: "pointer", fontSize: "0.95rem", fontWeight: "500" }}>
          <input type="checkbox" checked={allDates} onChange={(e) => setAllDates(e.target.checked)} style={{ width: "1.1rem", height: "1.1rem", accentColor: "var(--primary)" }} />
          All entries (no date filter)
        </label>

        <div style={{ opacity: allDates ? 0.4 : 1, pointerEvents: allDates ? "none" : "auto" }}>
          <div className="form-group">
            <label>From</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label>To</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
        </div>

        <div className="btn-row" style={{ marginTop: "0.5rem" }}>
          <button className="btn-primary" onClick={fetchEntries} disabled={!selectedUser || loading}>
            {loading ? <span className="btn-loader"><span className="loader-spinner"></span> Loading...</span> : "Search"}
          </button>
          <button className="btn-secondary" onClick={clearFilters}>Clear</button>
        </div>
      </div>

      {fetched && (
        <div className="card">
          <div className="card-title">{selectedUser}'s Entries ({entries.length})</div>

          {entries.length === 0 ? (
            <div className="empty">
              <div className="icon">📋</div>
              <div className="text">No entries found</div>
            </div>
          ) : (
            <ul className="entry-list">
              {entries.map((e) => (
                <li key={e._id} className="entry-item" style={editingId === e._id ? { flexDirection: "column", alignItems: "stretch" } : {}}>
                  {editingId === e._id ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <div className="toggle-row">
                        <button type="button" className={`toggle-btn ${editType === "credit" ? "toggle-credit active" : ""}`} onClick={() => setEditType("credit")}>+ Credit</button>
                        <button type="button" className={`toggle-btn ${editType === "debit" ? "toggle-debit active" : ""}`} onClick={() => setEditType("debit")}>- Debit</button>
                      </div>
                      <input
                        type="text" inputMode="numeric" pattern="[0-9]*" value={editAmount} placeholder="Amount"
                        onChange={(ev) => { if (ev.target.value === "" || /^\d+$/.test(ev.target.value)) setEditAmount(ev.target.value); }}
                      />
                      <input type="date" value={editDate} onChange={(ev) => setEditDate(ev.target.value)} />
                      <input type="text" value={editVoucher} onChange={(ev) => setEditVoucher(ev.target.value)} placeholder="Voucher (optional)" />
                      <div className="btn-row">
                        <button className="btn-primary" onClick={() => handleEdit(e._id)}>Save</button>
                        <button className="btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="entry-info">
                        <div className="entry-name">
                          <span className={`type-badge ${e.entryType === "debit" ? "type-debit" : "type-credit"}`}>
                            {e.entryType === "debit" ? "−" : "+"}
                          </span>
                          {formatDate(e.date)}
                        </div>
                        {e.voucherNumber && <div className="entry-meta">V: {e.voucherNumber}</div>}
                      </div>
                      <div className="entry-actions">
                        <span className={`entry-amount ${e.entryType === "debit" ? "amount-debit" : "amount-credit"}`}>
                          {e.entryType === "debit" ? "−" : "+"} {fmt(e.amount)}
                        </span>
                        <button className="btn-edit-sm" onClick={() => startEdit(e)} title="Edit">✏️</button>
                        <button className="btn-danger-sm" onClick={() => handleDelete(e._id)} title="Delete">🗑️</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
