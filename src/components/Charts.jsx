import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area, ReferenceLine,
} from "recharts";
import { CATEGORIES, toISO } from "../data";
import { inr, prettyDate, sum } from "../utils";

const tip = { borderRadius: 12, border: "none", boxShadow: "0 8px 24px rgba(0,0,0,.12)" };

export function CategoryChart({ expenses }) {
  const data = CATEGORIES.map((c) => ({
    name: c.name,
    value: sum(expenses.filter((e) => e.category === c.name)),
    color: c.color,
  })).filter((d) => d.value > 0);

  return (
    <section className="card">
      <div className="card-head"><h2>Spending by Category</h2></div>
      {data.length === 0 ? (
        <p className="muted center">No data yet.</p>
      ) : (
        <div className="chart">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={95} paddingAngle={3} stroke="none">
                {data.map((d) => <Cell key={d.name} fill={d.color} />)}
              </Pie>
              <Tooltip formatter={(v) => inr(v)} contentStyle={tip} />
              <Legend iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export function WeeklyChart({ expenses }) {
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = toISO(d);
    data.push({
      day: d.toLocaleDateString("en-IN", { weekday: "short" }),
      total: sum(expenses.filter((e) => e.date === iso)),
    });
  }

  return (
    <section className="card">
      <div className="card-head"><h2>Last 7 Days</h2></div>
      <div className="chart">
        <ResponsiveContainer>
          <BarChart data={data}>
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a5b4fc" />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#eef0f6" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} width={44} />
            <Tooltip formatter={(v) => inr(v)} cursor={{ fill: "#f4f5ff" }} contentStyle={tip} />
            <Bar dataKey="total" name="Spent" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export function TrendChart({ expenses, budget }) {
  const now = new Date();
  const days = now.getDate();
  const data = [];
  let running = 0;
  for (let d = 1; d <= days; d++) {
    const iso = toISO(new Date(now.getFullYear(), now.getMonth(), d));
    running += sum(expenses.filter((e) => e.date === iso));
    data.push({ date: iso, label: prettyDate(iso), cumulative: running });
  }

  return (
    <section className="card wide">
      <div className="card-head"><h2>Cumulative Spending vs Budget</h2></div>
      <div className="chart">
        <ResponsiveContainer>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#eef0f6" />
            <XAxis dataKey="label" axisLine={false} tickLine={false} interval="preserveStartEnd" />
            <YAxis axisLine={false} tickLine={false} width={50} domain={[0, (max) => Math.max(max, budget)]} />
            <Tooltip formatter={(v) => inr(v)} contentStyle={tip} />
            <ReferenceLine y={budget} stroke="#ef4444" strokeDasharray="6 4" label={{ value: "Budget", fill: "#ef4444", position: "insideTopRight" }} />
            <Area type="monotone" dataKey="cumulative" name="Spent so far" stroke="#6366f1" strokeWidth={3} fill="url(#areaGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
