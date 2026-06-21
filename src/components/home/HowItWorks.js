"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { RiUserAddLine, RiSearchLine, RiFileCopyLine, RiRocketLine } from "react-icons/ri";

const steps = [
  { step: "01", icon: RiUserAddLine, color: "bg-blue-600", title: "Create your account", desc: "Sign up free in 30 seconds. No credit card required. Start exploring immediately." },
  { step: "02", icon: RiSearchLine, color: "bg-violet-600", title: "Discover prompts", desc: "Search by tool, category, or difficulty. Filter to find exactly what your workflow needs." },
  { step: "03", icon: RiFileCopyLine, color: "bg-emerald-600", title: "Copy and use", desc: "One click to copy any prompt. Paste it directly into your AI tool of choice and get results." },
  { step: "04", icon: RiRocketLine, color: "bg-amber-500", title: "Publish your own", desc: "Share your best prompts with the community. Build a following and earn creator status." },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center mb-14">
          <span className="section-label mb-4">How It Works</span>
          <h2 className="font-bold text-3xl md:text-4xl text-gray-900 dark:text-white mt-3 mb-3">Up and running in minutes</h2>
          <p className="text-gray-500 dark:text-slate-400 text-base leading-relaxed max-w-xl mx-auto">Four simple steps to get from zero to finding and using prompts that genuinely improve your output.</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <motion.div key={s.step} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.1 }} className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-2xl ${s.color} flex items-center justify-center text-white text-2xl mb-5 shadow-sm`}><s.icon /></div>
              <span className="text-[11px] font-bold tracking-widest text-gray-400 dark:text-slate-500 mb-2">STEP {s.step}</span>
              <h3 className="font-bold text-base text-gray-900 dark:text-white mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
