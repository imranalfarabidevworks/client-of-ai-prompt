"use client";
import { useState, useEffect } from "react";
import { RiFileListLine, RiFileCopyLine, RiBookmarkLine, RiLoader4Line, RiLineChartLine } from "react-icons/ri";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, CartesianGrid, Legend,
} from "recharts";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const MOCK_STATS = { totalPrompts: 12, totalCopies: 4820, totalBookmarks: 312 };

const MOCK_BAR = [
  { name: "Blog Post Gen", bookmarks: 142, copies: 820 },
  { name: "Code Reviewer", bookmarks: 98, copies: 640 },
  { name: "LinkedIn Outreach", bookmarks: 210, copies: 1100 },
  { name: "Email Copywriter", bookmarks: 76, copies: 480 },
  { name: "SEO Meta Tags", bookmarks: 54, copies: 390 },
];

const MOCK_GROWTH = [
  { date: "2026-06-01", totalCopies: 120, totalPrompts: 3 },
  { date: "2026-06-03", totalCopies: 340, totalPrompts: 5 },
  { date: "2026-06-05", totalCopies: 680, totalPrompts: 7 },
  { date: "2026-06-07", totalCopies: 1200, totalPrompts: 9 },
  { date: "2026-06-10", totalCopies: 2100, totalPrompts: 10 },
  { date: "2026-06-13", totalCopies: 3400, totalPrompts: 11 },
  { date: "2026-06-15", totalCopies: 4820, totalPrompts: 12 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 shadow-lg text-xs">
        <p className="font-semibold text-gray-700 dark:text-slate-300 mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }} className="font-medium">
            {p.name === "totalCopies" ? "Total Copies" : "Total Prompts"} : {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function CreatorDashboardHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/creator/stats")
      .then((r) => setStats(r.data.stats))
      .catch(() => setStats(MOCK_STATS))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Total Prompts", value: stats?.totalPrompts ?? "—", icon: RiFileListLine, color: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400", border: "border-blue-100 dark:border-blue-800" },
    { label: "Total Copies", value: stats?.totalCopies?.toLocaleString() ?? "—", icon: RiFileCopyLine, color: "bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400", border: "border-violet-100 dark:border-violet-800" },
    { label: "Total Bookmarks", value: stats?.totalBookmarks ?? "—", icon: RiBookmarkLine, color: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400", border: "border-emerald-100 dark:border-emerald-800" },
  ];

  if (loading) return (
    <div className="flex justify-center py-20">
      <RiLoader4Line className="text-3xl text-blue-500 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-2xl text-gray-900 dark:text-white mb-1">Creator Dashboard</h1>
        <p className="text-gray-500 dark:text-slate-400 text-sm">Welcome back, {user?.name?.split(" ")[0]} 👋 — Here's your prompt performance.</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className={`bg-white dark:bg-slate-800 rounded-2xl border ${c.border} p-5 flex items-center gap-4`}>
            <span className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${c.color}`}>
              <c.icon />
            </span>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{c.value}</p>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bar Chart — Bookmarks vs Copies per prompt */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
        <h2 className="font-bold text-base text-gray-900 dark:text-white mb-1">Prompt Performance</h2>
        <p className="text-xs text-gray-400 dark:text-slate-500 mb-5">Bookmarks vs Copies per prompt</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={MOCK_BAR} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="bookmarks" name="Bookmarks" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            <Bar dataKey="copies" name="Copies" fill="#06b6d4" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Area Chart — Accumulative Growth Metrics */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-1">
          <RiLineChartLine className="text-blue-500 text-lg" />
          <h2 className="font-bold text-base text-gray-900 dark:text-white">Accumulative Growth Metrics</h2>
        </div>
        <p className="text-xs text-gray-400 dark:text-slate-500 mb-5">Cumulative copies and prompt count over time</p>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={MOCK_GROWTH}>
            <defs>
              <linearGradient id="copiesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="promptsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12 }}
              formatter={(value) => value === "totalCopies" ? "Total Copies" : "Total Prompts"}
            />
            <Area type="monotone" dataKey="totalCopies" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#copiesGrad)" dot={{ fill: "#8b5cf6", r: 4 }} activeDot={{ r: 6 }} />
            <Area type="monotone" dataKey="totalPrompts" stroke="#06b6d4" strokeWidth={2.5} fill="url(#promptsGrad)" dot={{ fill: "#06b6d4", r: 4 }} activeDot={{ r: 6 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
