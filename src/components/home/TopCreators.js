"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { RiMedalFill, RiFileCopyLine, RiStarFill, RiVerifiedBadgeFill } from "react-icons/ri";

const TOP_CREATORS = [
  { name: "Rafiq Islam", avatar: "RI", color: "bg-blue-600", prompts: 34, copies: 12400, rating: 4.9, badge: "Top Creator" },
  { name: "Nadia Khanom", avatar: "NK", color: "bg-rose-500", prompts: 28, copies: 9870, rating: 4.8, badge: "Rising Star" },
  { name: "Tanvir Ahmed", avatar: "TA", color: "bg-violet-600", prompts: 41, copies: 15200, rating: 4.9, badge: "Top Creator" },
  { name: "Sara Jahan", avatar: "SJ", color: "bg-emerald-600", prompts: 19, copies: 7630, rating: 4.7, badge: "Verified" },
  { name: "Karim Uddin", avatar: "KU", color: "bg-amber-500", prompts: 23, copies: 8910, rating: 4.8, badge: "Top Creator" },
  { name: "Mim Akter", avatar: "MA", color: "bg-cyan-600", prompts: 16, copies: 6440, rating: 4.6, badge: "Rising Star" },
];

const badgeColor = {
  "Top Creator": "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-700",
  "Rising Star": "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-700",
  "Verified": "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700",
};

export default function TopCreators() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <section className="py-20 bg-gray-50 dark:bg-slate-800" id="creators">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center mb-12">
          <span className="section-label mb-4"><RiMedalFill /> Creator Spotlight</span>
          <h2 className="font-bold text-3xl md:text-4xl text-gray-900 dark:text-white mt-3 mb-3">Meet Our Top Creators</h2>
          <p className="text-gray-500 dark:text-slate-400 text-base leading-relaxed max-w-xl mx-auto">These talented individuals drive the quality and diversity of PromptHive.</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TOP_CREATORS.map((creator, i) => (
            <motion.div key={creator.name} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.07 }}
              className="bg-white dark:bg-slate-700 rounded-2xl border border-gray-200 dark:border-slate-600 p-5 flex items-center gap-4 hover:shadow-lg hover:scale-[1.01] transition-all duration-200">
              <div className="shrink-0 w-6 text-center"><span className="text-xs font-bold text-gray-400 dark:text-slate-500">#{i + 1}</span></div>
              <div className={`w-12 h-12 rounded-xl ${creator.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>{creator.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate">{creator.name}</h3>
                  <RiVerifiedBadgeFill className="text-blue-500 text-sm shrink-0" />
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeColor[creator.badge]}`}>{creator.badge}</span>
              </div>
              <div className="shrink-0 text-right">
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400 justify-end mb-1"><RiFileCopyLine />{(creator.copies / 1000).toFixed(1)}k</div>
                <div className="flex items-center gap-1 text-xs text-amber-500 justify-end"><RiStarFill />{creator.rating}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
