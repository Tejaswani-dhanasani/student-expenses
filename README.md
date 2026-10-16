# AI-Powered Student Expense Tracker

React + Vite + Recharts dashboard based on the project documentation.

## Run
```bash
npm install
npm run dev     # open http://localhost:5173
npm run build   # production build
```

## Features (Milestones 1-2 + charts)
- Dashboard: budget (editable), total spent, remaining balance
- Add / edit / delete expenses with validation
- Category + date filters, CSV export
- Budget progress bar with warnings at 80% and 100%
- Charts: spending by category, last 7 days, cumulative spend vs budget
- AI Budget Assistant (preview, rule-based, runs locally)
- History tab: grouped by date, search, month and category filters, monthly overview chart
- Manage Money tab: daily allowance, category budgets, savings goal, money tips
- Data saved in browser localStorage

## Next steps
- Milestone 3: Supabase auth + database + Row Level Security
- Milestone 4: replace the local logic in `components/AIInsights.jsx` with a call to a
  server-side endpoint (never put AI API keys in React code)
