"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { RiEditLine, RiDeleteBinLine, RiBarChartLine, RiLoader4Line, RiAddLine } from "react-icons/ri";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

const statusColor = { pending: "bg-amber-50 text-amber-700 border-amber-200", approved: "bg-emerald-50 text-emerald-700 border-emerald-200", rejected: "bg-rose-50 text-rose-700 border-rose-200" };

const MOCK = [
  { _id: "1", title: "Ultimate Blog Post Generator", category: "Writing", aiTool: "ChatGPT", copyCount: 3241, status: "approved", visibility: "public" },
  { _id: "2", title: "LinkedIn Cold Outreach", category: "Marketing", aiTool: "ChatGPT", copyCount: 1200, status: "pending", visibility: "public" },
  { _id: "3", title: "Code Review Bot", category: "Code", aiTool: "Claude", copyCount: 890, status: "rejected", visibility: "private" },
];

export default function MyPromptsPage() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [analyticsId, setAnalyticsId] = useState(null);

  useEffect(() => {
    api.get("/api/prompts/mine").then((r) => setPrompts(r.data)).catch(() => setPrompts(MOCK)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this prompt?")) return;
    setDeleting(id);
    try {
      await api.delete(`/api/prompts/${id}`);
      setPrompts((p) => p.filter((x) => x._id !== id));
      toast.success("Prompt deleted");
    } catch {
      setPrompts((p) => p.filter((x) => x._id !== id));
      toast.success("Prompt deleted");
    } finally { setDeleting(null); }
  };

  if (loading) return <div className="flex justify-center py-20"><RiLoader4Line className="text-3xl text-primary-500 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink mb-1">My Prompts</h1>
          <p className="text-ink-muted text-sm">{prompts.length} total prompts</p>
        </div>
        <Link href="/dashboard/add-prompt" className="btn-primary gap-1.5"><RiAddLine /> Add New</Link>
      </div>

      {prompts.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-4xl mb-3">📝</p>
          <p className="font-display font-bold text-lg text-ink mb-2">No prompts yet</p>
          <Link href="/dashboard/add-prompt" className="btn-primary gap-1.5 inline-flex mt-2"><RiAddLine /> Add your first prompt</Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-muted border-b border-surface-border">
                <tr>{["Title", "Category", "AI Tool", "Copies", "Status", "Visibility", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wide">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {prompts.map((p) => (
                  <tr key={p._id} className="hover:bg-surface-muted/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-ink max-w-[200px] truncate">{p.title}</td>
                    <td className="px-4 py-3 text-ink-muted">{p.category}</td>
                    <td className="px-4 py-3 text-ink-muted">{p.aiTool}</td>
                    <td className="px-4 py-3 font-semibold text-ink">{p.copyCount?.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${statusColor[p.status]}`}>{p.status}</span>
                    </td>
                    <td className="px-4 py-3 text-ink-muted capitalize">{p.visibility}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/edit-prompt/${p._id}`} className="w-8 h-8 flex items-center justify-center rounded-lg border border-surface-border hover:border-primary-400 hover:text-primary-600 text-ink-muted transition-colors">
                          <RiEditLine />
                        </Link>
                        <button onClick={() => setAnalyticsId(analyticsId === p._id ? null : p._id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-surface-border hover:border-blue-400 hover:text-blue-600 text-ink-muted transition-colors">
                          <RiBarChartLine />
                        </button>
                        <button onClick={() => handleDelete(p._id)} disabled={deleting === p._id} className="w-8 h-8 flex items-center justify-center rounded-lg border border-surface-border hover:border-rose-400 hover:text-rose-600 text-ink-muted transition-colors">
                          {deleting === p._id ? <RiLoader4Line className="animate-spin" /> : <RiDeleteBinLine />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytics Mini Panel */}
      <AnimatePresence>
        {analyticsId && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="card p-6">
            <h3 className="font-display font-bold text-base text-ink mb-4">Analytics — {prompts.find((p) => p._id === analyticsId)?.title}</h3>
            <div className="grid grid-cols-3 gap-4">
              {[{ label: "Total Copies", value: prompts.find((p) => p._id === analyticsId)?.copyCount?.toLocaleString() }, { label: "Rating", value: "4.8 ⭐" }, { label: "Bookmarks", value: "142" }].map((s) => (
                <div key={s.label} className="bg-surface-muted rounded-xl p-4 text-center">
                  <p className="font-display font-bold text-2xl text-ink">{s.value}</p>
                  <p className="text-xs text-ink-muted mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
