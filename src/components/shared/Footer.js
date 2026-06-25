import Link from "next/link";
import { RiSparklingFill, RiGithubFill, RiLinkedinFill, RiTwitterXFill, RiShieldLine, RiBrushLine, RiUserLine } from "react-icons/ri";

export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center"><RiSparklingFill className="text-white text-lg" /></span>
              <span className="font-bold text-lg">Prompt<span className="text-blue-400">Hive</span></span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-5">The community marketplace for high-quality AI prompts.</p>
            <div className="flex items-center gap-3">
              {[RiGithubFill, RiLinkedinFill, RiTwitterXFill].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-colors"><Icon className="text-sm" /></a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-white/30 mb-4">Platform</p>
            <ul className="space-y-2.5">
              {[
                { label: "All Prompts", href: "/prompts" },
                { label: "Trending", href: "/prompts?sort=popular" },
                { label: "Top Creators", href: "/#creators" },
                { label: "Demo Users", href: "/demo-users" },
              ].map((l) => (
                <li key={l.label}><Link href={l.href} className="text-sm text-white/60 hover:text-white transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Login by Role */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-white/30 mb-4">Login by Role</p>
            <ul className="space-y-3">
              <li>
                <Link href="/login/user" className="flex items-center gap-2.5 group">
                  <span className="w-7 h-7 rounded-lg bg-blue-600/30 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                    <RiUserLine className="text-blue-400 text-xs" />
                  </span>
                  {/* <div>
                    <p className="text-sm text-white/70 group-hover:text-white transition-colors font-medium">User Login</p>
                    <p className="text-xs text-white/30">Browse & copy prompts</p>
                  </div> */}
                </Link>
              </li>
              <li>
                <Link href="/login/creator" className="flex items-center gap-2.5 group">
                  <span className="w-7 h-7 rounded-lg bg-violet-600/30 flex items-center justify-center group-hover:bg-violet-600 transition-colors">
                    <RiBrushLine className="text-violet-400 text-xs" />
                  </span>
                  <div>
                    <p className="text-sm text-white/70 group-hover:text-white transition-colors font-medium">Creator Login</p>
                    <p className="text-xs text-white/30">Publish & manage prompts</p>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/login/admin" className="flex items-center gap-2.5 group">
                  <span className="w-7 h-7 rounded-lg bg-red-600/30 flex items-center justify-center group-hover:bg-red-600 transition-colors">
                    <RiShieldLine className="text-red-400 text-xs" />
                  </span>
                  <div>
                    <p className="text-sm text-white/70 group-hover:text-white transition-colors font-medium">Admin Login</p>
                    <p className="text-xs text-white/30">Manage platform</p>
                  </div>
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-white/30 mb-4">Account</p>
            <ul className="space-y-2.5">
              {[
                { label: "Register", href: "/register" },
                { label: "Dashboard", href: "/dashboard" },
                { label: "Premium", href: "/payment" },
                { label: "FAQ", href: "#" },
                { label: "Privacy Policy", href: "#" },
              ].map((l) => (
                <li key={l.label}><Link href={l.href} className="text-sm text-white/60 hover:text-white transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/30 text-xs">
          <p>© 2025 PromptHive. All rights reserved.</p>
          <p>Developed By Imran Al Farabi</p>
        </div>
      </div>
    </footer>
  );
}
