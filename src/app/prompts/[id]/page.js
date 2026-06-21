"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  RiFileCopyLine, RiBookmarkLine, RiBookmarkFill, RiFlagLine,
  RiStarFill, RiStarLine, RiLockFill, RiArrowLeftLine,
  RiLoader4Line, RiShieldLine, RiUserLine, RiCheckLine,
} from "react-icons/ri";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

const MOCK = {
  _id: "1", title: "Ultimate Blog Post Generator",
  description: "Generate SEO-optimised, engaging blog posts with proper structure, headings, and call-to-action in any niche. Works best with GPT-4.",
  promptContent: `You are an expert SEO content writer. Write a comprehensive blog post about [TOPIC] following these guidelines:

1. **Title**: Create an engaging, keyword-rich H1 title
2. **Introduction** (150 words): Hook the reader with a compelling opening
3. **Main Sections** (3-5 H2 headings with 200-300 words each)
4. **Key Takeaways**: Bullet list of 5 main points
5. **Conclusion**: Summarise and include a clear CTA

Target keyword: [KEYWORD]
Tone: [professional/casual/conversational]
Word count: [800-1200]`,
  category: "Writing", aiTool: "ChatGPT", tags: ["SEO", "Content", "Blog"],
  difficulty: "Beginner", copyCount: 3241, rating: 4.8, reviewCount: 124,
  visibility: "public",
  usageInstructions: "Replace [TOPIC], [KEYWORD], and [TONE] with your specific values. Works best with GPT-4.",
  creator: { name: "Rafiq Islam", avatar: "RI", email: "rafiq@example.com", totalPrompts: 34 },
  reviews: [
    { _id: "r1", user: { name: "Fariha T.", avatar: "FT" }, userEmail: "fariha@example.com", rating: 5, comment: "Absolutely brilliant. My blog traffic doubled in a month.", date: "2025-05-10" },
    { _id: "r2", user: { name: "Rezaul K.", avatar: "RK" }, userEmail: "rezaul@example.com", rating: 4, comment: "Really solid structure. Saves me 2 hours per post.", date: "2025-05-08" },
  ],
};

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button key={s} type="button" onMouseEnter={() => setHovered(s)} onMouseLeave={() => setHovered(0)} onClick={() => onChange(s)}>
          {s <= (hovered || value)
            ? <RiStarFill className="text-amber-400 text-xl" />
            : <RiStarLine className="text-gray-300 dark:text-slate-600 text-xl" />}
        </button>
      ))}
    </div>
  );
}

export default function PromptDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [copyCount, setCopyCount] = useState(0);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const [review, setReview] = useState({ rating: 0, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    api.get(`/api/prompts/${id}`)
      .then((r) => { setPrompt(r.data); setCopyCount(r.data.copyCount || 0); })
      .catch(() => { setPrompt(MOCK); setCopyCount(MOCK.copyCount); })
      .finally(() => setLoading(false));
  }, [id]);

  // Is this premium-locked?
  const isPremiumLocked = prompt?.visibility === "private" && !user?.isPremium;

  // Can the user interact? Must be logged in AND not locked
  const canInteract = !!user && !isPremiumLocked;

  const handleCopy = async () => {
    if (!user) return toast.error("Please login first");
    if (isPremiumLocked) return toast.error("Subscribe to Premium to copy this prompt");
    await navigator.clipboard.writeText(prompt.promptContent).catch(() => {});
    api.patch(`/api/prompts/${id}/copy`).catch(() => {});
    setCopyCount((c) => c + 1);
    toast.success("Prompt copied to clipboard! ✅");
  };

  const handleBookmark = async () => {
    if (!user) return toast.error("Please login first");
    try {
      await api.post(`/api/prompts/${id}/bookmark`);
      setBookmarked((b) => !b);
      toast.success(bookmarked ? "Bookmark removed" : "Prompt bookmarked! 🔖");
    } catch {
      setBookmarked((b) => !b);
      toast.success(bookmarked ? "Bookmark removed" : "Prompt bookmarked! 🔖");
    }
  };

  const handleReport = async () => {
    if (!reportReason) return toast.error("Select a reason");
    try {
      await api.post(`/api/prompts/${id}/report`, { reason: reportReason, description: reportDesc });
    } catch {}
    toast.success("Report submitted. Thank you!");
    setReportOpen(false);
    setReportReason("");
    setReportDesc("");
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login first");
    if (!canInteract) return toast.error("You need premium access to review this prompt");
    if (review.rating === 0) return toast.error("Please select a rating");
    if (!review.comment.trim()) return toast.error("Please write a comment");
    setSubmittingReview(true);
    try {
      await api.post(`/api/prompts/${id}/review`, review);
      toast.success("Review submitted! ⭐");
      setReview({ rating: 0, comment: "" });
      // Add review to local state
      setPrompt((p) => ({
        ...p,
        reviews: [{
          _id: Date.now(),
          user: { name: user.name, avatar: user.name?.[0]?.toUpperCase() },
          userEmail: user.email,
          rating: review.rating,
          comment: review.comment,
          date: new Date().toISOString().split("T")[0],
        }, ...(p.reviews || [])],
        reviewCount: (p.reviewCount || 0) + 1,
      }));
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <RiLoader4Line className="text-3xl text-blue-500 animate-spin" />
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
            <RiArrowLeftLine /> Back to prompts
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main */}
            <div className="lg:col-span-2 space-y-5">
              {/* Header */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800">{prompt.aiTool}</span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-600">{prompt.category}</span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-600">{prompt.difficulty}</span>
                  {prompt.visibility === "private" && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                      <RiLockFill className="text-xs" /> Premium
                    </span>
                  )}
                </div>
                <h1 className="font-bold text-2xl text-gray-900 dark:text-white mb-3">{prompt.title}</h1>
                <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed mb-4">{prompt.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {prompt.tags?.map((t) => <span key={t} className="tag-pill">{t}</span>)}
                </div>
              </motion.div>

              {/* Prompt Content */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
                <h2 className="font-bold text-base text-gray-900 dark:text-white mb-4">Prompt Content</h2>

                {!user ? (
                  // Not logged in
                  <div className="relative">
                    <div className="blur-sm select-none pointer-events-none bg-gray-50 dark:bg-slate-900 rounded-xl p-4 font-mono text-sm text-gray-400 leading-relaxed line-clamp-4">
                      You are an expert SEO content writer. Write a comprehensive blog post about [TOPIC]... Replace [TOPIC], [KEYWORD], and [TONE] with your specific values.
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl">
                      <RiLockFill className="text-3xl text-blue-500 mb-3" />
                      <p className="font-bold text-base text-gray-900 dark:text-white mb-1">Login Required</p>
                      <p className="text-sm text-gray-500 dark:text-slate-400 mb-4 text-center max-w-xs">Please login to view and copy this prompt.</p>
                      <Link href="/login" className="btn-primary gap-1.5">Login to View</Link>
                    </div>
                  </div>
                ) : isPremiumLocked ? (
                  // Logged in but needs premium
                  <div className="relative">
                    <div className="blur-sm select-none pointer-events-none bg-gray-50 dark:bg-slate-900 rounded-xl p-4 font-mono text-sm text-gray-400 leading-relaxed line-clamp-4">
                      You are an expert SEO content writer. Write a comprehensive blog post about [TOPIC]... Replace [TOPIC], [KEYWORD], and [TONE] with your specific values.
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl">
                      <RiLockFill className="text-3xl text-amber-500 mb-3" />
                      <p className="font-bold text-base text-gray-900 dark:text-white mb-1">Premium Content 🔒</p>
                      <p className="text-sm text-gray-500 dark:text-slate-400 mb-4 text-center max-w-xs">Subscribe to Premium for $5 to unlock this prompt and all private prompts.</p>
                      <Link href="/payment" className="btn-primary gap-1.5">Unlock Premium — $5</Link>
                    </div>
                  </div>
                ) : (
                  // Full access
                  <div className="bg-gray-900 dark:bg-slate-950 rounded-xl p-4 relative group">
                    <pre className="font-mono text-sm text-green-400 leading-relaxed whitespace-pre-wrap overflow-x-auto">{prompt.promptContent}</pre>
                    <button onClick={handleCopy} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1">
                      <RiFileCopyLine /> Copy
                    </button>
                  </div>
                )}
              </motion.div>

              {/* Usage Instructions */}
              {prompt.usageInstructions && canInteract && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
                  <h2 className="font-bold text-base text-gray-900 dark:text-white mb-3">Usage Instructions</h2>
                  <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">{prompt.usageInstructions}</p>
                </div>
              )}

              {/* Reviews */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
                <h2 className="font-bold text-base text-gray-900 dark:text-white mb-5">Reviews ({prompt.reviewCount || 0})</h2>

                {/* Reviews list */}
                <div className="space-y-4 mb-6">
                  {prompt.reviews?.length > 0 ? prompt.reviews.map((r) => (
                    <div key={r._id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {r.user?.avatar || r.user?.name?.[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{r.user?.name}</span>
                          <span className="text-xs text-gray-400 dark:text-slate-500">{r.userEmail}</span>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: r.rating }).map((_, i) => <RiStarFill key={i} className="text-amber-400 text-xs" />)}
                          </div>
                          <span className="text-xs text-gray-400">{r.date}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-slate-400">{r.comment}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-sm text-gray-400 dark:text-slate-500">No reviews yet. Be the first to review!</p>
                  )}
                </div>

                {/* Write Review */}
                {canInteract ? (
                  <form onSubmit={handleReview} className="pt-5 border-t border-gray-100 dark:border-slate-700 space-y-3">
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Write a Review</h3>
                    <StarPicker value={review.rating} onChange={(r) => setReview((p) => ({ ...p, rating: r }))} />
                    <textarea
                      value={review.comment}
                      onChange={(e) => setReview((p) => ({ ...p, comment: e.target.value }))}
                      placeholder="Share your experience with this prompt…"
                      rows={3}
                      className="w-full text-sm text-gray-900 dark:text-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder-gray-400"
                    />
                    <button type="submit" disabled={submittingReview} className="btn-primary text-sm gap-2">
                      {submittingReview ? <><RiLoader4Line className="animate-spin" /> Submitting…</> : "Submit Review"}
                    </button>
                  </form>
                ) : !user ? (
                  <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      <Link href="/login" className="text-blue-600 hover:underline font-semibold">Login</Link> to write a review.
                    </p>
                  </div>
                ) : isPremiumLocked ? (
                  <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      <Link href="/payment" className="text-blue-600 hover:underline font-semibold">Upgrade to Premium</Link> to review this prompt.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-slate-400">Rating</span>
                  <span className="flex items-center gap-1 font-semibold text-gray-900 dark:text-white"><RiStarFill className="text-amber-400" />{prompt.rating} ({prompt.reviewCount})</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-slate-400">Copies</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{copyCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-slate-400">Difficulty</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{prompt.difficulty}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-slate-400">Access</span>
                  <span className={`font-semibold ${isPremiumLocked ? "text-amber-600" : "text-green-600"}`}>
                    {!user ? "Login Required" : isPremiumLocked ? "Premium 🔒" : "Full Access ✅"}
                  </span>
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t border-gray-100 dark:border-slate-700">
                  <button onClick={handleCopy} className="btn-primary w-full justify-center gap-1.5">
                    <RiFileCopyLine /> Copy Prompt
                  </button>
                  <button onClick={handleBookmark} className="btn-outline w-full justify-center gap-1.5">
                    {bookmarked ? <><RiBookmarkFill className="text-blue-600" /> Saved</> : <><RiBookmarkLine /> Bookmark</>}
                  </button>
                  {user && (
                    <button onClick={() => setReportOpen(true)} className="w-full flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors py-1.5">
                      <RiFlagLine /> Report prompt
                    </button>
                  )}
                </div>
              </div>

              {/* Creator */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-4 flex items-center gap-1.5">
                  <RiUserLine className="text-blue-500" /> Creator
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">{prompt.creator?.avatar}</div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{prompt.creator?.name}</p>
                    <p className="text-xs text-gray-400 dark:text-slate-500">{prompt.creator?.totalPrompts} prompts</p>
                  </div>
                </div>
              </div>

              {/* Premium upsell */}
              {user && isPremiumLocked && (
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-5 text-white">
                  <p className="font-bold text-sm mb-1">Unlock Premium ✨</p>
                  <p className="text-blue-100 text-xs mb-4">Get full access to all private prompts, unlimited copies, and more.</p>
                  <Link href="/payment" className="block w-full text-center bg-white text-blue-700 font-bold text-sm py-2.5 rounded-xl hover:bg-blue-50 transition-colors">
                    Upgrade for $5
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Report Modal */}
      {reportOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-200 dark:border-slate-700">
            <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <RiShieldLine className="text-red-500" /> Report Prompt
            </h2>
            <div className="space-y-2 mb-4">
              {["Inappropriate Content", "Spam", "Copyright Violation", "Misleading", "Other"].map((r) => (
                <label key={r} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700">
                  <input type="radio" name="reason" value={r} onChange={() => setReportReason(r)} className="accent-blue-600" />
                  <span className="text-sm text-gray-700 dark:text-slate-300">{r}</span>
                </label>
              ))}
            </div>
            <textarea value={reportDesc} onChange={(e) => setReportDesc(e.target.value)} placeholder="Additional details (optional)…" rows={3}
              className="w-full text-sm border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-4" />
            <div className="flex gap-2">
              <button onClick={() => setReportOpen(false)} className="btn-outline flex-1 justify-center">Cancel</button>
              <button onClick={handleReport} className="btn-primary flex-1 justify-center">Submit Report</button>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </>
  );
}
