import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { CATEGORIES, catMeta } from "../data";
import { inr, prettyDate, sum, downloadCSV } from "../utils";

const monthLabel = (key) => {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
};

export default function History({ expenses, onEdit, onDelete }) {
  const [month, setMonth] = useState("all");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const months = useMemo(
    () => [...new Set(expenses.map((e) => e.date.slice(0, 7)))].sort().reverse(),
    [expenses]
  );

  const filtered = useMemo(
    () =>
      expenses
        .filter((e) => month === "all" || e.date.startsWith(month))
        .filter((e) => category === "All" || e.category === category)
        .filter((e) => e.name.toLowerCase().includes(search.trim().toLowerCase()))
        .sort((a, b) => (b.date === a.date ? b.id - a.id : b.date.localeCompare(a.date))),
    [expenses, month, category, search]
  );

  // Group by date
  const groups = useMemo(() => {
    const map = {};
    filtered.forEach((e) => (map[e.date] = map[e.date] || []).push(e));
    return Object.entries(map).map(([date, items]) => ({ date, items, total: sum(items) }));
  }, [filtered]);

  const total = sum(filtered);
  const biggest = filtered.reduce((m, e) => (e.amount > (m?.amount || 0) ? e : m), null);
  const avgPerDay = groups.length ? total / groups.length : 0;

  // Monthly overview (stacked by category)
  const monthly = useMemo(
    () =>
      [...months].reverse().map((key) => {
        const list = expenses.filter((e) => e.date.startsWith(key));
        const row = { month: monthLabel(key), total: sum(list), count: list.length };
        CATEGORIES.forEach((c) => (row[c.name] = sum(list.filter((e) => e.category === c.name))));
        const top = CATEGORIES.map((c) => [c.name, row[c.name]]).sort((a, b) => b[1] - a[1])[0];
        row.top = top && top[1] > 0 ? top[0] : "—";
        return row;
      }),
    [expenses, months]
  );

  return (
    <div className="stack">
      <section className="stats">
        <div className="card stat"><div className="stat-icon" style={{ background: "#ffedd5" }}>🧾</div>
          <div><p className="label">Total Spent</p><p className="value">{inr(total)}</p></div></div>
        <div className="card stat"><div className="stat-icon" style={{ background: "#e0e7ff" }}>📅</div>
          <div><p className="label">Avg / Spending Day</p><p className="value">{inr(avgPerDay)}</p></div></div>
        <div className="card stat"><div className="stat-icon" style={{ background: "#fce7f3" }}>🔥</div>
          <div><p className="label">Biggest Expense</p><p className="value">{biggest ? inr(biggest.amount) : "—"}</p>
            {biggest && <p className="label">{biggest.name}</p>}</div></div>
      </section>

      <section className="card">
        <div className="card-head"><h2>Monthly Overview</h2></div>
        <div className="chart">
          <ResponsiveContainer>
            <BarChart data={monthly}>
              <CartesianGrid vertical={false} stroke="#eef0f6" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} width={50} />
              <Tooltip formatter={(v) => inr(v)} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 8px 24px rgba(0,0,0,.12)" }} />
              <Legend iconType="circle" />
              {CATEGORIES.map((c, i) => (
                <Bar key={c.name} dataKey={c.name} stackId="a" fill={c.color}
                  radius={i === CATEGORIES.length - 1 ? [8, 8, 0, 0] : 0} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Month</th><th>Transactions</th><th>Top Category</th><th className="r">Total</th></tr></thead>
            <tbody>
              {monthly.slice().reverse().map((m) => (
                <tr key={m.month}><td>{m.month}</td><td>{m.count}</td><td>{m.top}</td><td className="r"><strong>{inr(m.total)}</strong></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <div className="card-head">
          <h2>Spending History — where your money went</h2>
          <button className="link" onClick={() => downloadCSV(filtered)} disabled={!filtered.length}>⬇ Export CSV</button>
        </div>

        <div className="filters">
          <input className="search" placeholder="🔍 Search expenses..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select value={month} onChange={(e) => setMonth(e.target.value)}>
            <option value="all">All months</option>
            {months.map((m) => <option key={m} value={m}>{monthLabel(m)}</option>)}
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="All">All categories</option>
            {CATEGORIES.map((c) => <option key={c.name}>{c.name}</option>)}
          </select>
        </div>

        {groups.length === 0 ? (
          <div className="empty"><p>🔎</p><p>No matching expenses.</p></div>
        ) : (
          groups.map((g) => (
            <div key={g.date} className="day-group">
              <div className="day-head"><span>{prettyDate(g.date)}</span><span>{inr(g.total)}</span></div>
              <ul className="tx-list">
                {g.items.map((e) => {
                  const c = catMeta(e.category);
                  return (
                    <li key={e.id} className="tx">
                      <div className="tx-icon" style={{ background: c.color + "22", color: c.color }}>{c.icon}</div>
                      <div className="tx-info"><strong>{e.name}</strong>
                        <span><i className="dot" style={{ background: c.color }} />{e.category}</span></div>
                      <div className="tx-amount">−{inr(e.amount)}</div>
                      <div className="tx-actions">
                        <button title="Edit" onClick={() => onEdit(e)}>✏️</button>
                        <button title="Delete" onClick={() => onDelete(e.id)}>🗑️</button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
