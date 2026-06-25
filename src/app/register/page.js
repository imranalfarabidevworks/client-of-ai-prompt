"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  RiMailLine, RiLockLine, RiUserLine, RiImageLine,
  RiSparklingFill, RiEyeLine, RiEyeOffLine,
  RiLoader4Line, RiCheckLine,
} from "react-icons/ri";
import { useAuth } from "@/context/AuthContext";
import { authClient } from "@/lib/authClient";

export default function RegisterPage() {
  const [form, setForm]         = useState({ name: "", email: "", photoURL: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { register }            = useAuth();
  const router                  = useRouter();

  const up = (k, v) => { setForm((p) => ({ ...p, [k]: v })); if (k === "photoURL") setImgError(false); };

  const passwordRules = [
    { label: "At least 6 characters", ok: form.password.length >= 6 },
    { label: "One uppercase letter",  ok: /[A-Z]/.test(form.password) },
    { label: "One lowercase letter",  ok: /[a-z]/.test(form.password) },
  ];

  const validate = () => {
    if (!form.name.trim())  return "Name is required";
    if (!form.email.trim()) return "Email is required";
    if (!passwordRules.every((r) => r.ok)) return "Password doesn't meet requirements";
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return toast.error(err);
    setLoading(true);
    try {
      await register(form.name, form.email, form.photoURL, form.password);
      toast.success("Account created! Welcome to PromptHive 🎉");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed");
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setGLoading(true);
    try {
      await authClient.signIn.social({ provider: "google", callbackURL: "/auth/google-callback" });
    } catch {
      toast.error("Google signup failed");
      setGLoading(false);
    }
  };

  const isValidUrl = (url) => { try { new URL(url); return true; } catch { return false; } };
  const showPreview = form.photoURL && isValidUrl(form.photoURL) && !imgError;

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-slate-900">
      {/* Left */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] bg-blue-600 p-10 shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <RiSparklingFill className="text-white text-lg" />
          </span>
          <span className="font-bold text-xl text-white">PromptHive</span>
        </Link>
        <div className="space-y-5">
          <h2 className="text-white font-bold text-3xl leading-snug">Join 3,400+ creators sharing AI prompts</h2>
          <div className="space-y-3">
            {["Free to join, no credit card required", "Publish prompts and build an audience", "Discover prompts for ChatGPT, Claude, Gemini & more"].map((t) => (
              <div key={t} className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <RiCheckLine className="text-white text-xs" />
                </span>
                <span className="text-white/80 text-sm">{t}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/40 text-xs">© 2025 PromptHive</p>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md py-6">
          <Link href="/" className="flex items-center gap-2 justify-center mb-8 lg:hidden">
            <span className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <RiSparklingFill className="text-white text-lg" />
            </span>
            <span className="font-bold text-xl text-gray-900 dark:text-white">PromptHive</span>
          </Link>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Create account</h1>
            <p className="text-gray-500 dark:text-slate-400 text-sm mb-6">Start sharing prompts for free</p>

            {/* Google */}
            <button onClick={handleGoogle} disabled={gLoading}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 text-sm font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors mb-5 disabled:opacity-60">
              {gLoading ? <><RiLoader4Line className="animate-spin" /> Connecting…</> : (
                <><svg width="16" height="16" viewBox="0 0 24 24"><path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"/><path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"/><path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"/><path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"/></svg>
                Continue with Google</>
              )}
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gray-200 dark:bg-slate-600" />
              <span className="text-xs text-gray-400 dark:text-slate-500">or register with email</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-slate-600" />
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Photo Preview */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-slate-700 flex items-center justify-center shrink-0 overflow-hidden border-2 border-blue-200 dark:border-slate-600">
                  {showPreview ? (
                    <img src={form.photoURL} alt="preview" className="w-full h-full object-cover" onError={() => setImgError(true)} />
                  ) : (
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                      {form.name ? form.name[0].toUpperCase() : "?"}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Photo URL <span className="text-gray-400 font-normal">(optional)</span></label>
                  <div className="relative">
                    <RiImageLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="url" value={form.photoURL} onChange={(e) => up("photoURL", e.target.value)} placeholder="https://i.ibb.co/your-photo"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <RiUserLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={form.name} onChange={(e) => up("name", e.target.value)} placeholder="Your full name"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Email</label>
                <div className="relative">
                  <RiMailLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={form.email} onChange={(e) => up("email", e.target.value)} placeholder="you@example.com"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <RiLockLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPass ? "text" : "password"} value={form.password} onChange={(e) => up("password", e.target.value)} placeholder="Min 6 chars, upper + lower"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <RiEyeOffLine /> : <RiEyeLine />}
                  </button>
                </div>
                {form.password && (
                  <div className="mt-2 space-y-1">
                    {passwordRules.map((r) => (
                      <div key={r.label} className="flex items-center gap-1.5">
                        <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${r.ok ? "bg-green-500 text-white" : "bg-gray-200 dark:bg-slate-600 text-gray-400"}`}>
                          {r.ok ? "✓" : "·"}
                        </span>
                        <span className={`text-xs ${r.ok ? "text-green-600 dark:text-green-400" : "text-gray-400"}`}>{r.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60 mt-2">
                {loading ? <><RiLoader4Line className="animate-spin" /> Creating account…</> : "Create Account"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 dark:text-slate-400 mt-5">
              Already have an account? <Link href="/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 dark:text-slate-500 mt-4">
            Admin or Creator? <Link href="/login/admin" className="text-red-500 hover:underline">Admin</Link> · <Link href="/login/creator" className="text-violet-500 hover:underline">Creator</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
