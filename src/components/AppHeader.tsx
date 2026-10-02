"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, Sparkles, HelpCircle } from "lucide-react";

export const AppHeader: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === "/";
  const isSession = pathname.startsWith("/session/");

  // 获取页面标题
  const getHeaderTitle = () => {
    if (pathname === "/") return "映见 INSIGHT";
    if (pathname === "/explore") return "选择主题";
    if (pathname.startsWith("/session/")) return "探索进行中";
    if (pathname.startsWith("/reflection/")) return "探索回顾";
    if (pathname === "/cards") return "卡牌库 (88+88)";
    if (pathname === "/journal") return "我的日记";
    if (pathname === "/guides") return "真人带领";
    if (pathname.startsWith("/booking/")) return "预约意向";
    return "映见";
  };

  return (
    <header className="sticky top-0 z-40 w-full mobile-header pt-safe">
      <div className="w-full max-w-md mx-auto px-4 h-12 flex items-center justify-between">
        {/* 左侧：返回箭头或 App 品牌 Logo */}
        <div className="w-16 flex items-center">
          {!isHome ? (
            <button
              onClick={() => router.back()}
              className="p-1 -ml-1 text-charcoal-700 hover:text-charcoal-900 active:scale-90 transition-transform flex items-center"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-insight" />
              <span className="text-[11px] font-serif text-charcoal-400 tracking-widest">
                VER 2.0
              </span>
            </div>
          )}
        </div>

        {/* 中间：居中原生 App 标题 */}
        <div className="flex-1 text-center font-serif text-sm sm:text-base font-medium text-charcoal-900 truncate px-2">
          {getHeaderTitle()}
        </div>

        {/* 右侧：上下文动作 */}
        <div className="w-16 flex items-center justify-end">
          {isHome ? (
            <Link
              href="/explore"
              className="px-2.5 py-1 rounded-full bg-charcoal-900 text-white text-[11px] font-medium active:scale-95 transition-transform flex items-center gap-1 shadow-xs"
            >
              <Sparkles className="w-3 h-3 text-insight-light" />
              <span>抽卡</span>
            </Link>
          ) : (
            <div className="w-6" />
          )}
        </div>
      </div>
    </header>
  );
};
