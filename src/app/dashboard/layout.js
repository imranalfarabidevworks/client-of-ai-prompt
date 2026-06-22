"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiSparklingFill, RiDashboardLine, RiAddLine, RiFileListLine,
  RiBookmarkLine, RiStarLine, RiUserLine, RiMenuLine,
  RiLogoutBoxLine, RiTeamLine, RiMoneyDollarCircleLine,
  RiFlagLine, RiBarChartLine, RiArrowLeftLine, RiShieldLine,
  RiBrushLine, RiSparklingLine,
} from "react-icons/ri";
import { useAuth } from "@/context/AuthContext";
import PrivateRoute from "@/components/shared/PrivateRoute";
import toast from "react-hot-toast";

// ─── Sidebar links per role ───────────────────
const userLinks = [
  { href: "/dashboard",            label: "Dashboard",     icon: RiDashboardLine, exact: true },
  { href: "/dashboard/add-prompt", label: "Add Prompt",    icon: RiAddLine },
  { href: "/dashboard/my-prompts", label: "My Prompts",    icon: RiFileListLine },
  { href: "/dashboard/saved",      label: "Saved Prompts", icon: RiBookmarkLine },
  { href: "/dashboard/reviews",    label: "My Reviews",    icon: RiStarLine },
  { href: "/dashboard/profile",    label: "Profile",       icon: RiUserLine },
];

const creatorLinks = [
  { href: "/dashboard/creator",    label: "Dashboard",     icon: RiDashboardLine, exact: true },
  { href: "/dashboard/add-prompt", label: "Add Prompt",    icon: RiAddLine },
  { href: "/dashboard/my-prompts", label: "My Prompts",    icon: RiFileListLine },
  { href: "/dashboard/saved",      label: "Saved Prompts", icon: RiBookmarkLine },
  { href: "/dashboard/reviews",    label: "My Reviews",    icon: RiStarLine },
  { href: "/dashboard/profile",    label: "Profile",       icon: RiUserLine },
];

const adminLinks = [
  { href: "/dashboard/admin",                  label: "Overview",       icon: RiDashboardLine, exact: true },
  { href: "/dashboard/admin/users",            label: "All Users",      icon: RiTeamLine },
  { href: "/dashboard/admin/all-prompts",      label: "All Prompts",    icon: RiFileListLine },
  { href: "/dashboard/admin/payments",         label: "Payments",       icon: RiMoneyDollarCircleLine },
  { href: "/dashboard/admin/reported",         label: "Reported",       icon: RiFlagLine },
  { href: "/dashboard/admin/analytics",        label: "Analytics",      icon: RiBarChartLine },
  { href: "/dashboard/profile",                label: "Profile",        icon: RiUserLine },
];

const roleMeta = {
  admin:   { label: "Admin Panel",     badge: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",     icon: RiShieldLine },
  creator: { label: "Creator Studio",  badge: "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400", icon: RiBrushLine },
  user:    { label: "My Dashboard",    badge: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",   icon: RiSparklingLine },
};

function SidebarLink({ href, label, icon: Icon, exact }) {
  const pathname = usePathname();
  const isActive = exact
    ? pathname === href
    : pathname.startsWith(href) && href !== "/dashboard" && href !== "/dashboard/creator" && href !== "/dashboard/admin";

  return (
    <Link href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
        isActive
          ? "bg-blue-600 text-white shadow-sm"
          : "text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white"
      }`}>
      <Icon className="text-base shrink-0" /> {label}
    </Link>
  );
}

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    router.push("/");
  };

  const role = user?.role || "user";
  const links = role === "admin" ? adminLinks : role === "creator" ? creatorLinks : userLinks;
  const meta = roleMeta[role] || roleMeta.user;

  const Sidebar = ({ onClose }) => (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700">
      {/* Logo */}
      <div className="p-5 border-b border-gray-100 dark:border-slate-700">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <RiSparklingFill className="text-white" />
          </span>
          <span className="font-bold text-base text-gray-900 dark:text-white">
            Prompt<span className="text-blue-600">Hive</span>
          </span>
        </Link>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
            ) : null}
            <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
              {user?.name?.[0]?.toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{user?.name}</p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${meta.badge}`}>
              {meta.label}
            </span>
          </div>
        </div>
        {user?.isPremium && (
          <div className="flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-2 py-1 rounded-lg">
            <RiSparklingFill /> Premium Member
          </div>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {links.map((link) => (
          <SidebarLink key={link.href} {...link} onClick={onClose} />
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-gray-100 dark:border-slate-700 space-y-0.5">
        <Link href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
          <RiArrowLeftLine /> Back to Site
        </Link>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
          <RiLogoutBoxLine /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <PrivateRoute>
      <div className="flex h-screen bg-gray-50 dark:bg-slate-900 overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex flex-col w-60 shrink-0">
          <Sidebar onClose={() => {}} />
        </aside>

        {/* Mobile sidebar */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 bg-black/40 z-40 lg:hidden" />
              <motion.aside
                initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed left-0 top-0 bottom-0 w-60 z-50 lg:hidden">
                <Sidebar onClose={() => setMobileOpen(false)} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile topbar */}
          <header className="lg:hidden flex items-center justify-between px-4 h-14 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shrink-0">
            <button onClick={() => setMobileOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-300">
              <RiMenuLine />
            </button>
            <span className="font-bold text-base text-gray-900 dark:text-white">
              Prompt<span className="text-blue-600">Hive</span>
            </span>
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-5 md:p-8 bg-gray-50 dark:bg-slate-900">
            {children}
          </main>
        </div>
      </div>
    </PrivateRoute>
  );
}
