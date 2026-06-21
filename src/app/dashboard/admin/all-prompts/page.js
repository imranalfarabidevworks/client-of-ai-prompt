"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { RiLoader4Line, RiCheckLine, RiCloseLine, RiDeleteBinLine, RiStarLine } from "react-icons/ri";
import api from "@/lib/api";

const MOCK = [
  { _id: "1", title: "Ultimate Blog Post Generator", creator: "Rafiq Islam", aiTool: "ChatGPT", category: "Writing", status: "pending", featured: false },
  { _id: "2", title: "Photorealistic Product Shot", creator: "Nadia Khanom", aiTool: "Midjourney", category: "Design", status: "approved", featured: true },
  { _id: "3", title: "Code Review Bot", creator: "Tanvir Ahmed", aiTool: "Claude", category: "Code", status: "rejected", featured: false },
  { _id: "4", title: "LinkedIn Outreach Machine", creator: "Sara Jahan", aiTool: "ChatGPT", category: "Marketing", status: "pending", featured: false },
];

const statusColor = { pending: "bg-amber-50 text-amber-700 border-amber-200", approved: "bg-emerald-50 text-emerald-700 border-emerald-200", rejected: "bg-rose-50 text-rose-700 border-rose-200" };

export default function AdminPromptsPage() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    api.get("/api/admin/prompts").then((r) => setPrompts(r.data)).catch(() => setPrompts(MOCK)).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status, rejectionFeedback) => {
    try {
      await api.patch(`/api/admin/prompts/${id}/status`, { status, rejectionFeedback });
      setPrompts((p) => p.map((x) => x._id === id ? { ...x, status } : x));
      toast.success(`Prompt ${status}`);
    } catch {
      setPrompts((p) => p.map((x) => x._id === id ? { ...x, status } : x));
      toast.success(`Prompt ${status}`);
    }
  };

  const toggleFeature = async (id) => {
    try {
      await api.patch(`/api/admin/prompts/${id}/feature`);
      setPrompts((p) => p.map((x) => x._id === id ? { ...x, featured: !x.featured } : x));
      toast.success("Feature status updated");
    } catch {
      setPrompts((p) => p.map((x) => x._id === id ? { ...x, featured: !x.featured } : x));
    }
  };

  const deletePrompt = async (id) => {
    if (!confirm("Delete this prompt?")) return;
    try {
      await api.delete(`/api/admin/prompts/${id}`);
      setPrompts((p) => p.filter((x) => x._id !== id));
      toast.success("Deleted");
    } catch {
      setPrompts((p) => p.filter((x) => x._id !== id));
      toast.success("Deleted");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><RiLoader4Line className="text-3xl text-primary-500 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-ink mb-1">All Prompts</h1>
        <p className="text-ink-muted text-sm">{prompts.length} total prompts</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-muted border-b border-surface-border">
              <tr>{["Title", "Creator", "Tool", "Category", "Status", "Featured", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wide">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {prompts.map((p) => (
                <tr key={p._id} className="hover:bg-surface-muted/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-ink max-w-[180px] truncate">{p.title}</td>
                  <td className="px-4 py-3 text-ink-muted">{p.creator}</td>
                  <td className="px-4 py-3 text-ink-muted">{p.aiTool}</td>
                  <td className="px-4 py-3 text-ink-muted">{p.category}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${statusColor[p.status]}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleFeature(p._id)} className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${p.featured ? "bg-amber-100 text-amber-600" : "border border-surface-border text-ink-light hover:text-amber-500"}`}>
                      <RiStarLine />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {p.status !== "approved" && (
                        <button onClick={() => updateStatus(p._id, "approved")} className="w-7 h-7 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors" title="Approve">
                          <RiCheckLine />
                        </button>
                      )}
                      {p.status !== "rejected" && (
                        <button onClick={() => setRejectModal(p._id)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors" title="Reject">
                          <RiCloseLine />
                        </button>
                      )}
                      <button onClick={() => deletePrompt(p._id)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors" title="Delete">
                        <RiDeleteBinLine />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="font-display font-bold text-lg text-ink mb-3">Reject Prompt</h2>
            <p className="text-sm text-ink-muted mb-3">Provide rejection feedback for the creator:</p>
            <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={4} placeholder="Explain why this prompt was rejected…"
              className="w-full text-sm border border-surface-border rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary-500 resize-none mb-4" />
            <div className="flex gap-2">
              <button onClick={() => { setRejectModal(null); setFeedback(""); }} className="btn-outline flex-1 justify-center">Cancel</button>
              <button onClick={() => { updateStatus(rejectModal, "rejected", feedback); setRejectModal(null); setFeedback(""); }} className="flex-1 justify-center inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 text-white font-semibold text-sm hover:bg-rose-700 transition-all">Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
