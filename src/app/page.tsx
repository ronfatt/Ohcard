"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  HelpCircle,
  Clock,
  Layers,
  Compass,
  X,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { CardView } from "@/components/CardView";
import { CardRepository } from "@/repositories/cardRepository";
import { SessionStore } from "@/services/sessionStore";
import { ReflectionRecord } from "@/types/session";

const QUICK_THEMES = [
  "最近有点累",
  "关系里有些话想说",
  "我正面临一个选择",
  "想更了解自己",
  "不设主题，随意探索",
];

export default function MobileAppHomePage() {
  const router = useRouter();
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [recentRecord, setRecentRecord] = useState<ReflectionRecord | null>(null);

  // 展示一张极具艺术美感的特色水彩卡
  const sampleCard = CardRepository.getImageCardById("img_01");
  const sampleWord = CardRepository.getWordCardById("word_03"); // 等待

  useEffect(() => {
    const list = SessionStore.getSavedReflections();
    if (list.length > 0) {
      setRecentRecord(list[0]);
    }
  }, []);

  const handleStartWithTheme = (theme: string) => {
    const s = SessionStore.createSession(theme);
    router.push(`/session/${s.id}`);
  };

  return (
    <div className="flex-1 flex flex-col justify-between px-5 pt-4 pb-4 space-y-6">
      {/* 顶部温和问候与说明 */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-serif text-insight uppercase tracking-widest font-medium">
            DAILY MINDFULNESS
          </span>
          <button
            onClick={() => setShowHowItWorks(true)}
            className="inline-flex items-center gap-1 text-[11px] text-charcoal-400 hover:text-charcoal-700 active:scale-95 transition-all p-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>怎么玩</span>
          </button>
        </div>

        <h1 className="text-2xl font-serif text-charcoal-900 leading-snug">
          从一张图，<br />
          开始听见自己。
        </h1>
        <p className="text-xs text-charcoal-500 font-sans">
          不急着找答案。看看眼前的意境让你联想到什么。
        </p>
      </div>

      {/* 核心主卡交互区（微互动卡片叠放） */}
      <div className="flex-1 flex flex-col items-center justify-center py-2 relative my-auto">
        <Link href="/explore" className="relative block group select-none active:scale-95 transition-transform">
          {/* 底层错位阴影卡 */}
          <div className="absolute inset-0 w-52 h-[277px] rounded-2xl bg-[#E8DFC9] rotate-6 translate-x-3 translate-y-2 opacity-60 shadow-xs pointer-events-none" />
          <div className="absolute inset-0 w-52 h-[277px] rounded-2xl bg-[#DFD5BD] -rotate-3 -translate-x-2 translate-y-1 opacity-70 shadow-xs pointer-events-none" />

          {/* 顶层主水彩卡 */}
          <div className="relative w-52 h-[277px] rounded-2xl shadow-[0_16px_36px_-6px_rgba(40,36,30,0.18)]">
            <CardView
              card={sampleCard}
              type="image"
              isFlipped={true}
              interactive={false}
              className="w-full h-full pointer-events-none"
            />
            {/* 点击提示气泡 */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-charcoal-900/90 backdrop-blur-sm text-[#F6F3EC] rounded-full text-[10px] font-sans tracking-wider flex items-center gap-1 shadow-sm whitespace-nowrap">
              <Sparkles className="w-3 h-3 text-insight-light" />
              <span>轻触开启今日探索</span>
            </div>
          </div>
        </Link>
      </div>

      {/* 快速选择主题横滑小胶囊 */}
      <div className="space-y-2">
        <span className="text-[11px] font-medium text-charcoal-400 block px-0.5">
          选择贴近当下的心境：
        </span>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 -mx-5 px-5">
          {QUICK_THEMES.map((theme) => (
            <button
              key={theme}
              onClick={() => handleStartWithTheme(theme)}
              className="px-3.5 py-2 rounded-full bg-white border border-[#E5DEC9] text-xs text-charcoal-700 whitespace-nowrap active:scale-95 active:bg-[#ECE6D8] transition-all shadow-2xs font-sans shrink-0"
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      {/* 最近一次探索记录小卡片（若有） */}
      {recentRecord && (
        <Link
          href={`/reflection/${recentRecord.sessionId || recentRecord.id}`}
          className="p-3.5 rounded-2xl bg-white border border-[#E8E2D5] active:scale-[0.98] transition-transform flex items-center justify-between shadow-2xs"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-13 rounded-lg overflow-hidden shrink-0 border border-[#E0D8C7]">
              <CardView
                card={recentRecord.imageCard}
                type="image"
                isFlipped={true}
                size="sm"
                className="w-full h-full pointer-events-none"
              />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-charcoal-400 font-serif flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>上次探索</span>
              </div>
              <p className="text-xs font-medium text-charcoal-900 truncate">
                {recentRecord.topic}
              </p>
              <p className="text-[11px] text-charcoal-500 truncate italic">
                “{recentRecord.userExpressions.attraction}”
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-charcoal-300 shrink-0 ml-2" />
        </Link>
      )}

      {/* 底部原生主操作按钮 */}
      <div className="pt-1">
        <Link
          href="/explore"
          className="w-full py-3.5 rounded-full bg-charcoal-900 text-[#F6F3EC] active:scale-[0.98] transition-transform text-sm font-medium flex items-center justify-center gap-2 shadow-md hover:bg-insight"
        >
          <Sparkles className="w-4 h-4 text-insight-light" />
          <span>开始一次探索</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <p className="text-center text-[10px] text-charcoal-400 pt-2">
          离线私密存储 · 纯粹的自我对话 · 不作心理定性
        </p>
      </div>

      {/* 怎么玩原生底部抽屉（Bottom Sheet） */}
      {showHowItWorks && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal-900/50 backdrop-blur-xs">
          <div className="bg-[#FAF8F4] w-full max-w-md rounded-t-3xl p-6 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-200 border-t border-[#E5DEC9]">
            <div className="w-10 h-1 rounded-full bg-charcoal-300 mx-auto -mt-2" />

            <div className="flex items-center justify-between pt-1">
              <h3 className="text-lg font-serif text-charcoal-900">
                玩法与陪伴理念
              </h3>
              <button
                onClick={() => setShowHowItWorks(false)}
                className="p-1 rounded-full text-charcoal-400 hover:text-charcoal-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-charcoal-600 leading-relaxed font-sans">
              <p>
                <strong>1. 绝非占卜预测：</strong>
                我们不预测未来，也不给出所谓“权威结论”。卡牌只是一面镜子，映出的是你心里原本就有的真实体会。
              </p>
              <p>
                <strong>2. 你的感受永远是对的：</strong>
                同一张画，有人看见宁静，有人看见孤单。相信你第一时间的直接联想。
              </p>
              <p>
                <strong>3. 完全自主掌控：</strong>
                所有追问随时可以修改、否认或直接跳过，过程全程保存在本地。
              </p>
            </div>

            <button
              onClick={() => setShowHowItWorks(false)}
              className="w-full py-3 rounded-full bg-charcoal-900 text-white text-xs font-medium"
            >
              我知道了
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
