"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { RiLoader4Line, RiDeleteBinLine, RiBarChartLine, RiAddLine, RiEditLine, RiCloseLine, RiSaveLine } from "react-icons/ri";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

const statusColor = {
  pending:  "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-700",
  approved: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700",
  rejected: "bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-700",
};

const MOCK = [
  { _id: "1", title: "Ultimate Blog Post Generator", category: "Writing",  aiTool: "ChatGPT", copyCount: 3241, status: "approved", visibility: "public" },
  { _id: "2", title: "LinkedIn Cold Outreach",       category: "Marketing",aiTool: "ChatGPT", copyCount: 1200, status: "pending",  visibility: "public" },
  { _id: "3", title: "Code Review Bot",              category: "Code",     aiTool: "Claude",  copyCount: 890,  status: "rejected", visibility: "private" },
];

const CATEGORIES = ["Writing","Code","Design","Marketing","Research","Education","Business","SEO"];
const AI_TOOLS   = ["ChatGPT","Gemini","Claude","Midjourney","Dall-E","Copilot"];

export default function MyPromptsPage() {
  const [prompts,      setPrompts]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [deleting,     setDeleting]     = useState(null);
  const [analyticsId,  setAnalyticsId]  = useState(null);
  const [editPrompt,   setEditPrompt]   = useState(null); // editing prompt
  const [saving,       setSaving]       = useState(false);

  useEffect(() => {
    api.get("/api/prompts/mine")
      .then((r) => setPrompts(r.data))
      .catch(() => setPrompts(MOCK))
      .finally(() => setLoading(false));
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

  const handleEdit = (prompt) => {
    setEditPrompt({ ...prompt }); // copy করো
  };

  const handleSaveEdit = async () => {
    if (!editPrompt.title?.trim()) return toast.error("Title required");
    setSaving(true);
    try {
      await api.put(`/api/prompts/${editPrompt._id}`, editPrompt);
      setPrompts((p) => p.map((x) => x._id === editPrompt._id ? { ...x, ...editPrompt } : x));
      toast.success("Prompt updated!");
      setEditPrompt(null);
    } catch {
      toast.error("Update failed");
    } finally { setSaving(false); }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <RiLoader4Line className="text-3xl text-blue-500 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl text-gray-900 dark:text-white mb-1">My Prompts</h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm">{prompts.length} total prompts</p>
        </div>
        <Link href="/dashboard/add-prompt" className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
          <RiAddLine /> Add New
        </Link>
      </div>

      {prompts.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-12 text-center">
          <p className="text-4xl mb-3">📝</p>
          <p className="font-bold text-lg text-gray-900 dark:text-white mb-2">No prompts yet</p>
          <Link href="/dashboard/add-prompt" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 mt-2">
            <RiAddLine /> Add your first prompt
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
                <tr>
                  {["Title","Category","AI Tool","Copies","Status","Visibility","Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {prompts.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white max-w-[180px] truncate">{p.title}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-slate-400">{p.category}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-slate-400">{p.aiTool}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{p.copyCount?.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${statusColor[p.status]}`}>{p.status}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-slate-400 capitalize">{p.visibility}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {/* Edit button */}
                        <button onClick={() => handleEdit(p)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-slate-600 text-gray-500 dark:text-slate-400 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="Edit">
                          <RiEditLine />
                        </button>
                        {/* Analytics */}
                        <button onClick={() => setAnalyticsId(analyticsId === p._id ? null : p._id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-slate-600 text-gray-500 dark:text-slate-400 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="Analytics">
                          <RiBarChartLine />
                        </button>
                        {/* Delete */}
                        <button onClick={() => handleDelete(p._id)} disabled={deleting === p._id}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-slate-600 text-gray-500 dark:text-slate-400 hover:border-rose-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                          title="Delete">
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

      {/* Analytics Panel */}
      <AnimatePresence>
        {analyticsId && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
            <h3 className="font-bold text-base text-gray-900 dark:text-white mb-4">
              Analytics — {prompts.find((p) => p._id === analyticsId)?.title}
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Copies",   value: prompts.find((p) => p._id === analyticsId)?.copyCount?.toLocaleString() },
                { label: "Rating",         value: "4.8 ⭐" },
                { label: "Bookmarks",      value: "142" },
              ].map((s) => (
                <div key={s.label} className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4 text-center">
                  <p className="font-bold text-2xl text-gray-900 dark:text-white">{s.value}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editPrompt && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 w-full max-w-lg shadow-xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <RiEditLine className="text-blue-500" /> Edit Prompt
                </h2>
                <button onClick={() => setEditPrompt(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400">
                  <RiCloseLine />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Title</label>
                  <input value={editPrompt.title || ""} onChange={(e) => setEditPrompt((p) => ({ ...p, title: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Description</label>
                  <textarea value={editPrompt.description || ""} onChange={(e) => setEditPrompt((p) => ({ ...p, description: e.target.value }))} rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Category</label>
                    <select value={editPrompt.category || ""} onChange={(e) => setEditPrompt((p) => ({ ...p, category: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">AI Tool</label>
                    <select value={editPrompt.aiTool || ""} onChange={(e) => setEditPrompt((p) => ({ ...p, aiTool: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {AI_TOOLS.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Visibility</label>
                  <select value={editPrompt.visibility || "public"} onChange={(e) => setEditPrompt((p) => ({ ...p, visibility: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="public">Public</option>
                    <option value="private">Private (Premium)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 mt-5">
                <button onClick={() => setEditPrompt(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 text-sm font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  Cancel
                </button>
                <button onClick={handleSaveEdit} disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60">
                  {saving ? <><RiLoader4Line className="animate-spin" /> Saving…</> : <><RiSaveLine /> Save Changes</>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
