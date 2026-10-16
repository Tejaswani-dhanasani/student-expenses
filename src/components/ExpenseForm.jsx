import { useEffect, useState } from "react";
import { CATEGORIES, todayISO } from "../data";

const empty = { name: "", amount: "", category: "Food", date: todayISO() };

export default function ExpenseForm({ editing, onSave, onCancel }) {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(editing ? { ...editing, amount: String(editing.amount) } : empty);
    setError("");
  }, [editing]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!form.name.trim()) return setError("Please enter an expense name.");
    if (!Number.isFinite(amount) || amount <= 0) return setError("Amount must be greater than 0.");
    if (!form.date) return setError("Please choose a date.");
    onSave({ ...form, name: form.name.trim(), amount });
    setForm({ ...empty, date: todayISO() });
    setError("");
  };

  return (
    <section className="card">
      <div className="card-head">
        <h2>{editing ? "Edit Expense" : "Add Expense"}</h2>
        {editing && (
          <button type="button" className="link" onClick={onCancel}>Cancel</button>
        )}
      </div>

      <form onSubmit={submit} className="form">
        <label>
          Expense name
          <input value={form.name} onChange={set("name")} placeholder="e.g. Coffee" />
        </label>

        <div className="row">
          <label>
            Amount (₹)
            <input type="number" min="0" step="any" value={form.amount} onChange={set("amount")} placeholder="80" />
          </label>
          <label>
            Date
            <input type="date" value={form.date} max={todayISO()} onChange={set("date")} />
          </label>
        </div>

        <div className="chips" role="radiogroup" aria-label="Category">
          {CATEGORIES.map((c) => (
            <button
              type="button"
              key={c.name}
              className={`chip ${form.category === c.name ? "active" : ""}`}
              style={form.category === c.name ? { background: c.color, borderColor: c.color } : {}}
              onClick={() => setForm({ ...form, category: c.name })}
            >
              {c.icon} {c.name}
            </button>
          ))}
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn primary">
          {editing ? "Save Changes" : "+ Add Expense"}
        </button>
      </form>
    </section>
  );
}
