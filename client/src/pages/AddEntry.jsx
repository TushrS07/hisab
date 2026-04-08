import { useState, useEffect } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function AddEntry() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [entryType, setEntryType] = useState("credit");
  const [amount, setAmount] = useState("");
  const [voucher, setVoucher] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editVoucher, setEditVoucher] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editType, setEditType] = useState("credit");

  useEffect(() => {
    API.get("/users")
      .then((res) => setUsers(res.data))
      .catch(() => setError("Failed to load users"));
  }, []);

  const handleSubmit = async () => {
    try {
      setError("");
      if (!selectedUser || !amount || !date) {
        setError("Please fill in all required fields");
        return;
      }
      setLoading(true);
      const res = await API.post("/loans", {
        userName: selectedUser,
        amount: parseFloat(amount),
        entryType,
        interestRate: 0,
        voucherNumber: voucher,
        date,
      });
      setEntries((prev) => [
        { userName: selectedUser, amount: parseFloat(amount), entryType, date, voucherNumber: voucher, _id: res.data._id || Date.now() },
        ...prev,
      ]);
      setAmount("");
      setVoucher("");
      setDate(new Date().toISOString().split("T")[0]);
    } catch (err) {
      setError(err.response?.data || "Error adding entry");
    } finally {
      setLoading(false);
    }
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

  const startEdit = (entry) => {
    setEditingId(entry._id);
    setEditAmount(String(entry.amount));
    setEditVoucher(entry.voucherNumber || "");
    setEditDate(entry.date);
    setEditType(entry.entryType || "credit");
  };

  const handleEdit = async (id) => {
    try {
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

  return (
    <div className="page">
      <div className="card">
        <div className="card-title">Add Entry</div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-group">
          <label>User *</label>
          <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
            <option value="">Select user</option>
            {users.map((u) => (
              <option key={u._id} value={u.name}>{u.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Type *</label>
          <div className="toggle-row">
            <button
              type="button"
              className={`toggle-btn ${entryType === "credit" ? "toggle-credit active" : ""}`}
              onClick={() => setEntryType("credit")}
            >
              + Credit (Received)
            </button>
            <button
              type="button"
              className={`toggle-btn ${entryType === "debit" ? "toggle-debit active" : ""}`}
              onClick={() => setEntryType("debit")}
            >
              - Debit (Given)
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Amount *</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || /^\d+$/.test(val)) setAmount(val);
            }}
          />
        </div>

        <div className="form-group">
          <label>Date *</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Voucher No.</label>
          <input type="text" placeholder="Optional" value={voucher} onChange={(e) => setVoucher(e.target.value)} />
        </div>

        <div className="btn-row">
          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <span className="btn-loader"><span className="loader-spinner"></span> Saving...</span> : "Save"}
          </button>
          <button className="btn-secondary" onClick={() => navigate("/")} disabled={loading}>Cancel</button>
        </div>
      </div>

      {entries.length > 0 && (
        <div className="card">
          <div className="card-title">Entries Added ({entries.length})</div>
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
                        {e.userName}
                      </div>
                      <div className="entry-meta">{e.date}{e.voucherNumber ? ` · V: ${e.voucherNumber}` : ""}</div>
                    </div>
                    <div className="entry-actions">
                      <span className={`entry-amount ${e.entryType === "debit" ? "amount-debit" : "amount-credit"}`}>
                        {e.entryType === "debit" ? "−" : "+"} {parseFloat(e.amount).toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}
                      </span>
                      <button className="btn-edit-sm" onClick={() => startEdit(e)} title="Edit">✏️</button>
                      <button className="btn-danger-sm" onClick={() => handleDelete(e._id)} title="Delete">🗑️</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
