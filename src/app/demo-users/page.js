"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { RiFileCopyLine, RiArrowRightLine, RiShieldLine, RiBrushLine, RiUserLine, RiCheckLine, RiSparklingFill } from "react-icons/ri";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import toast from "react-hot-toast";

const DEMO_USERS = [
  {
    role: "Admin",
    icon: RiShieldLine,
    color: "from-red-500 to-rose-600",
    iconBg: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    badge: "bg-red-100 text-red-700 border-red-200",
    email: "admin@prompthive.com",
    password: "Admin@12345",
    description: "Full platform access including user management, prompt moderation, payment history, reported prompts, and system analytics.",
    features: [
      "Manage all users & roles",
      "Approve or reject prompts",
      "View all payments",
      "Handle reported content",
      "Access system analytics",
      "Feature prompts on homepage",
    ],
  },
  {
    role: "Creator",
    icon: RiBrushLine,
    color: "from-violet-500 to-purple-600",
    iconBg: "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400",
    badge: "bg-violet-100 text-violet-700 border-violet-200",
    email: "creator@prompthive.com",
    password: "Creator@12345",
    description: "Creator studio access with analytics dashboard, prompt management, copy & bookmark tracking, and performance charts.",
    features: [
      "Creator analytics dashboard",
      "Add & manage prompts",
      "View copy & bookmark stats",
      "Recharts performance graphs",
      "Public & private prompt visibility",
      "Unlimited prompt submissions",
    ],
  },
  {
    role: "User",
    icon: RiUserLine,
    color: "from-blue-500 to-indigo-600",
    iconBg: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    email: "user@prompthive.com",
    password: "User@12345",
    description: "Standard user access to browse, copy, bookmark and review public prompts. Premium upgrade unlocks all private content.",
    features: [
      "Browse all public prompts",
      "Copy prompts to clipboard",
      "Bookmark favourite prompts",
      "Write reviews & ratings",
      "Report inappropriate content",
      "Upgrade to Premium ($5)",
    ],
  },
];

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handle} className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 text-gray-400 transition-colors shrink-0">
      {copied ? <RiCheckLine className="text-green-500 text-sm" /> : <RiFileCopyLine className="text-sm" />}
    </button>
  );
}

export default function DemoUsersPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-blue-600 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 px-3 py-1 rounded-full mb-4">
              <RiSparklingFill /> Demo Access
            </span>
            <h1 className="font-extrabold text-4xl text-gray-900 dark:text-white mt-3 mb-3">
              Try PromptHive as any role
            </h1>
            <p className="text-gray-500 dark:text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
              Use these demo credentials to explore the platform from different perspectives — no sign-up needed.
            </p>
          </motion.div>

          {/* cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {DEMO_USERS.map((u, i) => (
              <motion.div key={u.role} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
                {/* Gradient  */}
                <div className={`h-2 bg-gradient-to-r ${u.color}`} />

                <div className="p-6 flex flex-col gap-5 flex-1">
                  {/* Icon  */}
                  <div className="flex items-center gap-3">
                    <span className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${u.iconBg}`}>
                      <u.icon />
                    </span>
                    <div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${u.badge}`}>{u.role.toUpperCase()}</span>
                      <p className="font-bold text-lg text-gray-900 dark:text-white mt-1">{u.role} Access</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">{u.description}</p>

                  {/* Features */}
                  <div className="space-y-2">
                    {u.features.map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                          <RiCheckLine className="text-green-600 dark:text-green-400 text-[10px]" />
                        </span>
                        <span className="text-xs text-gray-600 dark:text-slate-400">{f}</span>
                      </div>
                    ))}
                  </div>

                  {/* Credentials */}
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-700 space-y-3">
                    <div>
                      <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 dark:text-slate-500 mb-1.5">EMAIL</p>
                      <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-700 rounded-xl px-3 py-2.5">
                        <span className="flex-1 text-sm font-mono text-gray-800 dark:text-slate-200 truncate">{u.email}</span>
                        <CopyBtn text={u.email} />
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 dark:text-slate-500 mb-1.5">PASSWORD</p>
                      <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-700 rounded-xl px-3 py-2.5">
                        <span className="flex-1 text-sm font-mono text-gray-800 dark:text-slate-200">{u.password}</span>
                        <CopyBtn text={u.password} />
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link href="/login" className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r ${u.color} text-white font-semibold text-sm hover:opacity-90 transition-opacity`}>
                    Go to Login <RiArrowRightLine />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Note */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 text-center">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              ⚠️ These are demo accounts for evaluation purposes. Please do not change credentials or submit inappropriate content.
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
