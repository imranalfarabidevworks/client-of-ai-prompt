"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { RiBookmarkFill, RiArrowRightLine, RiLoader4Line, RiDeleteBinLine } from "react-icons/ri";
import api from "@/lib/api";

const diffColor = {
  Beginner:     "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700",
  Intermediate: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-700",
  Pro:          "bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-700",
};

export default function SavedPromptsPage() {
  const [saved,   setSaved]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/users/bookmarks")
      .then((r) => setSaved(r.data))
      .catch(() => setSaved([]))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (id) => {
    try {
      await api.post(`/api/prompts/${id}/bookmark`);
      setSaved((p) => p.filter((x) => x._id?.toString() !== id));
      toast.success("Bookmark removed");
    } catch {
      setSaved((p) => p.filter((x) => x._id?.toString() !== id));
      toast.success("Bookmark removed");
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <RiLoader4Line className="text-3xl text-blue-500 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-2xl text-gray-900 dark:text-white mb-1">Saved Prompts</h1>
        <p className="text-gray-500 dark:text-slate-400 text-sm">{saved.length} bookmarked prompts</p>
      </div>

      {saved.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-12 text-center">
          <RiBookmarkFill className="text-4xl text-gray-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="font-bold text-lg text-gray-900 dark:text-white mb-2">No saved prompts</p>
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">Browse prompts and bookmark the ones you love.</p>
          <Link href="/prompts" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700">
            Browse Prompts <RiArrowRightLine />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {saved.map((p) => (
            <div key={p._id} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 flex flex-col gap-3 hover:shadow-lg transition-all">
              {p.thumbnail && (
                <img src={p.thumbnail} alt={p.title} className="w-full h-32 object-cover rounded-xl" onError={(e) => e.target.style.display='none'} />
              )}
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-800">{p.aiTool}</span>
                  {p.difficulty && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${diffColor[p.difficulty]}`}>{p.difficulty}</span>
                  )}
                </div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-2">{p.title}</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{p.category}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
                <span>⭐ {p.rating || "—"}</span>
                <span>· {p.copyCount?.toLocaleString() || 0} copies</span>
              </div>
              <div className="flex gap-2 mt-auto">
                <button onClick={() => handleRemove(p._id?.toString())}
                  className="flex items-center justify-center gap-1 flex-1 py-2 rounded-xl border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-300 text-xs font-semibold hover:border-rose-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  <RiDeleteBinLine /> Remove
                </button>
                <Link href={`/prompts/${p._id}`}
                  className="flex items-center justify-center gap-1 flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors">
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
