"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  RiMailLine, RiLockLine, RiSparklingFill,
  RiEyeLine, RiEyeOffLine, RiGoogleFill,
  RiLoader4Line, RiShieldLine,
} from "react-icons/ri";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/auth";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@prompthive.com";
const ADMIN_PASS  = process.env.NEXT_PUBLIC_ADMIN_PASS  || "Admin@12345";

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const { login, googleLogin }  = useAuth();
  const router = useRouter();

  const getDashboard = (role) =>
    role === "admin" ? "/dashboard/admin" :
    role === "creator" ? "/dashboard/creator" : "/dashboard";

  // ─── Email/Password Login ─────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Fill in all fields");
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}! 👋`);
      router.push(getDashboard(user.role));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // ─── Google Login via Better Auth ────────────
  const handleGoogle = async () => {
    setGLoading(true);
    try {
      const result = await auth.signIn.social({
        provider: "google",
        callbackURL: "/auth/google-callback",
      });
      // callback page এ user info পাঠানো হবে
      if (!result?.data) {
        toast.error("Google login failed");
      }
    } catch (err) {
      toast.error("Google login failed. Try again.");
      setGLoading(false);
    }
  };

  // ─── Auto fill admin credentials ─────────────
  const fillAdmin = () => { setEmail(ADMIN_EMAIL); setPassword(ADMIN_PASS); };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] bg-blue-600 p-10 shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <RiSparklingFill className="text-white text-lg" />
          </span>
          <span className="font-bold text-xl text-white">PromptHive</span>
        </Link>
        <div className="space-y-4">
          <h2 className="text-white font-bold text-3xl leading-snug">Sign in to your account</h2>
          <p className="text-blue-200 text-sm">User & Creator — register with any email. Admin has a fixed account.</p>
          <div className="bg-white/10 rounded-2xl p-4 space-y-2 text-sm">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">Account Types</p>
            <div className="flex items-center gap-2 text-white/80"><span className="w-2 h-2 rounded-full bg-blue-300" /> User — register with any email</div>
            <div className="flex items-center gap-2 text-white/80"><span className="w-2 h-2 rounded-full bg-violet-300" /> Creator — role assigned by Admin</div>
            <div className="flex items-center gap-2 text-white/80"><span className="w-2 h-2 rounded-full bg-red-300" /> Admin — fixed credentials only</div>
          </div>
        </div>
        <p className="text-white/30 text-xs">© 2025 PromptHive</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 dark:bg-slate-900">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">

          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 justify-center mb-8 lg:hidden">
            <span className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <RiSparklingFill className="text-white text-lg" />
            </span>
            <span className="font-bold text-xl text-gray-900 dark:text-white">PromptHive</span>
          </Link>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Sign in</h1>
            <p className="text-gray-500 dark:text-slate-400 text-sm mb-6">Welcome back to PromptHive</p>

            {/* Google Login */}
            <button
              onClick={handleGoogle}
              disabled={gLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 text-sm font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors mb-5 disabled:opacity-60"
            >
              {gLoading ? (
                <><RiLoader4Line className="animate-spin text-gray-400" /> Connecting…</>
              ) : (
                <><img 
        src="https://i.ibb.co.com/PGwRLmGt/channels4-profile.jpg" 
        alt="Google" 
        className="w-4 h-4" 
      /> Continue with Google</>
              )}
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gray-200 dark:bg-slate-600" />
              <span className="text-xs text-gray-400 dark:text-slate-500">or sign in with email</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-slate-600" />
            </div>

            {/* Email/Password form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Email</label>
                <div className="relative">
                  <RiMailLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <RiLockLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <RiEyeOffLine /> : <RiEyeLine />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {loading ? <><RiLoader4Line className="animate-spin" /> Signing in…</> : "Sign In"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 dark:text-slate-400 mt-5">
              Don't have an account?{" "}
              <Link href="/register" className="text-blue-600 font-semibold hover:underline">Create one free</Link>
            </p>
          </div>

          {/* Admin credentials hint */}
          <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
             <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-red-700 dark:text-red-400 flex items-center gap-1.5">
                <RiShieldLine /> Admin Login (Fixed)
              </p>
              <button
                onClick={fillAdmin}
                className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline bg-red-100 dark:bg-red-900/40 px-2 py-1 rounded-lg"
              >
                Auto Fill
              </button>
            </div> 
            <p className="text-xs text-red-600 dark:text-red-400 font-mono">Email: {ADMIN_EMAIL}</p>
            <p className="text-xs text-red-600 dark:text-red-400 font-mono">Pass: {ADMIN_PASS}</p>
            <p className="text-[11px] text-red-400 dark:text-red-500 mt-2">
              👤 User & Creator → Register with any email/password
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
