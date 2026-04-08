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

  return (
    <div className="container" style={{ alignItems: "center", justifyContent: "center" }}>
      <div className="card" style={{ maxWidth: "450px" }}>
        <div className="card-header" style={{ textAlign: "center" }}>
          <h2 className="card-title">🔐 Login</h2>
          <p style={{ marginTop: "0.5rem", color: "var(--text-light)", fontSize: "0.95rem" }}>
            Welcome to Hisab
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        <button className="btn-primary" onClick={handleLogin} disabled={loading} style={{ width: "100%" }}>
          {loading ? (
            <span className="btn-loader">
              <span className="loader-spinner"></span>
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </button>
      </div>
    </div>
  );
}