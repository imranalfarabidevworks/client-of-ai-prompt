"use client";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { RiAddLine, RiFileListLine, RiBookmarkLine, RiStarLine, RiSparklingFill, RiArrowRightLine } from "react-icons/ri";

const quickLinks = [
  { href: "/dashboard/add-prompt", icon: RiAddLine, label: "Add Prompt", color: "bg-blue-50 text-blue-600" },
  { href: "/dashboard/my-prompts", icon: RiFileListLine, label: "My Prompts", color: "bg-violet-50 text-violet-600" },
  { href: "/dashboard/saved", icon: RiBookmarkLine, label: "Saved", color: "bg-emerald-50 text-emerald-600" },
  { href: "/dashboard/reviews", icon: RiStarLine, label: "My Reviews", color: "bg-amber-50 text-amber-600" },
];

export default function DashboardHome() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-ink mb-1">Welcome back, {user?.name?.split(" ")[0] || "there"} 👋</h1>
        <p className="text-ink-muted text-sm">Here's a quick overview of your account.</p>
      </div>

      {/* Premium Banner */}
      {!user?.isPremium && (
        <div className="bg-primary-600 rounded-2xl p-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-display font-bold text-white text-base mb-1">Unlock Premium Access</p>
            <p className="text-primary-200 text-sm">Get unlimited access to all private prompts for just $5.</p>
          </div>
          <Link href="/payment" className="shrink-0 bg-white text-primary-700 font-bold text-sm px-4 py-2 rounded-xl hover:bg-primary-50 transition-colors flex items-center gap-1.5">
            <RiSparklingFill /> Upgrade
          </Link>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {quickLinks.map((l) => (
          <Link key={l.href} href={l.href} className="card p-5 flex flex-col items-center gap-3 hover:scale-[1.02] transition-transform text-center">
            <span className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${l.color}`}><l.icon /></span>
            <span className="font-semibold text-sm text-ink">{l.label}</span>
          </Link>
        ))}
      </div>

      <div className="card p-6 flex flex-col items-center gap-3 text-center">
        <RiAddLine className="text-3xl text-primary-400" />
        <p className="font-display font-bold text-base text-ink">Share your first prompt</p>
        <p className="text-sm text-ink-muted">Contribute to the community and build your creator profile.</p>
        <Link href="/dashboard/add-prompt" className="btn-primary gap-1.5">Add Prompt <RiArrowRightLine /></Link>
      </div>
    </div>
  );
}
