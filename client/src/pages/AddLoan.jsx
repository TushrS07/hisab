import { useState } from "react";
import API from "../api/api";
import { useParams, useNavigate } from "react-router-dom";

export default function AddLoan() {
  const { name } = useParams();
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [voucher, setVoucher] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setError("");
      if (!amount || !rate || !date) {
        setError("Please fill in all required fields");
        return;
      }
      await API.post("/loans", {
        userName: name,
        amount: parseFloat(amount),
        interestRate: parseFloat(rate),
        voucherNumber: voucher,
        date,
      });

      navigate(`/user/${name}`);
    } catch (err) {
      setError(err.response?.data || "Error adding loan");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">➕ Add Loan</h2>
          <p style={{ marginTop: "0.5rem", color: "var(--text-light)", fontSize: "0.9rem" }}>
            for {name}
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-section">
          <div className="form-group">
            <label>Amount (₹) *</label>
            <input
              type="number"
              placeholder="Enter loan amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Interest Rate (%) *</label>
            <input
              type="number"
              placeholder="Enter interest rate"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              step="0.1"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Date *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Voucher Number</label>
            <input
              type="text"
              placeholder="Enter voucher number (optional)"
              value={voucher}
              onChange={(e) => setVoucher(e.target.value)}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <button className="btn-primary" onClick={handleSubmit}>
              💾 Save Loan
            </button>
            <button className="btn-secondary" onClick={() => navigate(`/user/${name}`)}>
              ✕ Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}