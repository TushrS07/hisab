import { useState, useEffect } from "react";
import API from "../api/api";

const today = new Date().toISOString().split("T")[0];
const oneYearAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split("T")[0];

export default function ViewEntries() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [allDates, setAllDates] = useState(false);
  const [fromDate, setFromDate] = useState(oneYearAgo);
  const [toDate, setToDate] = useState(today);
  const [period, setPeriod] = useState("month");
  const [interest, setInterest] = useState("");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [hisabDate, setHisabDate] = useState(today);

  useEffect(() => {
    API.get("/users").then((res) => setUsers(res.data));
  }, []);

  const fetchEntries = async () => {
    if (!selectedUser) return;
    setLoading(true);
    try {
      const res = await API.get(`/loans/${selectedUser}`);
      let data = res.data;

      if (!allDates) {
        if (fromDate) data = data.filter((e) => e.date.slice(0, 10) >= fromDate);
        if (toDate) data = data.filter((e) => e.date.slice(0, 10) <= toDate);
      }

      // sort by date ascending
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
    setPeriod("month");
    setInterest("");
    setHisabDate(today);
    setSelectedUser("");
    setEntries([]);
    setFetched(false);
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });

  const fmt = (n) => Math.abs(n).toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

  const interestRate = parseFloat(interest) || 0;
  const now = new Date(hisabDate);

  // Calculate months between two dates (fractional)
  const monthsBetween = (d1, d2) => {
    return (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth()) + (d2.getDate() - d1.getDate()) / 30;
  };

  // Running balance interest calculation
  // Sort entries by date, walk through them, calculate interest on outstanding balance for each period
  let totalDebit = 0;
  let totalCredit = 0;
  let totalInterest = 0;
  const entryDetails = []; // store running balance and interest info per entry

  if (entries.length > 0 && interestRate > 0) {
    let runningBalance = 0;
    const sorted = [...entries];

    for (let i = 0; i < sorted.length; i++) {
      const e = sorted[i];
      const entryDate = new Date(e.date);

      // Calculate interest on previous balance from last entry date to this entry date
      let interestForPeriod = 0;
      if (i > 0 && runningBalance > 0) {
        const prevDate = new Date(sorted[i - 1].date);
        const months = monthsBetween(prevDate, entryDate);
        const periods = period === "year" ? months / 12 : months;
        interestForPeriod = (runningBalance * interestRate * Math.max(0, periods)) / 100;
        totalInterest += interestForPeriod;
      }

      // Update running balance
      if (e.entryType === "debit") {
        runningBalance += e.amount;
        totalDebit += e.amount;
      } else {
        runningBalance -= e.amount;
        totalCredit += e.amount;
      }

      entryDetails.push({
        ...e,
        runningBalance,
        interestForPeriod,
      });
    }

    // Interest from last entry to today
    if (runningBalance > 0) {
      const lastDate = new Date(sorted[sorted.length - 1].date);
      const months = monthsBetween(lastDate, now);
      const periods = period === "year" ? months / 12 : months;
      const finalInterest = (runningBalance * interestRate * Math.max(0, periods)) / 100;
      totalInterest += finalInterest;
    }
  } else {
    entries.forEach((e) => {
      if (e.entryType === "debit") totalDebit += e.amount;
      else totalCredit += e.amount;

      entryDetails.push({ ...e, runningBalance: 0, interestForPeriod: 0 });
    });
  }

  const outstandingBalance = totalDebit - totalCredit;
  const grandTotal = outstandingBalance + totalInterest;

  const getDuration = (dateStr) => {
    const months = monthsBetween(new Date(dateStr), now);
    const fullMonths = Math.floor(months);
    const remainingDays = Math.round((months - fullMonths) * 30);
    if (fullMonths > 0) return `${fullMonths} mo${remainingDays > 0 ? ` ${remainingDays} d` : ""}`;
    return `${Math.max(0, remainingDays)} d`;
  };

  return (
    <div className="page">
      <div className="card">
        <div className="card-title">Hissab</div>

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

        <div className="form-group">
          <label>Hisab Date</label>
          <input type="date" value={hisabDate} onChange={(e) => setHisabDate(e.target.value)} max={today} />
        </div>

        <div className="form-group">
          <label>Interest Rate (%)</label>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input
              type="text"
              inputMode="decimal"
              placeholder="e.g. 2"
              value={interest}
              style={{ flex: 1 }}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || /^\d*\.?\d*$/.test(val)) setInterest(val);
              }}
            />
            <select className="select-sm" value={period} onChange={(e) => setPeriod(e.target.value)} style={{ width: "auto", flex: "0 0 auto" }}>
              <option value="month">/ month</option>
              <option value="year">/ year</option>
            </select>
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
          <div className="card-title">{selectedUser}'s Hissab ({entries.length} entries)</div>

          {entries.length > 0 && (
            <>
              <div className="summary-row" style={{ marginBottom: "0.75rem" }}>
                <div className="summary-item">
                  <div className="summary-label">Given</div>
                  <div className="summary-value" style={{ color: "var(--danger)", fontSize: "0.95rem" }}>{fmt(totalDebit)}</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Received</div>
                  <div className="summary-value" style={{ color: "var(--success)", fontSize: "0.95rem" }}>{fmt(totalCredit)}</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Outstanding</div>
                  <div className="summary-value" style={{ color: outstandingBalance > 0 ? "var(--danger)" : "var(--success)", fontSize: "0.95rem" }}>
                    {fmt(outstandingBalance)}
                  </div>
                </div>
              </div>
              {interestRate > 0 && (
                <div className="summary-row" style={{ marginBottom: "1rem" }}>
                  <div className="summary-item">
                    <div className="summary-label">Interest ({interestRate}%/{period})</div>
                    <div className="summary-value" style={{ fontSize: "0.95rem" }}>{fmt(totalInterest)}</div>
                  </div>
                  <div className="summary-item" style={{ gridColumn: "span 2" }}>
                    <div className="summary-label">Total</div>
                    <div className="summary-value" style={{ color: grandTotal > 0 ? "var(--danger)" : "var(--success)", fontSize: "1.1rem", fontWeight: "800" }}>
                      {fmt(grandTotal)}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {entries.length === 0 ? (
            <div className="empty">
              <div className="icon">📋</div>
              <div className="text">No entries found</div>
            </div>
          ) : (
            <ul className="entry-list">
              {entryDetails.map((e) => {
                const duration = getDuration(e.date);
                const months = monthsBetween(new Date(e.date), now);
                const periods = period === "year" ? months / 12 : months;
                const entryInterest = interestRate > 0 ? (e.amount * interestRate * Math.max(0, periods)) / 100 : 0;
                return (
                  <li key={e._id} style={{ padding: "0.75rem 0", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div className="entry-info">
                        <div className="entry-name">
                          <span className={`type-badge ${e.entryType === "debit" ? "type-debit" : "type-credit"}`}>
                            {e.entryType === "debit" ? "−" : "+"}
                          </span>
                          {formatDate(e.date)}
                        </div>
                        <div className="entry-meta">
                          {e.entryType === "debit" ? "Given" : "Received"} · {duration} ago{e.voucherNumber ? ` · V: ${e.voucherNumber}` : ""}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div className={`entry-amount ${e.entryType === "debit" ? "amount-debit" : "amount-credit"}`}>
                          {e.entryType === "debit" ? "−" : "+"} {fmt(e.amount)}
                        </div>
                        {interestRate > 0 && (
                          <div style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: "600", marginTop: "0.15rem" }}>
                            Int: {fmt(entryInterest)}
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
