import { CATEGORIES } from "../data";
import { inr, sum } from "../utils";

// Suggested split of the SPENDABLE part (80%) of the budget; 20% goes to savings.
const SUGGESTED = { Food: 0.35, Transport: 0.15, Education: 0.2, Shopping: 0.15, Other: 0.15 };

const TIPS = [
  { icon: "📝", title: "Track every expense", text: "Log purchases the same day. Small ₹50–₹100 buys add up fastest." },
  { icon: "⏳", title: "24-hour rule", text: "For non-essential items, wait a day before buying. Many urges fade." },
  { icon: "🍱", title: "Cook or carry food", text: "Food is usually the biggest category. Home food is cheaper than canteen or delivery." },
  { icon: "🎓", title: "Use student discounts", text: "Check for student pricing on transport passes, software, courses and subscriptions." },
  { icon: "🏦", title: "Pay yourself first", text: "Move savings aside at the start of the month, not whatever is left at the end." },
  { icon: "🛟", title: "Build a small emergency fund", text: "Aim for at least one month of basic expenses for surprises." },
];

export default function ManageMoney({ monthExpenses, budget, catBudgets, onCatBudgets, savingsGoal, onSavingsGoal }) {
  const spent = sum(monthExpenses);
  const now = new Date();
  const day = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysLeft = Math.max(daysInMonth - day, 0);

  const remaining = budget - spent;
  const dailyAllowance = daysLeft > 0 ? Math.max(0, remaining / daysLeft) : Math.max(0, remaining);
  const projected = (spent / Math.max(day, 1)) * daysInMonth;
  const projectedSaving = budget - projected;
  const monthsToGoal = savingsGoal > 0 && projectedSaving > 0 ? Math.ceil(savingsGoal / projectedSaving) : null;
  const savedSoFar = Math.max(0, remaining);
  const goalPct = savingsGoal > 0 ? Math.min(100, (savedSoFar / savingsGoal) * 100) : 0;

  const applySuggested = () => {
    const spendable = budget * 0.8;
    const next = {};
    CATEGORIES.forEach((c) => (next[c.name] = Math.round(spendable * SUGGESTED[c.name])));
    onCatBudgets(next);
  };

  const status = (pct) => (pct >= 100 ? "danger" : pct >= 80 ? "warn" : "ok");

  return (
    <div className="stack">
      <section className="stats">
        <div className="card stat"><div className="stat-icon" style={{ background: "#dcfce7" }}>📆</div>
          <div><p className="label">Safe to spend per day</p><p className="value pos">{inr(dailyAllowance)}</p>
            <p className="label">{daysLeft} days left this month</p></div></div>
        <div className="card stat"><div className="stat-icon" style={{ background: "#e0e7ff" }}>📈</div>
          <div><p className="label">Projected month-end spend</p>
            <p className={`value ${projected > budget ? "neg" : ""}`}>{inr(projected)}</p>
            <p className="label">at your current pace</p></div></div>
        <div className="card stat"><div className="stat-icon" style={{ background: "#fef3c7" }}>🐷</div>
          <div><p className="label">Projected savings</p>
            <p className={`value ${projectedSaving < 0 ? "neg" : "pos"}`}>{inr(Math.max(0, projectedSaving))}</p>
            <p className="label">budget − projected spend</p></div></div>
      </section>

      <section className="card">
        <div className="card-head">
          <h2>Category Budgets</h2>
          <button className="link" onClick={applySuggested}>✨ Apply suggested split</button>
        </div>
        <p className="muted" style={{ marginTop: 0 }}>
          Suggested plan: keep <b>20% for savings</b> ({inr(budget * 0.2)}) and split the other 80% — Food 35%, Education 20%, Transport 15%, Shopping 15%, Other 15%.
        </p>
        <div className="cat-list">
          {CATEGORIES.map((c) => {
            const used = sum(monthExpenses.filter((e) => e.category === c.name));
            const limit = Number(catBudgets[c.name]) || 0;
            const pct = limit > 0 ? (used / limit) * 100 : 0;
            const lv = status(pct);
            return (
              <div key={c.name} className="cat-row">
                <div className="cat-top">
                  <span>{c.icon} <b>{c.name}</b></span>
                  <span className="muted" style={{ margin: 0 }}>{inr(used)} of ₹
                    <input className="mini-input" type="number" min="0" value={limit}
                      onChange={(e) => onCatBudgets({ ...catBudgets, [c.name]: Math.max(0, Number(e.target.value)) })} />
                  </span>
                </div>
                <div className="progress">
                  <div className={`progress-bar ${lv}`} style={{ width: `${Math.min(pct, 100)}%`, background: limit ? undefined : "#cbd5e1" }} />
                </div>
                <p className={`cat-note ${lv}`}>
                  {limit === 0 ? "Set a limit to track this category."
                    : pct >= 100 ? `Over by ${inr(used - limit)}`
                    : `${inr(limit - used)} left (${pct.toFixed(0)}% used)`}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="card">
        <div className="card-head"><h2>🎯 Savings Goal</h2></div>
        <label className="goal-input">Goal amount (₹)
          <input type="number" min="0" value={savingsGoal} onChange={(e) => onSavingsGoal(Math.max(0, Number(e.target.value)))} />
        </label>
        <div className="progress" style={{ marginTop: 14 }}>
          <div className="progress-bar ok" style={{ width: `${goalPct}%` }} />
        </div>
        <p className="muted">
          Saved so far this month: <b>{inr(savedSoFar)}</b> ({goalPct.toFixed(0)}% of goal).{" "}
          {monthsToGoal
            ? `At your current pace you'd reach this goal in about ${monthsToGoal} month${monthsToGoal > 1 ? "s" : ""}.`
            : savingsGoal > 0 ? "Reduce spending to start building toward this goal." : "Enter a goal to see a timeline."}
        </p>
      </section>

      <section className="card">
        <div className="card-head"><h2>💡 How to Manage Your Money</h2></div>
        <div className="tips-grid">
          {TIPS.map((t) => (
            <div key={t.title} className="tip-card">
              <span className="tip-icon">{t.icon}</span>
              <div><b>{t.title}</b><p>{t.text}</p></div>
            </div>
          ))}
        </div>
        <p className="tiny">General educational guidance, not professional financial advice.</p>
      </section>
    </div>
  );
}
