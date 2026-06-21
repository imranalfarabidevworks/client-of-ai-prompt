"use client";
import { useState, useEffect } from "react";
import { RiLoader4Line } from "react-icons/ri";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import api from "@/lib/api";

const COPIES = [
  { month: "Jan", copies: 4200 }, { month: "Feb", copies: 6800 }, { month: "Mar", copies: 5900 },
  { month: "Apr", copies: 8400 }, { month: "May", copies: 11200 }, { month: "Jun", copies: 9800 },
];
const GROWTH = [
  { month: "Jan", prompts: 40 }, { month: "Feb", prompts: 68 }, { month: "Mar", prompts: 95 },
  { month: "Apr", prompts: 140 }, { month: "May", prompts: 210 }, { month: "Jun", prompts: 342 },
];
const CATEGORIES = [
  { name: "Writing", value: 98 }, { name: "Code", value: 72 }, { name: "Design", value: 55 },
  { name: "Marketing", value: 67 }, { name: "Research", value: 31 }, { name: "Other", value: 19 },
];
const COLORS = ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#64748b"];

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-ink mb-1">Analytics</h1>
        <p className="text-ink-muted text-sm">Platform performance overview</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-display font-bold text-base text-ink mb-5">Monthly Copies</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={COPIES}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
              <Bar dataKey="copies" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h2 className="font-display font-bold text-base text-ink mb-5">Prompt Growth</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={GROWTH}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
              <Line type="monotone" dataKey="prompts" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: "#8b5cf6", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h2 className="font-display font-bold text-base text-ink mb-5">Prompts by Category</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={CATEGORIES} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                {CATEGORIES.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h2 className="font-display font-bold text-base text-ink mb-5">Summary</h2>
          <div className="space-y-3">
            {[
              { label: "Total Users", value: "1,248", change: "+12% this month" },
              { label: "Total Prompts", value: "342", change: "+63% this month" },
              { label: "Total Reviews", value: "3,871", change: "+8% this month" },
              { label: "Total Revenue", value: "$6,240", change: "+24% this month" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between py-2.5 border-b border-surface-border last:border-0">
                <span className="text-sm text-ink-muted">{s.label}</span>
                <div className="text-right">
                  <p className="font-display font-bold text-sm text-ink">{s.value}</p>
                  <p className="text-xs text-emerald-600">{s.change}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
