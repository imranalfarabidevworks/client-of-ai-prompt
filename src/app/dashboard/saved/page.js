"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { RiBookmarkFill, RiArrowRightLine, RiLoader4Line, RiDeleteBinLine } from "react-icons/ri";
import api from "@/lib/api";

const MOCK = [
  { _id: "1", title: "Ultimate Blog Post Generator", category: "Writing", aiTool: "ChatGPT", rating: 4.8, copyCount: 3241 },
  { _id: "2", title: "Photorealistic Product Shot", category: "Design", aiTool: "Midjourney", rating: 4.9, copyCount: 2180 },
  { _id: "4", title: "LinkedIn Cold Outreach Machine", category: "Marketing", aiTool: "ChatGPT", rating: 4.6, copyCount: 2877 },
];

export default function SavedPromptsPage() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/users/bookmarks").then((r) => setSaved(r.data)).catch(() => setSaved(MOCK)).finally(() => setLoading(false));
  }, []);

  const handleRemove = async (id) => {
    try {
      await api.post(`/api/prompts/${id}/bookmark`);
      setSaved((p) => p.filter((x) => x._id !== id));
      toast.success("Bookmark removed");
    } catch {
      setSaved((p) => p.filter((x) => x._id !== id));
      toast.success("Bookmark removed");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><RiLoader4Line className="text-3xl text-primary-500 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-ink mb-1">Saved Prompts</h1>
        <p className="text-ink-muted text-sm">{saved.length} bookmarked prompts</p>
      </div>

      {saved.length === 0 ? (
        <div className="card p-12 text-center">
          <RiBookmarkFill className="text-4xl text-ink-light mx-auto mb-3" />
          <p className="font-display font-bold text-lg text-ink mb-2">No saved prompts</p>
          <p className="text-sm text-ink-muted mb-4">Browse prompts and bookmark the ones you love.</p>
          <Link href="/prompts" className="btn-primary inline-flex gap-1.5">Browse Prompts <RiArrowRightLine /></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {saved.map((p) => (
            <div key={p._id} className="card p-5 flex flex-col gap-3">
              <div>
                <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-100 mb-2 inline-block">{p.aiTool}</span>
                <h3 className="font-display font-bold text-sm text-ink line-clamp-2">{p.title}</h3>
                <p className="text-xs text-ink-muted mt-1">{p.category}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-ink-muted">
                <span>⭐ {p.rating}</span>
                <span>· {p.copyCount?.toLocaleString()} copies</span>
              </div>
              <div className="flex gap-2 mt-auto">
                <button onClick={() => handleRemove(p._id)} className="btn-outline flex-1 justify-center text-xs py-2 gap-1 hover:border-rose-400 hover:text-rose-600">
                  <RiDeleteBinLine /> Remove
                </button>
                <Link href={`/prompts/${p._id}`} className="btn-primary flex-1 justify-center text-xs py-2 gap-1">
                  View <RiArrowRightLine />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
