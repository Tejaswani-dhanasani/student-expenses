export const CATEGORIES = [
  { name: "Food", color: "#f97316", icon: "🍔" },
  { name: "Transport", color: "#3b82f6", icon: "🚌" },
  { name: "Education", color: "#8b5cf6", icon: "📚" },
  { name: "Shopping", color: "#ec4899", icon: "🛍️" },
  { name: "Other", color: "#14b8a6", icon: "✨" },
];

export const catMeta = (name) =>
  CATEGORIES.find((c) => c.name === name) || CATEGORIES[CATEGORIES.length - 1];

export const DEFAULT_BUDGET = 5000;

const pad = (n) => String(n).padStart(2, "0");

// Local-time YYYY-MM-DD
export const toISO = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const todayISO = () => toISO(new Date());
export const currentMonthKey = () => todayISO().slice(0, 7);

// Sample dates always fall inside the current month so charts are populated.
const dayThisMonth = (daysAgo) => {
  const now = new Date();
  const day = Math.max(1, now.getDate() - daysAgo);
  return toISO(new Date(now.getFullYear(), now.getMonth(), day));
};

const prevMonth = (day) => {
  const now = new Date();
  return toISO(new Date(now.getFullYear(), now.getMonth() - 1, day));
};

export const SAMPLE_EXPENSES = [
  { id: 101, name: "Monthly groceries", amount: 1200, category: "Food", date: prevMonth(5) },
  { id: 102, name: "Textbooks", amount: 950, category: "Education", date: prevMonth(8) },
  { id: 103, name: "Metro card", amount: 400, category: "Transport", date: prevMonth(12) },
  { id: 104, name: "Shoes", amount: 1100, category: "Shopping", date: prevMonth(18) },
  { id: 105, name: "Birthday gift", amount: 350, category: "Other", date: prevMonth(22) },
  { id: 106, name: "Eating out", amount: 480, category: "Food", date: prevMonth(26) },
  { id: 1, name: "Lunch at canteen", amount: 150, category: "Food", date: dayThisMonth(0) },
  { id: 2, name: "Bus pass top-up", amount: 50, category: "Transport", date: dayThisMonth(1) },
  { id: 3, name: "Notebook & pens", amount: 120, category: "Education", date: dayThisMonth(1) },
  { id: 4, name: "Evening snacks", amount: 80, category: "Food", date: dayThisMonth(2) },
  { id: 5, name: "Online course", amount: 499, category: "Education", date: dayThisMonth(3) },
  { id: 6, name: "T-shirt", amount: 650, category: "Shopping", date: dayThisMonth(4) },
  { id: 7, name: "Auto fare", amount: 90, category: "Transport", date: dayThisMonth(5) },
  { id: 8, name: "Movie night", amount: 300, category: "Other", date: dayThisMonth(6) },
  { id: 9, name: "Groceries", amount: 420, category: "Food", date: dayThisMonth(7) },
  { id: 10, name: "Phone recharge", amount: 239, category: "Other", date: dayThisMonth(8) },
];
