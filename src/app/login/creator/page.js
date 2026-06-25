"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { RiMailLine, RiLockLine, RiBrushFill, RiEyeLine, RiEyeOffLine, RiLoader4Line, RiSparklingFill } from "react-icons/ri";
import { useAuth } from "@/context/AuthContext";

const CREATOR_EMAIL = process.env.NEXT_PUBLIC_CREATOR_EMAIL || "creator@prompthive.com";
const CREATOR_PASS  = process.env.NEXT_PUBLIC_CREATOR_PASS  || "Creator@12345";

export default function CreatorLoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();
  const router    = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Fill in all fields");
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role !== "creator" && user.role !== "admin") {
        toast.error("Access denied! Contact admin to get Creator role.");
        return;
      }
      toast.success(`Welcome Creator ${user.name}! 🎨`);
      router.push("/dashboard/creator");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid credentials");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-slate-900">
      {/* Left */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] bg-violet-600 p-10 shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <RiSparklingFill className="text-white text-lg" />
          </span>
          <span className="font-bold text-xl text-white">PromptHive</span>
        </Link>
        <div className="space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
            <RiBrushFill className="text-white text-3xl" />
          </div>
          <h2 className="text-white font-bold text-3xl leading-snug">Creator Studio</h2>
          <p className="text-violet-200 text-sm">Publish prompts, track analytics, build your audience.</p>
          <div className="bg-white/10 rounded-2xl p-4 space-y-2">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">Creator Can</p>
            {["Analytics dashboard with charts","Add unlimited prompts","Track copies & bookmarks","Public & private visibility","Build a follower base"].map((t) => (
              <div key={t} className="flex items-center gap-2 text-white/80 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-300 shrink-0" /> {t}
              </div>
            ))}
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-violet-200 text-xs">💡 No Creator access? Register as User → Admin upgrades your role.</p>
          </div>
        </div>
        <p className="text-violet-200/40 text-xs">© 2025 PromptHive</p>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">

          {/* Role tabs */}
          <div className="flex rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden mb-6 bg-white dark:bg-slate-800">
            {[
              { label: "User",    href: "/login",         color: "text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700" },
              { label: "Creator", href: "/login/creator", color: "bg-violet-600 text-white" },
              { label: "Admin",   href: "/login/admin",   color: "text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700" },
            ].map((tab) => (
              <Link key={tab.label} href={tab.href} className={`flex-1 text-center py-2.5 text-sm font-semibold transition-colors ${tab.color}`}>
                {tab.label}
              </Link>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <RiBrushFill className="text-violet-600 dark:text-violet-400 text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Creator Sign In</h1>
                <p className="text-gray-500 dark:text-slate-400 text-xs">Access your Creator Studio</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Email</label>
                <div className="relative">
                  <RiMailLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={CREATOR_EMAIL}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <RiLockLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Creator password"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPass ? <RiEyeOffLine /> : <RiEyeLine />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-600 text-white font-semibold text-sm hover:bg-violet-700 transition-colors disabled:opacity-60">
                {loading ? <><RiLoader4Line className="animate-spin" /> Signing in…</> : "Sign In as Creator"}
              </button>
            </form>

            {/* Credentials hint */}
            <div className="mt-4 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-violet-600 dark:text-violet-400">{CREATOR_EMAIL}</p>
                <p className="text-xs font-mono text-violet-600 dark:text-violet-400">{CREATOR_PASS}</p>
              </div>
              <button onClick={() => { setEmail(CREATOR_EMAIL); setPassword(CREATOR_PASS); }}
                className="text-xs font-semibold text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-900/40 px-3 py-1.5 rounded-lg hover:underline">
                Auto Fill
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 dark:text-slate-400 mt-4">
              No account? <Link href="/register" className="text-violet-600 font-semibold hover:underline">Register here</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
