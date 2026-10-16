import { CATEGORIES, catMeta } from "../data";
import { inr, prettyDate, downloadCSV } from "../utils";

export default function TransactionList({ expenses, filter, onFilter, onEdit, onDelete }) {
  return (
    <section className="card">
      <div className="card-head">
        <h2>Recent Transactions</h2>
        <button className="link" onClick={() => downloadCSV(expenses)} disabled={!expenses.length}>
          ⬇ Export CSV
        </button>
      </div>

      <div className="filters">
        <select value={filter.category} onChange={(e) => onFilter({ ...filter, category: e.target.value })}>
          <option value="All">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.name}>{c.name}</option>
          ))}
        </select>
        <select value={filter.range} onChange={(e) => onFilter({ ...filter, range: e.target.value })}>
          <option value="month">This month</option>
          <option value="7">Last 7 days</option>
          <option value="all">All time</option>
        </select>
      </div>

      {expenses.length === 0 ? (
        <div className="empty">
          <p>🪙</p>
          <p>No expenses found. Add one to get started!</p>
        </div>
      ) : (
        <ul className="tx-list">
          {expenses.map((e) => {
            const c = catMeta(e.category);
            return (
              <li key={e.id} className="tx">
                <div className="tx-icon" style={{ background: c.color + "22", color: c.color }}>{c.icon}</div>
                <div className="tx-info">
                  <strong>{e.name}</strong>
                  <span>
                    <i className="dot" style={{ background: c.color }} />
                    {e.category} · {prettyDate(e.date)}
                  </span>
                </div>
                <div className="tx-amount">−{inr(e.amount)}</div>
                <div className="tx-actions">
                  <button title="Edit" onClick={() => onEdit(e)}>✏️</button>
                  <button title="Delete" onClick={() => onDelete(e.id)}>🗑️</button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
