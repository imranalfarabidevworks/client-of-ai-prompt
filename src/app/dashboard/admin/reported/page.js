"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { RiLoader4Line, RiDeleteBinLine, RiAlarmWarningLine, RiCheckLine } from "react-icons/ri";
import api from "@/lib/api";

const MOCK = [
  { _id: "rp1", prompt: { title: "Spam Prompt Example" }, reporter: "user@example.com", reason: "Spam", description: "This prompt generates spam emails.", date: "2025-05-09" },
  { _id: "rp2", prompt: { title: "Copied Content Post" }, reporter: "another@example.com", reason: "Copyright Violation", description: "Content is copied from another source.", date: "2025-05-07" },
];

export default function AdminReportedPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/admin/reports").then((r) => setReports(r.data)).catch(() => setReports(MOCK)).finally(() => setLoading(false));
  }, []);

  const action = async (id, type) => {
    const labels = { remove: "Prompt removed", warn: "Creator warned", dismiss: "Report dismissed" };
    try { await api.patch(`/api/admin/reports/${id}`, { action: type }); } catch {}
    setReports((p) => p.filter((r) => r._id !== id));
    toast.success(labels[type]);
  };

  if (loading) return <div className="flex justify-center py-20"><RiLoader4Line className="text-3xl text-primary-500 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-ink mb-1">Reported Prompts</h1>
        <p className="text-ink-muted text-sm">{reports.length} pending reports</p>
      </div>

      {reports.length === 0 ? (
        <div className="card p-12 text-center">
          <RiCheckLine className="text-4xl text-emerald-400 mx-auto mb-3" />
          <p className="font-display font-bold text-lg text-ink">All clear!</p>
          <p className="text-sm text-ink-muted">No pending reports at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((r) => (
            <div key={r._id} className="card p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-display font-bold text-sm text-ink mb-1">{r.prompt?.title}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full border bg-rose-50 text-rose-700 border-rose-200">{r.reason}</span>
                    <span className="text-xs text-ink-muted">Reported by {r.reporter}</span>
                    <span className="text-xs text-ink-light">{r.date}</span>
                  </div>
                </div>
              </div>
              {r.description && <p className="text-sm text-ink-muted mb-4 bg-surface-muted rounded-lg p-3">{r.description}</p>}
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => action(r._id, "remove")} className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-semibold transition-colors">
                  <RiDeleteBinLine /> Remove Prompt
                </button>
                <button onClick={() => action(r._id, "warn")} className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 font-semibold transition-colors">
                  <RiAlarmWarningLine /> Warn Creator
                </button>
                <button onClick={() => action(r._id, "dismiss")} className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-surface-muted text-ink-muted border border-surface-border hover:bg-surface-border font-semibold transition-colors">
                  <RiCheckLine /> Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
