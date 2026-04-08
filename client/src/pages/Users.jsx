import { useEffect, useState } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    const res = await API.get("/users");
    setUsers(res.data);
  };

  const addUser = async () => {
    try {
      setError("");
      if (!name.trim()) {
        setError("Please enter a name");
        return;
      }
      await API.post("/users", { name, phone });
      setName("");
      setPhone("");
      fetchUsers();
    } catch (err) {
      setError(err.response?.data || "Error adding user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">👥 Manage Users</h2>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Add New User</h3>
          
          {error && <div className="alert alert-error">{error}</div>}
          
          <div className="form-row">
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                placeholder="Enter user name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          
          <button className="btn-primary" onClick={addUser} style={{ width: "100%" }}>
            ✓ Add User
          </button>
        </div>

        <div>
          <h3 className="form-section-title">Users List ({users.length})</h3>
          {users.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <div className="empty-state-text">No users yet. Add one to get started!</div>
            </div>
          ) : (
            <ul className="user-list">
              {users.map((u) => (
                <li key={u._id} className="user-item">
                  <div className="user-info">
                    <Link to={`/user/${u.name}`} className="user-name">
                      {u.name}
                    </Link>
                    {u.phone && <div className="user-phone">📱 {u.phone}</div>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}