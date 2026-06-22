"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiSparklingFill, RiMenuLine, RiCloseLine, RiDashboardLine,
  RiLogoutBoxLine, RiUserLine, RiArrowDownSLine, RiSunLine, RiMoonLine,
} from "react-icons/ri";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import toast from "react-hot-toast";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "All Prompts", href: "/prompts" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const { user, logout } = useAuth();
  const theme = useTheme(); const dark = theme?.dark ?? false; const toggle = theme?.toggle ?? (() => {});
  const pathname = usePathname();
  const router = useRouter();
  const dropRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    router.push("/");
    setDropOpen(false);
    setMenuOpen(false);
  };

  const getDashboardPath = () => {
    if (user?.role === "admin") return "/dashboard/admin";
    if (user?.role === "creator") return "/dashboard/creator";
    return "/dashboard";
  };

  const roleBadge = { admin: "bg-red-100 text-red-700", creator: "bg-violet-100 text-violet-700", user: "bg-blue-100 text-blue-700" };

  const navBg = scrolled
    ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200 dark:border-slate-700 shadow-sm"
    : "bg-transparent";

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${navBg}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <RiSparklingFill className="text-white text-lg" />
          </span>
          <span className="font-bold text-lg text-gray-900 dark:text-white">Prompt<span className="text-blue-600">Hive</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === link.href
                ? "text-blue-600 bg-blue-50 dark:bg-blue-900/30"
                : "text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800"
            }`}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {/* Dark/Light Toggle */}
          <button
            onClick={toggle}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {dark ? <RiSunLine className="text-amber-400 text-lg" /> : <RiMoonLine className="text-lg" />}
          </button>

          {user ? (
            <div className="relative" ref={dropRef}>
              <button onClick={() => setDropOpen(!dropOpen)} className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-gray-200 dark:border-slate-700 hover:border-blue-300 transition-colors bg-white dark:bg-slate-800">
                {/* Avatar */}
                <div className="w-7 h-7 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center shrink-0">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
                  ) : (
                    <span className="text-blue-700 font-bold text-xs">{user.name?.[0]?.toUpperCase()}</span>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-slate-200 max-w-[90px] truncate">{user.name?.split(" ")[0]}</span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full capitalize ${roleBadge[user.role] || roleBadge.user}`}>{user.role}</span>
                <RiArrowDownSLine className={`text-gray-400 transition-transform text-sm ${dropOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {dropOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-56 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-xl overflow-hidden z-50"
                  >
                    <div className="p-3 border-b border-gray-100 dark:border-slate-700">
                      <p className="text-xs text-gray-400 dark:text-slate-500 mb-0.5">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.email}</p>
                      {user.isPremium && <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">⭐ Premium</span>}
                    </div>
                    <div className="p-1">
                      <Link href={getDashboardPath()} onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                        <RiDashboardLine className="text-blue-500" /> Dashboard
                      </Link>
                      <Link href="/dashboard/profile" onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                        <RiUserLine className="text-gray-400" /> Profile
                      </Link>
                      <button onClick={toggle} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                        {dark ? <RiSunLine className="text-amber-400" /> : <RiMoonLine className="text-gray-400" />}
                        {dark ? "Light Mode" : "Dark Mode"}
                      </button>
                      <div className="my-1 border-t border-gray-100 dark:border-slate-700" />
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <RiLogoutBoxLine /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-semibold text-gray-700 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 transition-colors bg-white dark:bg-slate-800">Login</Link>
              <Link href="/register" className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <button onClick={toggle} className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300">
            {dark ? <RiSunLine className="text-amber-400" /> : <RiMoonLine />}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300">
            {menuOpen ? <RiCloseLine className="text-lg" /> : <RiMenuLine className="text-lg" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 shadow-lg px-4 pb-4 pt-2 space-y-1"
          >
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${pathname === link.href ? "text-blue-600 bg-blue-50 dark:bg-blue-900/30" : "text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"}`}>
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href={getDashboardPath()} onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800">Dashboard</Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">Logout</button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link href="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-semibold text-gray-700 dark:text-slate-300">Login</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="flex-1 text-center px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold">Register</Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
