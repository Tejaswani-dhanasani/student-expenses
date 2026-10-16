export const inr = (n) =>
  "₹" + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

export const prettyDate = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

export const sum = (list) => list.reduce((t, e) => t + e.amount, 0);

export const downloadCSV = (expenses) => {
  const rows = [["Date", "Name", "Category", "Amount"]].concat(
    expenses.map((e) => [e.date, `"${e.name.replace(/"/g, '""')}"`, e.category, e.amount])
  );
  const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "expenses.csv";
  a.click();
  URL.revokeObjectURL(url);
};
