"use client";
import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { RiFileCopyLine, RiBookmarkLine, RiStarFill, RiArrowRightLine, RiFlashlightFill, RiLockFill } from "react-icons/ri";
import { useAuth } from "@/context/AuthContext";

const FEATURED = [
  { _id: "1", title: "Ultimate Blog Post Generator", description: "Generate SEO-optimised, engaging blog posts with proper structure, headings, and CTA in any niche.", category: "Writing", aiTool: "ChatGPT", tags: ["SEO", "Content", "Blog"], difficulty: "Beginner", copyCount: 3241, rating: 4.8, reviewCount: 124, creator: { name: "Rafiq Islam", avatar: "RI" }, visibility: "public" },
  { _id: "2", title: "Photorealistic Product Shot", description: "Creates studio-quality product images with precise lighting, shadows, and background control.", category: "Design", aiTool: "Midjourney", tags: ["Product", "Studio", "E-commerce"], difficulty: "Intermediate", copyCount: 2180, rating: 4.9, reviewCount: 98, creator: { name: "Nadia Khanom", avatar: "NK" }, visibility: "private" },
  { _id: "3", title: "Full-Stack Code Reviewer", description: "Reviews your code for bugs, performance issues, and best practices across any language or framework.", category: "Code", aiTool: "Claude", tags: ["Code", "Review", "DevOps"], difficulty: "Pro", copyCount: 1894, rating: 4.7, reviewCount: 77, creator: { name: "Tanvir Ahmed", avatar: "TA" }, visibility: "private" },
  { _id: "4", title: "LinkedIn Cold Outreach Machine", description: "Writes personalised, non-spammy LinkedIn messages that get replies — tailored to any industry.", category: "Marketing", aiTool: "ChatGPT", tags: ["LinkedIn", "Outreach", "B2B"], difficulty: "Beginner", copyCount: 2877, rating: 4.6, reviewCount: 143, creator: { name: "Sara Jahan", avatar: "SJ" }, visibility: "public" },
  { _id: "5", title: "Research Deep-Dive Analyst", description: "Breaks down complex research papers into clear summaries, key findings, and practical insights.", category: "Research", aiTool: "Gemini", tags: ["Research", "Academic", "Summary"], difficulty: "Intermediate", copyCount: 1456, rating: 4.8, reviewCount: 61, creator: { name: "Karim Uddin", avatar: "KU" }, visibility: "private" },
  { _id: "6", title: "E-commerce Product Description", description: "Crafts conversion-focused product descriptions with emotional triggers and feature highlights.", category: "Marketing", aiTool: "ChatGPT", tags: ["E-commerce", "Copy", "Sales"], difficulty: "Beginner", copyCount: 3102, rating: 4.9, reviewCount: 189, creator: { name: "Mim Akter", avatar: "MA" }, visibility: "public" },
];

const difficultyColor = {
  Beginner: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Intermediate: "bg-amber-50 text-amber-700 border-amber-200",
  Pro: "bg-rose-50 text-rose-700 border-rose-200",
};

const toolDot = { ChatGPT: "bg-emerald-500", Midjourney: "bg-rose-500", Claude: "bg-violet-500", Gemini: "bg-blue-500" };

function PromptCard({ prompt, index, user }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const isLoggedIn = !!user;
  const isPremium = prompt.visibility === "private";
  const isLocked = isPremium && !user?.isPremium;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300 p-5 flex flex-col gap-4 group relative overflow-hidden"
    >
      {/* Premium badge */}
      {isPremium && (
        <div className="absolute top-3 right-10 z-10">
          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-300">
            <RiLockFill className="text-[9px]" /> PREMIUM
          </span>
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`w-2 h-2 rounded-full ${toolDot[prompt.aiTool] || "bg-gray-400"}`} />
            <span className="text-xs font-medium text-gray-500 dark:text-slate-400">{prompt.aiTool}</span>
            <span className="text-gray-300 dark:text-slate-600">·</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${difficultyColor[prompt.difficulty]}`}>{prompt.difficulty}</span>
          </div>

          {/* Title — blur if locked */}
          <h3 className={`font-bold text-base leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 ${isLocked ? "blur-[2px] select-none text-gray-900 dark:text-white" : "text-gray-900 dark:text-white"}`}>
            {prompt.title}
          </h3>
        </div>
        <button className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
          <RiBookmarkLine />
        </button>
      </div>

      {/* Description — blur if locked */}
      <p className={`text-sm leading-relaxed line-clamp-2 ${isLocked ? "blur-[3px] select-none text-gray-500" : "text-gray-500 dark:text-slate-400"}`}>
        {prompt.description}
      </p>

      {/* Tags — blur if locked */}
      <div className={`flex flex-wrap gap-1.5 ${isLocked ? "blur-[2px] select-none" : ""}`}>
        {prompt.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800">{tag}</span>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-auto pt-3 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between gap-2">
        <div className={`flex items-center gap-3 text-xs text-gray-500 dark:text-slate-400 ${isLocked ? "blur-[2px] select-none" : ""}`}>
          <span className="flex items-center gap-1"><RiStarFill className="text-amber-400" />{prompt.rating} ({prompt.reviewCount})</span>
          <span className="flex items-center gap-1"><RiFileCopyLine className="text-gray-400" />{prompt.copyCount.toLocaleString()}</span>
        </div>
        <div className={`flex items-center gap-1.5 ${isLocked ? "blur-[2px] select-none" : ""}`}>
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">{prompt.creator.avatar}</div>
          <span className="text-xs text-gray-500 dark:text-slate-400 hidden sm:block">{prompt.creator.name}</span>
        </div>
      </div>

      {/* CTA Button */}
      {!isLoggedIn ? (
        // Not logged in → go to login
        <Link href="/login" className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 text-sm font-semibold hover:border-blue-400 hover:text-blue-600 transition-colors">
          Login to View <RiArrowRightLine />
        </Link>
      ) : isLocked ? (
        // Logged in but not premium → show subscribe button
        <Link href="/payment" className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
          <RiLockFill /> Subscribe to Premium
        </Link>
      ) : (
        // Full access
        <Link href={`/prompts/${prompt._id}`} className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
          View Details <RiArrowRightLine />
        </Link>
      )}

      {/* Locked overlay for premium cards */}
      {isLocked && (
        <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(255,255,255,0.7) 100%)" }} />
      )}
    </motion.div>
  );
}

export default function FeaturedPrompts() {
  const { user } = useAuth();
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div ref={headerRef} initial={{ opacity: 0, y: 20 }} animate={headerInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center mb-12">
          <span className="section-label mb-4"><RiFlashlightFill /> Featured This Week</span>
          <h2 className="font-bold text-3xl md:text-4xl text-gray-900 dark:text-white mt-3 mb-3">Trending Prompts Right Now</h2>
          <p className="text-gray-500 dark:text-slate-400 text-base leading-relaxed max-w-xl mx-auto">
            Hand-picked by our team — the most copied and highest-rated prompts. 🔒 Premium prompts require a subscription.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURED.map((prompt, i) => (
            <PromptCard key={prompt._id} prompt={prompt} index={i} user={user} />
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-12">
          <Link href="/prompts" className="btn-primary text-base px-8 py-3">
            Browse All Prompts <RiArrowRightLine />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
