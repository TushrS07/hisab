import { useState, useEffect } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function AddUser() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch {}
  };

  useEffect(() => { fetchUsers(); }, []);

  const addUser = async () => {
    try {
      setError("");
      if (!name.trim()) { setError("Please enter a name"); return; }
      if (phone && phone.length !== 10) { setError("Phone number must be 10 digits"); return; }
      setLoading(true);
      await API.post("/users", { name, phone });
      setName("");
      setPhone("");
      fetchUsers();
    } catch (err) {
      setError(err.response?.data || "Error adding user");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    try {
      await API.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch {
      setError("Error deleting customer");
    }
  };

  const startEdit = (u) => {
    setEditingId(u._id);
    setEditName(u.name);
    setEditPhone(u.phone || "");
  };

  const handleEdit = async (id) => {
    try {
      setError("");
      if (!editName.trim()) { setError("Name is required"); return; }
      if (editPhone && editPhone.length !== 10) { setError("Phone number must be 10 digits"); return; }
      await API.put(`/users/${id}`, { name: editName, phone: editPhone });
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data || "Error updating customer");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <div className="card-title">Add Customer</div>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-group">
          <label>Name *</label>
          <input type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter phone (optional)"
            value={phone}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || /^\d+$/.test(val)) setPhone(val);
            }}
            maxLength={10}
          />
        </div>
        <div className="btn-row">
          <button className="btn-primary" onClick={addUser} disabled={loading}>
            {loading ? <span className="btn-loader"><span className="loader-spinner"></span> Adding...</span> : "Add"}
          </button>
          <button className="btn-secondary" onClick={() => navigate(-1)} disabled={loading}>Cancel</button>
        </div>
      </div>

      {users.length > 0 && (
        <div className="card">
          <div className="card-title">Customers ({users.length})</div>
          <ul className="entry-list">
            {users.map((u) => (
              <li key={u._id} className="entry-item" style={editingId === u._id ? { flexDirection: "column", alignItems: "stretch" } : {}}>
                {editingId === u._id ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Name" />
                    <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={10} value={editPhone} onChange={(e) => { const val = e.target.value; if (val === "" || /^\d+$/.test(val)) setEditPhone(val); }} placeholder="Phone (optional)" />
                    <div className="btn-row">
                      <button className="btn-primary" onClick={() => handleEdit(u._id)}>Save</button>
                      <button className="btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="entry-info">
                      <div className="entry-name" style={{ fontWeight: 600 }}>{u.name}</div>
                      {u.phone && <div className="entry-meta">{u.phone}</div>}
                    </div>
                    <div className="entry-actions">
                      <button className="btn-edit-sm" onClick={() => startEdit(u)} title="Edit">✏️</button>
                      <button className="btn-danger-sm" onClick={() => handleDelete(u._id)} title="Delete">🗑️</button>
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
