"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { RiStarFill, RiLoader4Line } from "react-icons/ri";
import api from "@/lib/api";

const MOCK = [
  { _id: "r1", prompt: { _id: "1", title: "Ultimate Blog Post Generator" }, rating: 5, comment: "Absolutely brilliant. My blog traffic doubled.", date: "2025-05-10" },
  { _id: "r2", prompt: { _id: "3", title: "Full-Stack Code Reviewer" }, rating: 4, comment: "Really solid structure. Saves me 2 hours per post.", date: "2025-05-08" },
];

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/users/reviews").then((r) => setReviews(r.data)).catch(() => setReviews(MOCK)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><RiLoader4Line className="text-3xl text-primary-500 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-ink mb-1">My Reviews</h1>
        <p className="text-ink-muted text-sm">{reviews.length} reviews submitted</p>
      </div>

      {reviews.length === 0 ? (
        <div className="card p-12 text-center">
          <RiStarFill className="text-4xl text-ink-light mx-auto mb-3" />
          <p className="font-display font-bold text-lg text-ink mb-2">No reviews yet</p>
          <p className="text-sm text-ink-muted">Try some prompts and leave a review!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r._id} className="card p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <Link href={`/prompts/${r.prompt?._id}`} className="font-display font-bold text-sm text-ink hover:text-primary-600 transition-colors">
                  {r.prompt?.title}
                </Link>
                <span className="text-xs text-ink-light shrink-0">{r.date}</span>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <RiStarFill key={i} className={`text-sm ${i < r.rating ? "text-amber-400" : "text-surface-border"}`} />
                ))}
              </div>
              <p className="text-sm text-ink-muted">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
