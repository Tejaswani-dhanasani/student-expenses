import { inr } from "../utils";

export default function StatCards({ budget, spent, onBudgetChange }) {
  const remaining = budget - spent;
  const over = remaining < 0;

  return (
    <section className="stats">
      <div className="card stat">
        <div className="stat-icon" style={{ background: "#e0e7ff" }}>💰</div>
        <div>
          <p className="label">Monthly Budget</p>
          <div className="budget-input">
            <span>₹</span>
            <input
              type="number"
              min="0"
              value={budget}
              onChange={(e) => onBudgetChange(Math.max(0, Number(e.target.value)))}
              aria-label="Monthly budget"
            />
          </div>
        </div>
      </div>

      <div className="card stat">
        <div className="stat-icon" style={{ background: "#ffedd5" }}>🧾</div>
        <div>
          <p className="label">Total Spent</p>
          <p className="value">{inr(spent)}</p>
        </div>
      </div>

      <div className="card stat">
        <div className="stat-icon" style={{ background: over ? "#fee2e2" : "#dcfce7" }}>
          {over ? "⚠️" : "✅"}
        </div>
        <div>
          <p className="label">{over ? "Over Budget By" : "Remaining"}</p>
          <p className={`value ${over ? "neg" : "pos"}`}>{inr(Math.abs(remaining))}</p>
        </div>
      </div>
    </section>
  );
}
