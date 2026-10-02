"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Users, Sparkles, Layers } from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F6F3EC]/90 backdrop-blur-md border-b border-[#E8E2D5] transition-all">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo 区域 */}
        <Link href="/" className="flex items-baseline gap-2 group">
          <span className="text-xl sm:text-2xl font-serif font-medium tracking-tight text-charcoal-900 group-hover:text-insight transition-colors">
            映见
          </span>
          <span className="text-xs sm:text-sm font-serif italic text-charcoal-400 tracking-widest font-normal">
            INSIGHT
          </span>
        </Link>

        {/* 导航按钮 */}
        <nav className="flex items-center gap-1.5 sm:gap-4 text-xs sm:text-sm">
          <Link
            href="/cards"
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-full transition-colors ${
              pathname === "/cards"
                ? "bg-[#ECE6D8] text-charcoal-900 font-medium"
                : "text-charcoal-600 hover:text-charcoal-900 hover:bg-[#ECE6D8]/50"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>卡牌画廊 (88+88)</span>
          </Link>

          <Link
            href="/journal"
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-full transition-colors ${
              pathname === "/journal"
                ? "bg-[#ECE6D8] text-charcoal-900 font-medium"
                : "text-charcoal-600 hover:text-charcoal-900 hover:bg-[#ECE6D8]/50"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>我的探索</span>
          </Link>

          <Link
            href="/guides"
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-full transition-colors ${
              pathname.startsWith("/guides") || pathname.startsWith("/booking")
                ? "bg-[#ECE6D8] text-charcoal-900 font-medium"
                : "text-charcoal-600 hover:text-charcoal-900 hover:bg-[#ECE6D8]/50"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>认识带领者</span>
          </Link>

          {pathname !== "/explore" && !pathname.startsWith("/session") && (
            <Link
              href="/explore"
              className="hidden sm:inline-flex items-center gap-1.5 py-1.5 px-4 rounded-full bg-charcoal-900 text-[#F6F3EC] hover:bg-insight transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>开始探索</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
