"use client";
import { useState, useEffect } from "react";
import {
  RiTeamLine, RiFileListLine, RiStarLine, RiFileCopyLine,
  RiMoneyDollarCircleLine, RiLoader4Line,
} from "react-icons/ri";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid,
} from "recharts";
import api from "@/lib/api";

const MOCK_STATS = { users: 1248, prompts: 342, reviews: 3871, copies: 98420, revenue: 310 };

const ENGINE_DATA = [
  { engine: "Midjourney", copies: 18200, prompts: 42 },
  { engine: "ChatGPT",    copies: 19500, prompts: 98 },
  { engine: "Gemini",     copies: 14800, prompts: 61 },
  { engine: "Claude",     copies: 24100, prompts: 87 },
  { engine: "Stable D",   copies: 24600, prompts: 54 },
];

const PIE_DATA = [
  { name: "ChatGPT",    value: 98, color: "#06b6d4" },
  { name: "Claude",     value: 87, color: "#f59e0b" },
  { name: "Gemini",     value: 61, color: "#10b981" },
  { name: "Midjourney", value: 42, color: "#8b5cf6" },
  { name: "Stable D",   value: 54, color: "#ef4444" },
];

const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 shadow-lg text-xs">
        <p className="font-semibold text-gray-700 dark:text-slate-300 mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }} className="font-medium">{p.name}: {p.value.toLocaleString()}</p>
        ))}
      </div>
    );
  }
  return null;
};

const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/admin/stats")
      .then((r) => setStats(r.data.stats))
      .catch(() => setStats(MOCK_STATS))
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Total Users",   value: stats?.users?.toLocaleString(),   icon: RiTeamLine,                color: "from-blue-500 to-blue-600" },
    { label: "Total Prompts", value: stats?.prompts?.toLocaleString(),  icon: RiFileListLine,            color: "from-violet-500 to-violet-600" },
    { label: "Total Reviews", value: stats?.reviews?.toLocaleString(),  icon: RiStarLine,               color: "from-amber-500 to-amber-600" },
    { label: "Total Copies",  value: stats?.copies?.toLocaleString(),   icon: RiFileCopyLine,           color: "from-cyan-500 to-cyan-600" },
    { label: "Total Revenue", value: `$${((stats?.revenue || 0) * 5).toLocaleString()}.00`, icon: RiMoneyDollarCircleLine, color: "from-rose-500 to-rose-600" },
  ];

  if (loading) return (
    <div className="flex justify-center py-20">
      <RiLoader4Line className="text-3xl text-blue-500 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-2xl text-gray-900 dark:text-white mb-1">Administrative System Analytics</h1>
        <p className="text-gray-500 dark:text-slate-400 text-sm">Aggregate metrics and engine distribution breakdowns.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((c) => (
          <div key={c.label} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-4 flex flex-col gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white text-lg shrink-0`}>
              <c.icon />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 dark:text-slate-500">{c.label}</p>
              <p className="font-bold text-xl text-gray-900 dark:text-white mt-0.5">{c.value ?? "—"}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart — Engine Prompts Density vs Total Copies */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-1">
            <RiFileListLine className="text-gray-400 dark:text-slate-500" />
            <h2 className="font-bold text-sm text-gray-900 dark:text-white">Engine Prompts Density vs Total Copies</h2>
          </div>
          <p className="text-xs text-gray-400 dark:text-slate-500 mb-5">Copies and prompt count by AI engine</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={ENGINE_DATA} barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
              <XAxis dataKey="engine" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomBarTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
                iconType="circle"
                iconSize={8}
              />
              <Bar dataKey="copies" name="Copies" fill="#06b6d4" radius={[5, 5, 0, 0]} />
              <Bar dataKey="prompts" name="Prompts" fill="#8b5cf6" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart — Prompt Distribution Share */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-1">
            <RiFileCopyLine className="text-gray-400 dark:text-slate-500" />
            <h2 className="font-bold text-sm text-gray-900 dark:text-white">Prompt Distribution Share</h2>
          </div>
          <p className="text-xs text-gray-400 dark:text-slate-500 mb-3">Prompts by AI engine (% share)</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={PIE_DATA}
                cx="50%"
                cy="45%"
                innerRadius={65}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                labelLine={false}
                label={<CustomPieLabel />}
              >
                {PIE_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value, name) => [`${value} prompts`, name]}
                contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
        <h2 className="font-bold text-sm text-gray-900 dark:text-white mb-4">Platform Summary</h2>
        <div className="space-y-0">
          {[
            { label: "Total Users", value: stats?.users?.toLocaleString(), change: "+12% this month", up: true },
            { label: "Total Prompts", value: stats?.prompts?.toLocaleString(), change: "+63% this month", up: true },
            { label: "Total Reviews", value: stats?.reviews?.toLocaleString(), change: "+8% this month", up: true },
            { label: "Total Revenue", value: `$${((stats?.revenue || 0) * 5).toLocaleString()}.00`, change: "+24% this month", up: true },
          ].map((s, i, arr) => (
            <div key={s.label} className={`flex items-center justify-between py-3 ${i < arr.length - 1 ? "border-b border-gray-100 dark:border-slate-700" : ""}`}>
              <span className="text-sm text-gray-600 dark:text-slate-400">{s.label}</span>
              <div className="text-right">
                <p className="font-bold text-sm text-gray-900 dark:text-white">{s.value ?? "—"}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">{s.change}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
