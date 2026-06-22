"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { RiMailLine, RiLockLine, RiUserFill, RiEyeLine, RiEyeOffLine, RiLoader4Line, RiSparklingFill, RiCheckLine } from "react-icons/ri";
import { useAuth } from "@/context/AuthContext";
import { authClient } from "@/lib/authClient";

export default function UserLoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const { login } = useAuth();
  const router    = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Fill in all fields");
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}! 👋`);
      // User হলে /dashboard, admin হলে admin dashboard
      if (user.role === "admin") router.push("/dashboard/admin");
      else if (user.role === "creator") router.push("/dashboard/creator");
      else router.push("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGLoading(true);
    try {
      await authClient.signIn.social({ provider: "google", callbackURL: "/auth/google-callback" });
    } catch {
      toast.error("Google login failed");
      setGLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-slate-900">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] bg-blue-600 p-10 shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <RiSparklingFill className="text-white text-lg" />
          </span>
          <span className="font-bold text-xl text-white">PromptHive</span>
        </Link>
        <div className="space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
            <RiUserFill className="text-white text-3xl" />
          </div>
          <h2 className="text-white font-bold text-3xl leading-snug">Welcome Back!</h2>
          <p className="text-blue-200 text-sm leading-relaxed">Browse, copy, bookmark, and review the best AI prompts.</p>
          <div className="bg-white/10 rounded-2xl p-4 space-y-2">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">What You Can Do</p>
            {["Browse all public prompts","Copy prompts to clipboard","Bookmark your favorites","Write reviews & ratings","Report inappropriate content","Upgrade to Premium for $5"].map((t) => (
              <div key={t} className="flex items-center gap-2 text-white/80 text-sm">
                <RiCheckLine className="text-blue-300 shrink-0 text-xs" /> {t}
              </div>
            ))}
          </div>
        </div>
        <p className="text-blue-200/40 text-xs">© 2025 PromptHive</p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          {/* Role Switcher */}
          <div className="flex rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden mb-6 bg-white dark:bg-slate-800">
            {[
              { label: "Admin",   href: "/login/admin",   color: "text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700" },
              { label: "Creator", href: "/login/creator", color: "text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700" },
              { label: "User",    href: "/login/user",    color: "bg-blue-600 text-white" },
            ].map((tab) => (
              <Link key={tab.label} href={tab.href} className={`flex-1 text-center py-2.5 text-sm font-semibold transition-colors ${tab.color}`}>
                {tab.label}
              </Link>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <RiUserFill className="text-blue-600 dark:text-blue-400 text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">User Sign In</h1>
                <p className="text-gray-500 dark:text-slate-400 text-xs">Access your PromptHive account</p>
              </div>
            </div>

            {/* Google */}
            <button onClick={handleGoogle} disabled={gLoading}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 text-sm font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors mb-4 disabled:opacity-60">
              {gLoading ? <><RiLoader4Line className="animate-spin" /> Connecting…</> : (
                <><svg width="16" height="16" viewBox="0 0 24 24"><path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"/><path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"/><path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"/><path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"/></svg> Continue with Google</>
              )}
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-200 dark:bg-slate-600" />
              <span className="text-xs text-gray-400 dark:text-slate-500">or email</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-slate-600" />
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Email</label>
                <div className="relative">
                  <RiMailLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <RiLockLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <RiEyeOffLine /> : <RiEyeLine />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60">
                {loading ? <><RiLoader4Line className="animate-spin" /> Signing in…</> : "Sign In"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 dark:text-slate-400 mt-5">
              No account? <Link href="/register" className="text-blue-600 font-semibold hover:underline">Create one free</Link>
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 dark:text-slate-500 mt-4">
            Wrong page? <Link href="/login/admin" className="text-red-600 hover:underline">Admin Login</Link> · <Link href="/login/creator" className="text-violet-600 hover:underline">Creator Login</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
