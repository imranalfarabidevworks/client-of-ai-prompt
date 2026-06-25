"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { authClient } from "@/lib/authClient";
import { RiLoader4Line, RiCheckLine, RiErrorWarningLine } from "react-icons/ri";
import toast from "react-hot-toast";

export default function GoogleCallbackPage() {
  const { googleLogin } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("Completing Google sign-in…");

  const getDashboard = (role) =>
    role === "admin" ? "/dashboard/admin" :
    role === "creator" ? "/dashboard/creator" : "/dashboard";

  useEffect(() => {
    const handleCallback = async () => {
      try {
        
        const session = await authClient.getSession();

        if (!session?.data?.user) {
          setStatus("error");
          setMessage("Google login failed. No session found.");
          setTimeout(() => router.push("/login"), 2000);
          return;
        }

        const googleUser = session.data.user;

        // তোমার MongoDB backend এ পাঠাও
        const user = await googleLogin({
          displayName: googleUser.name,
          email: googleUser.email,
          photoURL: googleUser.image || googleUser.photoURL || "",
        });

        setStatus("success");
        setMessage(`Welcome, ${user.name}! Redirecting…`);
        toast.success(`Welcome, ${user.name}! 👋`);

        setTimeout(() => router.push(getDashboard(user.role)), 1000);
      } catch (err) {
        console.error("Google callback error:", err);
        setStatus("error");
        setMessage(err?.response?.data?.message || "Google login failed. Please try again.");
        setTimeout(() => router.push("/login"), 2500);
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-10 text-center max-w-sm w-full mx-4">

        {/* Icon */}
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 ${
          status === "loading" ? "bg-blue-50 dark:bg-blue-900/20" :
          status === "success" ? "bg-green-50 dark:bg-green-900/20" :
          "bg-red-50 dark:bg-red-900/20"
        }`}>
          {status === "loading" && <RiLoader4Line className="text-blue-500 text-3xl animate-spin" />}
          {status === "success" && <RiCheckLine className="text-green-500 text-3xl" />}
          {status === "error"   && <RiErrorWarningLine className="text-red-500 text-3xl" />}
        </div>

        {/* Google logo */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"/>
            <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"/>
            <path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"/>
            <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"/>
          </svg>
          <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">Google Sign-In</span>
        </div>

        <p className="font-bold text-base text-gray-900 dark:text-white mb-2">
          {status === "loading" ? "Signing you in…" :
           status === "success" ? "Login Successful!" :
           "Login Failed"}
        </p>
        <p className="text-sm text-gray-500 dark:text-slate-400">{message}</p>

        {status === "error" && (
          <button
            onClick={() => router.push("/login")}
            className="mt-5 px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Login
          </button>
        )}
      </div>
    </div>
  );
}
