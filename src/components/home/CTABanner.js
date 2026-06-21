"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { RiArrowRightLine, RiSparklingFill } from "react-icons/ri";

export default function CTABanner() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}
          className="relative overflow-hidden bg-blue-600 rounded-3xl px-8 py-14 text-center">
          <div className="pointer-events-none absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-blue-500 blur-[60px] opacity-60" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-indigo-600 blur-[60px] opacity-60" />
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-blue-200 mb-5"><RiSparklingFill /> Start for free today</span>
            <h2 className="font-extrabold text-3xl sm:text-4xl text-white mb-4 leading-tight">Ready to supercharge<br />your AI workflow?</h2>
            <p className="text-blue-200 text-base mb-8 max-w-md mx-auto leading-relaxed">Join 3,400+ creators and users who use PromptHive every day to get more from their AI tools.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm hover:bg-blue-50 transition-colors shadow-sm">
                Create Free Account <RiArrowRightLine />
              </Link>
              <Link href="/prompts" className="inline-flex items-center gap-2 px-7 py-3 rounded-xl border border-blue-400 text-white font-semibold text-sm hover:bg-blue-500 transition-colors">
                Browse Prompts
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
