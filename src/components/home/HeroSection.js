"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { RiSearchLine, RiArrowRightLine, RiFlashlightFill, RiSparklingFill } from "react-icons/ri";

const trendingTags = ["ChatGPT","Midjourney","Claude","Gemini","Code","Writing","Marketing","Design","SEO","Email","Resume","Story","Product","Research"];
const aiTools = [
  { name: "ChatGPT", icon: "🤖", color: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700" },
  { name: "Gemini", icon: "✨", color: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-700" },
  { name: "Claude", icon: "🧠", color: "bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-700" },
  { name: "Midjourney", icon: "🎨", color: "bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-700" },
];
const stats = [{ value: "12K+", label: "Prompts" }, { value: "3.4K", label: "Creators" }, { value: "98K", label: "Uses" }];
const randomTags = [...trendingTags].sort(() => Math.random() - 0.5).slice(0, 8);
const fadeUp = (delay = 0) => ({ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] } } });

export default function HeroSection() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const handleSearch = (e) => { e.preventDefault(); if (query.trim()) router.push(`/prompts?search=${encodeURIComponent(query.trim())}`); };

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-white dark:bg-slate-900">
      {/* Clean gradient blobs — no grid lines */}
      <div className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-100 dark:bg-blue-900/20 blur-[120px] opacity-50" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-indigo-100 dark:bg-indigo-900/20 blur-[100px] opacity-40" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-purple-50 dark:bg-purple-900/10 blur-[80px] opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32 w-full">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div variants={fadeUp(0)} initial="hidden" animate="show"
            className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            <RiFlashlightFill /> The #1 AI Prompt Marketplace — Trusted by 3,400+ creators
          </motion.div>

          <motion.h1 variants={fadeUp(0.1)} initial="hidden" animate="show"
            className="font-extrabold text-4xl sm:text-5xl md:text-6xl text-gray-900 dark:text-white leading-[1.1] tracking-tight mb-5">
            Find prompts that
            <br />
            <span className="text-blue-600 dark:text-blue-400">actually work</span>
          </motion.h1>

          <motion.p variants={fadeUp(0.18)} initial="hidden" animate="show"
            className="text-gray-500 dark:text-slate-400 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            Browse thousands of community-tested prompts for ChatGPT, Gemini, Claude, Midjourney and more — or publish your own and get discovered.
          </motion.p>

          <motion.form variants={fadeUp(0.26)} initial="hidden" animate="show" onSubmit={handleSearch}
            className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-lg p-1.5 max-w-xl mx-auto mb-6">
            <RiSearchLine className="text-gray-400 text-xl ml-3 shrink-0" />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search prompts, tools, categories…"
              className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none py-2 pr-2" />
            <button type="submit" className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shrink-0">
              Search <RiArrowRightLine />
            </button>
          </motion.form>

          <motion.div variants={fadeUp(0.32)} initial="hidden" animate="show" className="flex flex-wrap justify-center gap-2 mb-12">
            <span className="text-xs text-gray-400 dark:text-slate-500 font-medium self-center mr-1">Trending:</span>
            {randomTags.map((tag) => (
              <button key={tag} onClick={() => router.push(`/prompts?search=${encodeURIComponent(tag)}`)}
                className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 transition-colors cursor-pointer">
                {tag}
              </button>
            ))}
          </motion.div>

          <motion.div variants={fadeUp(0.4)} initial="hidden" animate="show" className="flex items-center justify-center gap-10 mb-10">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-extrabold text-2xl text-gray-900 dark:text-white">{s.value}</p>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp(0.48)} initial="hidden" animate="show" className="flex flex-wrap justify-center gap-2">
            {aiTools.map((tool) => (
              <span key={tool.name} className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${tool.color}`}>
                {tool.icon} {tool.name}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-white dark:from-slate-900 to-transparent" />
    </section>
  );
}
