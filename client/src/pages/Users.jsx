import { useEffect, useState } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const fetchUsers = async () => {
    const res = await API.get("/users");
    setUsers(res.data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await API.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch {
      setError("Error deleting user");
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
      await API.put(`/users/${id}`, { name: editName, phone: editPhone });
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data || "Error updating user");
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  return (
    <div className="page">
      <div className="card">
        <div className="card-title">Users ({users.length})</div>
        {error && <div className="alert alert-error">{error}</div>}
        {users.length === 0 ? (
          <div className="empty">
            <div className="icon">📭</div>
            <div className="text">No users yet</div>
          </div>
        ) : (
          <ul className="entry-list">
            {users.map((u) => (
              <li key={u._id} className="entry-item" style={editingId === u._id ? { flexDirection: "column", alignItems: "stretch" } : {}}>
                {editingId === u._id ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Name" />
                    <input type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="Phone (optional)" />
                    <div className="btn-row">
                      <button className="btn-primary" onClick={() => handleEdit(u._id)}>Save</button>
                      <button className="btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="entry-info">
                      <Link to={`/user/${u.name}`} className="entry-name" style={{ color: "var(--primary)", textDecoration: "none" }}>{u.name}</Link>
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
        )}
      </div>
    </div>
  );
}
