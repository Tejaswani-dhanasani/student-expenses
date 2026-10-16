import { useEffect, useMemo, useState } from "react";
import { DEFAULT_BUDGET, SAMPLE_EXPENSES, currentMonthKey, toISO } from "./data";
import { sum } from "./utils";
import StatCards from "./components/StatCards";
import BudgetProgress from "./components/BudgetProgress";
import ExpenseForm from "./components/ExpenseForm";
import TransactionList from "./components/TransactionList";
import AIInsights from "./components/AIInsights";
import History from "./components/History";
import ManageMoney from "./components/ManageMoney";
import { CategoryChart, WeeklyChart, TrendChart } from "./components/Charts";

const load = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

const DEFAULT_CAT_BUDGETS = { Food: 1400, Transport: 600, Education: 800, Shopping: 600, Other: 600 };

const TABS = [
  { id: "dashboard", label: "📊 Dashboard" },
  { id: "history", label: "🕘 History" },
  { id: "manage", label: "💡 Manage Money" },
];

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [expenses, setExpenses] = useState(() => load("expenses", SAMPLE_EXPENSES));
  const [budget, setBudget] = useState(() => load("budget", DEFAULT_BUDGET));
  const [catBudgets, setCatBudgets] = useState(() => load("catBudgets", DEFAULT_CAT_BUDGETS));
  const [savingsGoal, setSavingsGoal] = useState(() => load("savingsGoal", 10000));
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState({ category: "All", range: "month" });

  useEffect(() => {
    try {
      localStorage.setItem("expenses", JSON.stringify(expenses));
      localStorage.setItem("budget", JSON.stringify(budget));
      localStorage.setItem("catBudgets", JSON.stringify(catBudgets));
      localStorage.setItem("savingsGoal", JSON.stringify(savingsGoal));
    } catch { /* storage unavailable */ }
  }, [expenses, budget, catBudgets, savingsGoal]);

  const monthKey = currentMonthKey();
  const monthExpenses = useMemo(() => expenses.filter((e) => e.date.startsWith(monthKey)), [expenses, monthKey]);
  const spent = sum(monthExpenses);

  const visible = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 6);
    const cutoffISO = toISO(cutoff);
    return expenses
      .filter((e) => filter.category === "All" || e.category === filter.category)
      .filter((e) =>
        filter.range === "all" ? true : filter.range === "7" ? e.date >= cutoffISO : e.date.startsWith(monthKey)
      )
      .sort((a, b) => (b.date === a.date ? b.id - a.id : b.date.localeCompare(a.date)));
  }, [expenses, filter, monthKey]);

  const saveExpense = (data) => {
    if (editing) {
      setExpenses((list) => list.map((e) => (e.id === editing.id ? { ...e, ...data } : e)));
      setEditing(null);
    } else {
      setExpenses((list) => [{ ...data, id: Date.now() }, ...list]);
    }
  };

  const deleteExpense = (id) => {
    if (!window.confirm("Delete this expense?")) return;
    setExpenses((list) => list.filter((e) => e.id !== id));
    if (editing?.id === id) setEditing(null);
  };

  // Editing always happens on the Dashboard form
  const startEdit = (e) => {
    setEditing(e);
    setTab("dashboard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const monthName = new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  return (
    <div className="app">
      <header className="hero">
        <div>
          <h1>💸 Student Expense Tracker</h1>
          <p>Track spending • Understand habits • Budget smarter</p>
        </div>
        <span className="month">{monthName}</span>
        <nav className="tabs">
          {TABS.map((t) => (
            <button key={t.id} className={`tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="container">
        {tab === "dashboard" && (
          <>
            <StatCards budget={budget} spent={spent} onBudgetChange={setBudget} />
            <div className="grid">
              <div className="col">
                <ExpenseForm editing={editing} onSave={saveExpense} onCancel={() => setEditing(null)} />
                <BudgetProgress budget={budget} spent={spent} />
                <AIInsights expenses={monthExpenses} budget={budget} />
              </div>
              <div className="col">
                <div className="charts">
                  <CategoryChart expenses={monthExpenses} />
                  <WeeklyChart expenses={expenses} />
                  <TrendChart expenses={monthExpenses} budget={budget} />
                </div>
                <TransactionList expenses={visible} filter={filter} onFilter={setFilter} onEdit={startEdit} onDelete={deleteExpense} />
              </div>
            </div>
          </>
        )}

        {tab === "history" && <History expenses={expenses} onEdit={startEdit} onDelete={deleteExpense} />}

        {tab === "manage" && (
          <ManageMoney
            monthExpenses={monthExpenses}
            budget={budget}
            catBudgets={catBudgets}
            onCatBudgets={setCatBudgets}
            savingsGoal={savingsGoal}
            onSavingsGoal={setSavingsGoal}
          />
        )}
      </main>

      <footer>Demo uses fictional data • Data is saved only in your browser</footer>
    </div>
  );
}
