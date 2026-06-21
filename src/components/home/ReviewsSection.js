"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { RiStarFill, RiDoubleQuotesL } from "react-icons/ri";

const REVIEWS = [
  { id: 1, name: "Abdullah Al Mamun", role: "Content Marketer", avatar: "AM", color: "bg-blue-600", rating: 5, comment: "PromptHive completely changed how I work. I find prompts in minutes instead of spending hours tweaking." },
  { id: 2, name: "Fariha Tasnim", role: "UX Designer", avatar: "FT", color: "bg-rose-500", rating: 5, comment: "I never expected a prompt marketplace to be this well designed. Clean UI, fast search, every prompt I've tried delivered results." },
  { id: 3, name: "Rezaul Karim", role: "Software Engineer", avatar: "RK", color: "bg-violet-600", rating: 5, comment: "The code review prompts for Claude are insane. I've shipped cleaner code just by running my PRs through the prompts here." },
  { id: 4, name: "Sumaiya Begum", role: "Freelance Writer", avatar: "SB", color: "bg-emerald-600", rating: 4, comment: "As a freelancer, time is money. The writing prompts here have halved the time I spend on first drafts." },
  { id: 5, name: "Hasibul Islam", role: "Startup Founder", avatar: "HI", color: "bg-amber-500", rating: 5, comment: "Used the LinkedIn outreach prompt for our B2B campaign and got a 34% reply rate. That's 3x our previous average." },
  { id: 6, name: "Tahsin Ahmed", role: "Digital Marketer", avatar: "TA", color: "bg-cyan-600", rating: 4, comment: "The platform is super intuitive, and the bookmarking system is genuinely useful. I have a whole library of go-to prompts now." },
];

export default function ReviewsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center mb-12">
          <span className="section-label mb-4"><RiStarFill /> User Reviews</span>
          <h2 className="font-bold text-3xl md:text-4xl text-gray-900 dark:text-white mt-3 mb-3">Loved by the community</h2>
          <p className="text-gray-500 dark:text-slate-400 text-base leading-relaxed max-w-xl mx-auto">Don't take our word for it. Here's what real users say about PromptHive.</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {REVIEWS.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.07 }}
              className="bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 flex flex-col gap-4 hover:shadow-lg transition-all duration-300">
              <RiDoubleQuotesL className="text-2xl text-blue-200 dark:text-blue-800" />
              <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed flex-1">{r.comment}</p>
              <div className="flex items-center gap-0.5 mb-1">
                {Array.from({ length: 5 }).map((_, i) => <RiStarFill key={i} className={`text-sm ${i < r.rating ? "text-amber-400" : "text-gray-200 dark:text-slate-700"}`} />)}
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-200 dark:border-slate-700">
                <div className={`w-9 h-9 rounded-full ${r.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>{r.avatar}</div>
                <div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white leading-none mb-0.5">{r.name}</p>
                  <p className="text-xs text-gray-400 dark:text-slate-500">{r.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
