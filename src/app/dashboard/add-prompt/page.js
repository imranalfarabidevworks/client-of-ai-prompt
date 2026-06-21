"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { RiUploadCloud2Line, RiLoader4Line } from "react-icons/ri";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const CATEGORIES = ["Writing", "Code", "Design", "Marketing", "Research", "Education", "Business", "SEO"];
const AI_TOOLS = ["ChatGPT", "Gemini", "Claude", "Midjourney", "Dall-E", "Copilot"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Pro"];

export default function AddPromptPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", promptContent: "", category: "Writing",
    aiTool: "ChatGPT", tags: "", difficulty: "Beginner",
    thumbnailUrl: "", visibility: "public",
  });

  const up = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.promptContent) return toast.error("Title and prompt content are required");
    setLoading(true);
    try {
      const payload = { ...form, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean), copyCount: 0, status: "pending" };
      await api.post("/api/prompts", payload);
      toast.success("Prompt submitted for review!");
      router.push("/dashboard/my-prompts");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  const field = (label, key, type = "text", placeholder = "") => (
    <div>
      <label className="block text-sm font-medium text-ink mb-1.5">{label}</label>
      <input type={type} value={form[key]} onChange={(e) => up(key, e.target.value)} placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl border border-surface-border text-sm text-ink placeholder-ink-light focus:outline-none focus:ring-2 focus:ring-primary-500 transition" />
    </div>
  );

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-ink mb-1">Add New Prompt</h1>
        <p className="text-ink-muted text-sm">Submitted prompts are reviewed by admins before going live.</p>
        {user?.role === "user" && <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-2">Free users can submit up to 3 prompts.</p>}
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        {field("Prompt Title *", "title", "text", "e.g. Ultimate Blog Post Generator")}
        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">Description *</label>
          <textarea value={form.description} onChange={(e) => up("description", e.target.value)} rows={3} placeholder="Briefly describe what this prompt does…"
            className="w-full px-4 py-2.5 rounded-xl border border-surface-border text-sm text-ink placeholder-ink-light focus:outline-none focus:ring-2 focus:ring-primary-500 transition resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">Prompt Content *</label>
          <textarea value={form.promptContent} onChange={(e) => up("promptContent", e.target.value)} rows={7} placeholder="Paste your full prompt here…"
            className="w-full px-4 py-2.5 rounded-xl border border-surface-border text-sm font-mono text-ink placeholder-ink-light focus:outline-none focus:ring-2 focus:ring-primary-500 transition resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Category</label>
            <select value={form.category} onChange={(e) => up("category", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-surface-border text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">AI Tool</label>
            <select value={form.aiTool} onChange={(e) => up("aiTool", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-surface-border text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500">
              {AI_TOOLS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Difficulty</label>
            <select value={form.difficulty} onChange={(e) => up("difficulty", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-surface-border text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500">
              {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Visibility</label>
            <select value={form.visibility} onChange={(e) => up("visibility", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-surface-border text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="public">Public</option>
              <option value="private">Private (Premium)</option>
            </select>
          </div>
        </div>

        {field("Tags (comma separated)", "tags", "text", "SEO, Blog, Writing")}
        {field("Thumbnail Image URL", "thumbnailUrl", "url", "https://i.ibb.co/…")}

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 gap-2">
          {loading ? <><RiLoader4Line className="animate-spin" /> Submitting…</> : <><RiUploadCloud2Line /> Submit for Review</>}
        </button>
      </form>
    </div>
  );
}
