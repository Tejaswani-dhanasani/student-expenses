import { useState } from "react";
import { inr, sum } from "../utils";

// Milestone 4 placeholder: rule-based tips computed locally.
// To use a real AI API later, call a SERVER-SIDE endpoint from here and send
// only the small `summary` object below (never put API keys in React code).
export default function AIInsights({ expenses, budget }) {
  const [tips, setTips] = useState(null);

  const generate = () => {
    const spent = sum(expenses);
    const now = new Date();
    const day = now.getDate();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysLeft = daysInMonth - day;

    const byCat = {};
    expenses.forEach((e) => (byCat[e.category] = (byCat[e.category] || 0) + e.amount));
    const top = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];

    const projected = (spent / Math.max(day, 1)) * daysInMonth;
    const safeDaily = daysLeft > 0 ? Math.max(0, (budget - spent) / daysLeft) : 0;

    const out = [];
    if (top) out.push(`🏆 Your biggest category is ${top[0]} at ${inr(top[1])} (${((top[1] / spent) * 100).toFixed(0)}% of spending).`);
    out.push(`📈 At the current pace you'll spend about ${inr(projected)} this month.`);
    if (projected > budget) out.push(`🚨 That's ${inr(projected - budget)} over budget. Try trimming ${top ? top[0] : "non-essential"} expenses.`);
    else out.push("🎉 You're projected to finish within budget. Nice work!");
    if (daysLeft > 0) out.push(`💡 You can safely spend about ${inr(safeDaily)} per day for the remaining ${daysLeft} days.`);
    setTips(out);
  };

  return (
    <section className="card ai">
      <div className="card-head">
        <h2>🤖 AI Budget Assistant</h2>
        <span className="pill ok">Preview</span>
      </div>
      <p className="muted">Get quick suggestions based on a summary of your spending.</p>
      <button className="btn dark" onClick={generate}>✨ Get Suggestions</button>
      {tips && (
        <ul className="tips">
          {tips.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
      )}
      <p className="tiny">General educational guidance, not professional financial advice.</p>
    </section>
  );
}
