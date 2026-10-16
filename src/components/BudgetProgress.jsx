export default function BudgetProgress({ budget, spent }) {
  const pct = budget > 0 ? (spent / budget) * 100 : 0;
  const level = pct >= 100 ? "danger" : pct >= 80 ? "warn" : "ok";

  return (
    <section className="card">
      <div className="card-head">
        <h2>Budget Progress</h2>
        <span className={`pill ${level}`}>{pct.toFixed(1)}% used</span>
      </div>
      <div className="progress" role="progressbar" aria-valuenow={Math.min(pct, 100)} aria-valuemin="0" aria-valuemax="100">
        <div className={`progress-bar ${level}`} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
      {level === "danger" && (
        <p className="alert danger">🚨 You've exceeded your monthly budget. Try cutting non-essential spending.</p>
      )}
      {level === "warn" && (
        <p className="alert warn">⚠️ You've used over 80% of your budget. Spend carefully!</p>
      )}
      {level === "ok" && <p className="muted">You're on track. Keep it up! 🎯</p>}
    </section>
  );
}
