import Link from "next/link";
import { RiSparklingFill, RiGithubFill, RiLinkedinFill, RiTwitterXFill } from "react-icons/ri";

const footerLinks = {
  Platform: [{ label: "All Prompts", href: "/prompts" }, { label: "Trending", href: "/prompts?sort=popular" }, { label: "Top Creators", href: "/#creators" }],
  Account: [{ label: "Register", href: "/register" }, { label: "Login", href: "/login" }, { label: "Dashboard", href: "/dashboard" }, { label: "Premium", href: "/payment" }],
  Support: [{ label: "FAQ", href: "#" }, { label: "Privacy Policy", href: "#" }, { label: "Terms of Service", href: "#" }, { label: "Contact", href: "#" }],
};

export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center"><RiSparklingFill className="text-white text-lg" /></span>
              <span className="font-bold text-lg">Prompt<span className="text-blue-400">Hive</span></span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-5">The community marketplace for high-quality AI prompts. Discover, share, and monetize your creativity.</p>
            <div className="flex items-center gap-3">
              {[RiGithubFill, RiLinkedinFill, RiTwitterXFill].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-colors"><Icon className="text-sm" /></a>
              ))}
            </div>
          </div>
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <p className="text-xs font-semibold tracking-widest uppercase text-white/30 mb-4">{group}</p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/30 text-xs">
          <p>© 2025 PromptHive. All rights reserved.</p>
          <p>Built with ❤️ for the AI community</p>
        </div>
      </div>
    </footer>
  );
}
