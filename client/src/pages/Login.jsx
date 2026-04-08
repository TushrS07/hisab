import { useState } from "react";
import API from "../api/api";

export default function Login({ setAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setError("");
      if (!email || !password) {
        setError("Please enter both email and password");
        return;
      }
      setLoading(true);
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setAuth(true);
    } catch (err) {
      setError(err.response?.data || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e) => e.key === "Enter" && handleLogin();

  return (
    <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <div className="card" style={{ width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <img src="/logo.png" alt="Khata Plus" style={{ width: "220px", height: "220px", objectFit: "contain", marginBottom: "1rem", background: "white", borderRadius: "1rem", padding: "0.5rem" }} />
          <h1 style={{ fontSize: "1.5rem", fontWeight: "800" }}>Khata Plus</h1>
          <p style={{ color: "var(--text-light)", fontSize: "0.9rem" }}>Sign in to continue</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={onKey} />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={onKey} />
        </div>

        <button className="btn-primary" onClick={handleLogin} disabled={loading}>
          {loading ? <span className="btn-loader"><span className="loader-spinner"></span> Signing in...</span> : "Sign In"}
        </button>
      </div>
    </div>
  );
}
