"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { RiShieldCheckFill, RiTeamFill, RiLineChartFill, RiSearchEyeFill, RiLockPasswordFill, RiCoinsFill } from "react-icons/ri";

const features = [
  { icon: RiSearchEyeFill, color: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400", title: "Curated & Tested", desc: "Every prompt is reviewed and tested before it goes live. No fluff — only prompts that deliver real results." },
  { icon: RiTeamFill, color: "bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400", title: "Community Driven", desc: "Built by creators, for creators. Rate, review, and build on top of each other's work in a collaborative ecosystem." },
  { icon: RiLineChartFill, color: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400", title: "Usage Analytics", desc: "Track how your prompts perform. See copy counts, ratings, and engagement — all in your creator dashboard." },
  { icon: RiShieldCheckFill, color: "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400", title: "Moderated Platform", desc: "Our admin team actively reviews content. Report harmful prompts and we act within 24 hours — guaranteed." },
  { icon: RiLockPasswordFill, color: "bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400", title: "Secure & Private", desc: "JWT-secured accounts, encrypted sessions, and granular visibility controls for every prompt you publish." },
  { icon: RiCoinsFill, color: "bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400", title: "Monetise Your Craft", desc: "Unlock premium prompt slots and earn recognition. Our creator program rewards quality with visibility and reach." },
];

export default function WhyChooseUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section className="py-20 bg-gray-50 dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center mb-14">
          <span className="section-label mb-4">Why PromptHive</span>
          <h2 className="font-bold text-3xl md:text-4xl text-gray-900 dark:text-white mt-3 mb-3">Everything you need, <span className="text-blue-600">nothing you don't</span></h2>
          <p className="text-gray-500 dark:text-slate-400 text-base leading-relaxed max-w-xl mx-auto">We built the platform we always wished existed — one that values quality over quantity and puts creators first.</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.07 }}
              className="bg-white dark:bg-slate-700 rounded-2xl border border-gray-200 dark:border-slate-600 p-6 flex flex-col gap-4 hover:shadow-lg transition-all duration-300">
              <span className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${f.color}`}><f.icon /></span>
              <div>
                <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1.5">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
