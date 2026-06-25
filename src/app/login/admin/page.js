"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { RiMailLine, RiLockLine, RiShieldFill, RiEyeLine, RiEyeOffLine, RiLoader4Line, RiSparklingFill } from "react-icons/ri";
import { useAuth } from "@/context/AuthContext";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@prompthive.com";
const ADMIN_PASS  = process.env.NEXT_PUBLIC_ADMIN_PASS  || "Admin@12345";

export default function AdminLoginPage() {
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
      if (user.role !== "admin") {
        toast.error("Access denied! This login is for Admins only.");
        return;
      }
      toast.success(`Welcome Admin ${user.name}! 🛡️`);
      router.push("/dashboard/admin");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid credentials");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-slate-900">
      {/* Left */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] bg-red-600 p-10 shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <RiSparklingFill className="text-white text-lg" />
          </span>
          <span className="font-bold text-xl text-white">PromptHive</span>
        </Link>
        <div className="space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
            <RiShieldFill className="text-white text-3xl" />
          </div>
          <h2 className="text-white font-bold text-3xl leading-snug">Admin Control Panel</h2>
          <p className="text-red-200 text-sm">Restricted access. Authorized admins only.</p>
          <div className="bg-white/10 rounded-2xl p-4 space-y-2">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">Admin Can</p>
            {["Manage all users & roles","Approve or reject prompts","View all payments","Handle reported content","Full analytics access"].map((t) => (
              <div key={t} className="flex items-center gap-2 text-white/80 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-red-300 shrink-0" /> {t}
              </div>
            ))}
          </div>
        </div>
        <p className="text-red-200/40 text-xs">© 2025 PromptHive</p>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">

          {/* Role tabs */}
          <div className="flex rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden mb-6 bg-white dark:bg-slate-800">
            {[
              { label: "User",    href: "/login",         color: "text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700" },
              { label: "Creator", href: "/login/creator", color: "text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700" },
              { label: "Admin",   href: "/login/admin",   color: "bg-red-600 text-white" },
            ].map((tab) => (
              <Link key={tab.label} href={tab.href} className={`flex-1 text-center py-2.5 text-sm font-semibold transition-colors ${tab.color}`}>
                {tab.label}
              </Link>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <RiShieldFill className="text-red-600 dark:text-red-400 text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Sign In</h1>
                <p className="text-gray-500 dark:text-slate-400 text-xs">Restricted — Admin only</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Email</label>
                <div className="relative">
                  <RiMailLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={ADMIN_EMAIL}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <RiLockLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Admin password"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPass ? <RiEyeOffLine /> : <RiEyeLine />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors disabled:opacity-60">
                {loading ? <><RiLoader4Line className="animate-spin" /> Signing in…</> : "Sign In as Admin"}
              </button>
            </form>

            {/* Credentials hint */}
            <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-red-600 dark:text-red-400">{ADMIN_EMAIL}</p>
                <p className="text-xs font-mono text-red-600 dark:text-red-400">{ADMIN_PASS}</p>
              </div>
              <button onClick={() => { setEmail(ADMIN_EMAIL); setPassword(ADMIN_PASS); }}
                className="text-xs font-semibold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40 px-3 py-1.5 rounded-lg hover:underline">
                Auto Fill
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
