"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import PrivateRoute from "@/components/shared/PrivateRoute";
import { RiUserLine, RiMailLine, RiShieldLine, RiSparklingFill, RiCheckLine } from "react-icons/ri";

export default function ProfilePage() {
  const { user } = useAuth();
  const [imgError, setImgError] = useState(false);

  const roleConfig = {
    admin:   { label: "Admin",   color: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800" },
    creator: { label: "Creator", color: "bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800" },
    user:    { label: "User",    color: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800" },
  };
  const role = roleConfig[user?.role] || roleConfig.user;

  return (
    <PrivateRoute>
      <div className="max-w-lg space-y-6">
        <div>
          <h1 className="font-bold text-2xl text-gray-900 dark:text-white mb-1">My Profile</h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm">Your account information</p>
        </div>

        {/* Avatar */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-blue-100 dark:bg-slate-700 flex items-center justify-center">
            {user?.photoURL && !imgError ? (
              <img src={user.photoURL} alt={user?.name} className="w-full h-full object-cover" onError={() => setImgError(true)} />
            ) : (
              <span className="text-blue-600 dark:text-blue-400 font-extrabold text-3xl">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </span>
            )}
          </div>
          <div>
            <p className="font-bold text-xl text-gray-900 dark:text-white">{user?.name}</p>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">{user?.email}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border capitalize ${role.color}`}>
                <RiShieldLine className="text-xs" /> {role.label}
              </span>
              {user?.isPremium && (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800">
                  <RiSparklingFill /> Premium
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 space-y-4">
          {[
            { icon: RiUserLine,   label: "Full Name",     value: user?.name },
            { icon: RiMailLine,   label: "Email Address", value: user?.email },
            { icon: RiShieldLine, label: "Account Role",  value: role.label },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <Icon />
              </span>
              <div>
                <p className="text-xs text-gray-400 dark:text-slate-500">{label}</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{value || "—"}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Subscription */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="font-bold text-base text-gray-900 dark:text-white mb-4">Subscription</h2>
          {user?.isPremium ? (
            <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                <RiCheckLine className="text-white text-lg" />
              </div>
              <div>
                <p className="font-bold text-sm text-blue-700 dark:text-blue-400">Premium Active ✨</p>
                <p className="text-xs text-blue-500 mt-0.5">Full access to all private prompts</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { label: "Current Plan",    value: "Free" },
                { label: "Prompts Limit",   value: "3 prompts" },
                { label: "Premium Prompts", value: "Locked 🔒" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-700 last:border-0">
                  <span className="text-sm text-gray-500 dark:text-slate-400">{row.label}</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{row.value}</span>
                </div>
              ))}
              <Link href="/payment" className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
                <RiSparklingFill /> Upgrade to Premium — $5
              </Link>
            </div>
          )}
        </div>
      </div>
    </PrivateRoute>
  );
}
