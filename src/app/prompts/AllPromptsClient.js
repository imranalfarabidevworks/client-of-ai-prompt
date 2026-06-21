"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  RiSearchLine, RiSortAsc, RiFileCopyLine,
  RiBookmarkLine, RiBookmarkFill, RiStarFill,
  RiArrowRightLine, RiLoader4Line, RiLockFill,
} from "react-icons/ri";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

const CATEGORIES = ["All","Writing","Code","Design","Marketing","Research","Education","Business","SEO"];
const AI_TOOLS   = ["All","ChatGPT","Gemini","Claude","Midjourney","Dall-E","Copilot"];
const DIFFICULTIES = ["All","Beginner","Intermediate","Pro"];
const SORT_OPTIONS = [
  { value: "latest",  label: "Latest" },
  { value: "popular", label: "Most Popular" },
  { value: "copied",  label: "Most Copied" },
];

const difficultyColor = {
  Beginner:     "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  Intermediate: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  Pro:          "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800",
};

// 20 mock prompts — always available regardless of server
const MOCK_PROMPTS = [
  { _id:"1",  title:"Ultimate Blog Post Generator",   description:"Generate SEO-optimised blog posts with structure and CTA.", category:"Writing",   aiTool:"ChatGPT",   tags:["SEO","Blog","Content"],      difficulty:"Beginner",     copyCount:3241, rating:4.8, reviewCount:124, creator:{name:"Rafiq Islam",    avatar:"RI"}, visibility:"public",  thumbnail:"https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=220&fit=crop" },
  { _id:"2",  title:"Photorealistic Product Shot",    description:"Studio-quality product images with precise lighting control.", category:"Design",    aiTool:"Midjourney",tags:["Product","Studio"],          difficulty:"Intermediate", copyCount:2180, rating:4.9, reviewCount:98,  creator:{name:"Nadia Khanom",  avatar:"NK"}, visibility:"private", thumbnail:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=220&fit=crop" },
  { _id:"3",  title:"Full-Stack Code Reviewer",       description:"Reviews code for bugs and best practices across frameworks.", category:"Code",      aiTool:"Claude",    tags:["Code","Review","DevOps"],   difficulty:"Pro",          copyCount:1894, rating:4.7, reviewCount:77,  creator:{name:"Tanvir Ahmed",  avatar:"TA"}, visibility:"private", thumbnail:"https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=220&fit=crop" },
  { _id:"4",  title:"LinkedIn Cold Outreach Machine", description:"Non-spammy LinkedIn messages that get replies in any industry.", category:"Marketing", aiTool:"ChatGPT",   tags:["LinkedIn","Outreach","B2B"],difficulty:"Beginner",     copyCount:2877, rating:4.6, reviewCount:143, creator:{name:"Sara Jahan",    avatar:"SJ"}, visibility:"public",  thumbnail:"https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=400&h=220&fit=crop" },
  { _id:"5",  title:"Research Deep-Dive Analyst",     description:"Breaks research papers into summaries and practical insights.", category:"Research",  aiTool:"Gemini",    tags:["Research","Academic"],      difficulty:"Intermediate", copyCount:1456, rating:4.8, reviewCount:61,  creator:{name:"Karim Uddin",   avatar:"KU"}, visibility:"public",  thumbnail:"https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=220&fit=crop" },
  { _id:"6",  title:"E-commerce Product Description", description:"Conversion-focused descriptions with emotional triggers.", category:"Marketing", aiTool:"ChatGPT",   tags:["E-commerce","Copy","Sales"],difficulty:"Beginner",     copyCount:3102, rating:4.9, reviewCount:189, creator:{name:"Mim Akter",     avatar:"MA"}, visibility:"public",  thumbnail:"https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=220&fit=crop" },
  { _id:"7",  title:"YouTube Script Writer Pro",      description:"Engaging scripts with hooks, storytelling, and CTAs.", category:"Writing",   aiTool:"ChatGPT",   tags:["YouTube","Script","Video"], difficulty:"Beginner",     copyCount:1677, rating:4.5, reviewCount:55,  creator:{name:"Rahim Khan",    avatar:"RK"}, visibility:"public",  thumbnail:"https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=220&fit=crop" },
  { _id:"8",  title:"Email Marketing Copywriter",     description:"High-converting email sequences for campaigns and launches.", category:"Marketing", aiTool:"ChatGPT",   tags:["Email","Copy","Marketing"],difficulty:"Intermediate", copyCount:2340, rating:4.7, reviewCount:88,  creator:{name:"Salma Begum",   avatar:"SB"}, visibility:"private", thumbnail:"https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&h=220&fit=crop" },
  { _id:"9",  title:"Social Media Calendar Builder",  description:"30-day content calendar with ideas and hashtags.", category:"Marketing", aiTool:"Gemini",    tags:["Social","Calendar"],        difficulty:"Beginner",     copyCount:1890, rating:4.6, reviewCount:72,  creator:{name:"Jakir Hossain", avatar:"JH"}, visibility:"public",  thumbnail:"https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=220&fit=crop" },
  { _id:"10", title:"UI/UX Design Feedback Bot",      description:"Actionable design feedback based on UX principles.", category:"Design",    aiTool:"Claude",    tags:["UI","UX","Design"],         difficulty:"Pro",          copyCount:1120, rating:4.8, reviewCount:44,  creator:{name:"Rupa Roy",      avatar:"RR"}, visibility:"private", thumbnail:"https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=220&fit=crop" },
  { _id:"11", title:"Business Plan Builder",          description:"Comprehensive plans with market analysis and projections.", category:"Business",  aiTool:"ChatGPT",   tags:["Business","Plan"],          difficulty:"Intermediate", copyCount:980,  rating:4.5, reviewCount:38,  creator:{name:"Farhan Ali",    avatar:"FA"}, visibility:"public",  thumbnail:"https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=220&fit=crop" },
  { _id:"12", title:"Interview Prep Coach",           description:"Custom questions, answers, and confidence tips for any job.", category:"Education", aiTool:"Gemini",    tags:["Interview","Career"],       difficulty:"Beginner",     copyCount:1540, rating:4.7, reviewCount:61,  creator:{name:"Nasrin Akter",  avatar:"NA"}, visibility:"public",  thumbnail:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=220&fit=crop" },
  { _id:"13", title:"SEO Meta Tag Generator",         description:"Optimised meta titles, descriptions, and OG tags.", category:"SEO",       aiTool:"ChatGPT",   tags:["SEO","Meta","Tags"],        difficulty:"Beginner",     copyCount:2100, rating:4.6, reviewCount:95,  creator:{name:"Rafiq Islam",   avatar:"RI"}, visibility:"public",  thumbnail:"https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=400&h=220&fit=crop" },
  { _id:"14", title:"Python Code Debugger",           description:"Debugs Python by finding errors and providing fixes.", category:"Code",      aiTool:"Claude",    tags:["Python","Debug","Code"],    difficulty:"Intermediate", copyCount:1750, rating:4.8, reviewCount:82,  creator:{name:"Tanvir Ahmed",  avatar:"TA"}, visibility:"public",  thumbnail:"https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=220&fit=crop" },
  { _id:"15", title:"Children's Story Creator",       description:"Age-appropriate stories with moral lessons and characters.", category:"Writing",   aiTool:"ChatGPT",   tags:["Story","Children"],         difficulty:"Beginner",     copyCount:890,  rating:4.5, reviewCount:33,  creator:{name:"Mim Akter",     avatar:"MA"}, visibility:"public",  thumbnail:"https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=220&fit=crop" },
  { _id:"16", title:"Midjourney Style Transfer",      description:"Transfers famous artistic styles into modern image prompts.", category:"Design",    aiTool:"Midjourney",tags:["Art","Style","Creative"],   difficulty:"Pro",          copyCount:1320, rating:4.9, reviewCount:67,  creator:{name:"Nadia Khanom",  avatar:"NK"}, visibility:"private", thumbnail:"https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&h=220&fit=crop" },
  { _id:"17", title:"Customer Support Bot Script",    description:"Empathetic support scripts for any product or service.", category:"Business",  aiTool:"ChatGPT",   tags:["Support","Customer"],       difficulty:"Beginner",     copyCount:1100, rating:4.4, reviewCount:41,  creator:{name:"Sara Jahan",    avatar:"SJ"}, visibility:"public",  thumbnail:"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=220&fit=crop" },
  { _id:"18", title:"Academic Essay Outliner",        description:"Detailed essay outlines with thesis, arguments, conclusions.", category:"Education", aiTool:"Gemini",    tags:["Essay","Academic"],         difficulty:"Intermediate", copyCount:760,  rating:4.6, reviewCount:29,  creator:{name:"Karim Uddin",   avatar:"KU"}, visibility:"public",  thumbnail:"https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=220&fit=crop" },
  { _id:"19", title:"React Component Generator",      description:"Clean reusable React components with TypeScript and props.", category:"Code",      aiTool:"Copilot",   tags:["React","TypeScript"],       difficulty:"Pro",          copyCount:2050, rating:4.8, reviewCount:91,  creator:{name:"Jakir Hossain", avatar:"JH"}, visibility:"private", thumbnail:"https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=220&fit=crop" },
  { _id:"20", title:"Brand Voice Style Guide",        description:"Comprehensive brand voice guide with tone and vocabulary.", category:"Business",  aiTool:"Claude",    tags:["Brand","Voice","Marketing"],difficulty:"Intermediate", copyCount:940,  rating:4.7, reviewCount:48,  creator:{name:"Rahim Khan",    avatar:"RK"}, visibility:"public",  thumbnail:"https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=220&fit=crop" },
];

function PromptCard({ prompt, bookmarked, onBookmark, user }) {
  const [imgError, setImgError] = useState(false);
  const isPremium = prompt.visibility === "private";
  const isLocked  = isPremium && !user?.isPremium;

  const handleCopy = async () => {
    if (!user) return toast.error("Please login to copy prompts");
    if (isLocked) return toast.error("Subscribe to Premium to copy this prompt");
    await navigator.clipboard.writeText(prompt.promptContent || prompt.title).catch(() => {});
    api.patch(`/api/prompts/${prompt._id}/copy`).catch(() => {});
    toast.success("Copied to clipboard! ✅");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col"
    >
      {/* Thumbnail */}
      <div className="relative h-44 bg-gray-100 dark:bg-slate-700 overflow-hidden shrink-0">
        {!imgError ? (
          <img
            src={prompt.thumbnail}
            alt={prompt.title}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isLocked ? "blur-sm" : ""}`}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-700 dark:to-slate-600">
            🤖
          </div>
        )}
        {/* AI Tool badge */}
        <div className="absolute top-3 left-3">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-gray-700 dark:text-slate-200 backdrop-blur-sm border border-gray-200 dark:border-slate-700 shadow-sm">
            {prompt.aiTool}
          </span>
        </div>
        {/* Premium badge */}
        {isPremium && (
          <div className="absolute top-3 right-3">
            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-sm">
              <RiLockFill className="text-[9px]" /> PREMIUM
            </span>
          </div>
        )}
        {/* Bookmark */}
        <button
          onClick={() => onBookmark(prompt._id)}
          className="absolute bottom-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-gray-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors shadow-sm"
        >
          {bookmarked
            ? <RiBookmarkFill className="text-blue-600 text-sm" />
            : <RiBookmarkLine className="text-gray-500 text-sm" />}
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${difficultyColor[prompt.difficulty]}`}>
            {prompt.difficulty}
          </span>
          <span className="text-xs text-gray-400 dark:text-slate-500">· {prompt.category}</span>
        </div>

        <h3 className={`font-bold text-sm text-gray-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 ${isLocked ? "blur-[2px] select-none" : ""}`}>
          {prompt.title}
        </h3>

        <p className={`text-xs text-gray-500 dark:text-slate-400 leading-relaxed line-clamp-2 ${isLocked ? "blur-[2px] select-none" : ""}`}>
          {prompt.description}
        </p>

        <div className={`flex flex-wrap gap-1 ${isLocked ? "blur-[2px] select-none" : ""}`}>
          {prompt.tags?.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
              {tag}
            </span>
          ))}
        </div>

        {/* Stats + Creator */}
        <div className={`mt-auto pt-3 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between gap-2 ${isLocked ? "blur-[2px] select-none" : ""}`}>
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-slate-400">
            <span className="flex items-center gap-1"><RiStarFill className="text-amber-400" />{prompt.rating}</span>
            <span className="flex items-center gap-1"><RiFileCopyLine className="text-gray-400" />{prompt.copyCount?.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[9px] font-bold shrink-0">
              {prompt.creator?.avatar}
            </div>
            <span className="text-xs text-gray-500 dark:text-slate-400 truncate max-w-[70px]">{prompt.creator?.name}</span>
          </div>
        </div>

        {/* CTA */}
        {!user ? (
          <Link href="/login" className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 text-xs font-semibold hover:border-blue-400 hover:text-blue-600 transition-colors">
            Login to View <RiArrowRightLine />
          </Link>
        ) : isLocked ? (
          <Link href="/payment" className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold hover:opacity-90 transition-opacity">
            <RiLockFill /> Subscribe to Premium
          </Link>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleCopy} className="flex items-center justify-center gap-1 flex-1 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 text-xs font-semibold hover:border-blue-400 hover:text-blue-600 transition-colors">
              <RiFileCopyLine /> Copy
            </button>
            <Link href={`/prompts/${prompt._id}`} className="flex items-center justify-center gap-1 flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors">
              Details <RiArrowRightLine />
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Apply all filters + sort on mock data
function filterMock(prompts, { search, category, aiTool, difficulty, sort }) {
  let filtered = [...prompts];
  if (search)
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
      p.aiTool.toLowerCase().includes(search.toLowerCase())
    );
  if (category && category !== "All") filtered = filtered.filter(p => p.category === category);
  if (aiTool   && aiTool   !== "All") filtered = filtered.filter(p => p.aiTool   === aiTool);
  if (difficulty && difficulty !== "All") filtered = filtered.filter(p => p.difficulty === difficulty);
  if (sort === "popular") filtered.sort((a, b) => b.rating    - a.rating);
  else if (sort === "copied") filtered.sort((a, b) => b.copyCount - a.copyCount);
  // default: latest — keep original order
  return filtered;
}

export default function AllPromptsClient() {
  const searchParams = useSearchParams();
  const { user }     = useAuth();

  const [prompts,   setPrompts]   = useState([]);
  const [total,     setTotal]     = useState(0);
  const [loading,   setLoading]   = useState(true);
  const [page,      setPage]      = useState(1);
  const [bookmarks, setBookmarks] = useState({});

  const [search,     setSearch]     = useState(searchParams.get("search") || "");
  const [category,   setCategory]   = useState("All");
  const [aiTool,     setAiTool]     = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  // Ignore sort param from URL — always start with "latest"
  const [sort, setSort] = useState("latest");

  const LIMIT = 9;

  const fetchPrompts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: LIMIT, sort });
      if (search)     params.set("search",     search);
      if (category   !== "All") params.set("category",   category);
      if (aiTool     !== "All") params.set("aiTool",     aiTool);
      if (difficulty !== "All") params.set("difficulty", difficulty);

      const res = await api.get(`/api/prompts?${params}`);
      if (res.data.prompts && res.data.prompts.length > 0) {
        setPrompts(res.data.prompts);
        setTotal(res.data.total);
      } else {
        throw new Error("empty");
      }
    } catch {
      // Always fall back to mock data
      const filtered = filterMock(MOCK_PROMPTS, { search, category, aiTool, difficulty, sort });
      setTotal(filtered.length);
      setPrompts(filtered.slice((page - 1) * LIMIT, page * LIMIT));
    } finally {
      setLoading(false);
    }
  }, [search, category, aiTool, difficulty, sort, page]);

  useEffect(() => { fetchPrompts(); }, [fetchPrompts]);

  const handleBookmark = async (id) => {
    if (!user) return toast.error("Please login to bookmark");
    setBookmarks((p) => ({ ...p, [id]: !p[id] }));
    toast.success(bookmarks[id] ? "Bookmark removed" : "Bookmarked! 🔖");
    api.post(`/api/prompts/${id}/bookmark`).catch(() => {});
  };

  const totalPages = Math.ceil(total / LIMIT);

  const FilterBtn = ({ options, value, set }) => (
    <div className="space-y-0.5">
      {options.map((o) => (
        <button key={o} onClick={() => { set(o); setPage(1); }}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
            value === o
              ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold"
              : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-20">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <h1 className="font-bold text-3xl text-gray-900 dark:text-white mb-1">All Prompts</h1>
            <p className="text-gray-500 dark:text-slate-400 text-sm">
              {total} prompts available · 🔒 Premium prompts require subscription
            </p>
            <div className="mt-5 flex items-center gap-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-2.5 max-w-lg">
              <RiSearchLine className="text-gray-400 shrink-0" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search prompts, tags, AI tools…"
                className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none"
              />
              {search && (
                <button onClick={() => { setSearch(""); setPage(1); }} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-52 shrink-0 space-y-6">
              {[
                { label: "Category",   options: CATEGORIES,   value: category,   set: setCategory },
                { label: "AI Tool",    options: AI_TOOLS,     value: aiTool,     set: setAiTool },
                { label: "Difficulty", options: DIFFICULTIES, value: difficulty, set: setDifficulty },
              ].map(({ label, options, value, set }) => (
                <div key={label}>
                  <p className="text-xs font-bold tracking-widest uppercase text-gray-400 dark:text-slate-500 mb-3">{label}</p>
                  <FilterBtn options={options} value={value} set={set} />
                </div>
              ))}
            </aside>

            {/* Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-gray-500 dark:text-slate-400">{total} results</p>
                <div className="flex items-center gap-2">
                  <RiSortAsc className="text-gray-400 dark:text-slate-500" />
                  <select
                    value={sort}
                    onChange={(e) => { setSort(e.target.value); setPage(1); }}
                    className="text-sm text-gray-900 dark:text-white bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-24">
                  <RiLoader4Line className="text-4xl text-blue-500 animate-spin" />
                </div>
              ) : prompts.length === 0 ? (
                <div className="text-center py-24">
                  <p className="text-5xl mb-4">🔍</p>
                  <p className="font-bold text-lg text-gray-900 dark:text-white mb-2">No prompts found</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Try adjusting your search or filters</p>
                  <button
                    onClick={() => { setSearch(""); setCategory("All"); setAiTool("All"); setDifficulty("All"); setSort("latest"); setPage(1); }}
                    className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {prompts.map((p) => (
                    <PromptCard key={p._id} prompt={p} bookmarked={bookmarks[p._id]} onBookmark={handleBookmark} user={user} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-semibold text-gray-700 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 disabled:opacity-40 transition-colors bg-white dark:bg-slate-800"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                        page === p
                          ? "bg-blue-600 text-white"
                          : "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:border-blue-400"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-semibold text-gray-700 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 disabled:opacity-40 transition-colors bg-white dark:bg-slate-800"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
