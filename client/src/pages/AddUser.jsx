import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function AddUser() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const addUser = async () => {
    try {
      setError("");
      if (!name.trim()) { setError("Please enter a name"); return; }
      setLoading(true);
      await API.post("/users", { name, phone });
      navigate("/users");
    } catch (err) {
      setError(err.response?.data || "Error adding user");
    } finally {
      setLoading(false);
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
          <input type="tel" placeholder="Enter phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="btn-row">
          <button className="btn-primary" onClick={addUser} disabled={loading}>
            {loading ? <span className="btn-loader"><span className="loader-spinner"></span> Adding...</span> : "Add"}
          </button>
          <button className="btn-secondary" onClick={() => navigate(-1)} disabled={loading}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
