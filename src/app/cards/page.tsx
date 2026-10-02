"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Search, Layers, Image as ImageIcon, Type, X } from "lucide-react";
import { CardView } from "@/components/CardView";
import { IMAGE_CARDS, WORD_CARDS } from "@/repositories/cardRepository";
import { ImageCard, WordCard } from "@/types/card";

export default function MobileCardsGalleryPage() {
  const [activeTab, setActiveTab] = useState<"image" | "word">("image");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImageCard, setSelectedImageCard] = useState<ImageCard | null>(null);
  const [selectedWordCard, setSelectedWordCard] = useState<WordCard | null>(null);

  const filteredImageCards = IMAGE_CARDS.filter(
    (c) =>
      c.alt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.artBrief.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.includes(searchQuery)
  );

  const filteredWordCards = WORD_CARDS.filter(
    (w) =>
      w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.pinyin && w.pinyin.toLowerCase().includes(searchQuery.toLowerCase())) ||
      w.id.includes(searchQuery)
  );

  return (
    <div className="flex-1 flex flex-col px-4 pt-3 pb-6 space-y-4">
      {/* 顶部移动端控制栏（Segmented Control + Search） */}
      <div className="space-y-3 sticky top-0 bg-[#F6F3EC]/95 backdrop-blur-md z-30 pt-1 pb-2">
        {/* iOS 风格分段控制器 */}
        <div className="flex items-center p-1 rounded-full bg-[#EAE4D7] border border-[#DDD5C4]">
          <button
            onClick={() => setActiveTab("image")}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === "image"
                ? "bg-white text-charcoal-900 shadow-xs"
                : "text-charcoal-600"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>水彩画图卡 (88)</span>
          </button>

          <button
            onClick={() => setActiveTab("word")}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === "word"
                ? "bg-white text-charcoal-900 shadow-xs"
                : "text-charcoal-600"
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>词语卡 (88)</span>
          </button>
        </div>

        {/* 搜索框 */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-charcoal-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === "image" ? "搜索意境或描述..." : "搜索词语或拼音..."}
            className="w-full pl-8 pr-4 py-1.5 rounded-full bg-white border border-[#E0D8C7] text-xs text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:border-insight"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2 text-charcoal-400"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 卡牌两列/三列移动端展示 */}
      {activeTab === "image" ? (
        <div className="grid grid-cols-2 gap-3 pb-6">
          {filteredImageCards.map((card, idx) => (
            <div
              key={card.id}
              onClick={() => setSelectedImageCard(card)}
              className="cursor-pointer flex flex-col items-center p-2 rounded-2xl bg-white border border-[#E8E2D5] active:scale-95 transition-transform shadow-2xs"
            >
              <div className="w-full aspect-[3/4] rounded-xl overflow-hidden mb-1.5">
                <CardView
                  card={card}
                  type="image"
                  isFlipped={true}
                  className="w-full h-full pointer-events-none"
                />
              </div>
              <div className="w-full text-center px-0.5">
                <span className="text-[9px] text-charcoal-400 font-serif block">
                  NO. {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="text-[11px] text-charcoal-800 line-clamp-1 font-sans font-medium">
                  {card.alt.split("下的")[0].split("中的")[0] || card.alt}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2.5 pb-6">
          {filteredWordCards.map((word, idx) => (
            <div
              key={word.id}
              onClick={() => setSelectedWordCard(word)}
              className="cursor-pointer flex flex-col items-center justify-between p-3 aspect-[3/4] rounded-2xl bg-white border border-[#E8E2D5] active:scale-95 transition-transform shadow-2xs text-center"
            >
              <span className="text-[8px] text-charcoal-400 font-serif self-start">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <div>
                <span className="text-base font-serif text-charcoal-900 block">
                  {word.word}
                </span>
                <span className="text-[9px] text-charcoal-400 font-sans block mt-0.5">
                  {word.pinyin}
                </span>
              </div>
              <span className="w-1 h-1 rounded-full bg-insight/40 self-end" />
            </div>
          ))}
        </div>
      )}

      {/* 图像卡原生底部抽屉弹窗 */}
      {selectedImageCard && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal-900/50 backdrop-blur-xs">
          <div className="bg-[#FAF8F4] w-full max-w-md rounded-t-3xl p-5 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-200 border-t border-[#E5DEC9] max-h-[85vh] overflow-y-auto hide-scrollbar">
            <div className="w-10 h-1 rounded-full bg-charcoal-300 mx-auto -mt-1" />

            <div className="flex items-center justify-between">
              <span className="text-[10px] font-serif uppercase tracking-widest text-insight">
                {selectedImageCard.id.toUpperCase()} · 水彩画卡
              </span>
              <button
                onClick={() => setSelectedImageCard(null)}
                className="p-1 rounded-full text-charcoal-400 hover:text-charcoal-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-48 h-[256px] mx-auto rounded-2xl overflow-hidden shadow-card">
              <CardView
                card={selectedImageCard}
                type="image"
                isFlipped={true}
                className="w-full h-full"
              />
            </div>

            <div className="text-center space-y-1 pt-1">
              <h3 className="text-base font-serif text-charcoal-900 font-medium">
                {selectedImageCard.alt}
              </h3>
              <p className="text-xs text-charcoal-500 leading-relaxed font-sans px-2">
                {selectedImageCard.artBrief}
              </p>
            </div>

            <button
              onClick={() => setSelectedImageCard(null)}
              className="w-full py-3 rounded-full bg-charcoal-900 text-white text-xs font-medium"
            >
              收起
            </button>
          </div>
        </div>
      )}

      {/* 词语卡原生底部抽屉弹窗 */}
      {selectedWordCard && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal-900/50 backdrop-blur-xs">
          <div className="bg-[#FAF8F4] w-full max-w-md rounded-t-3xl p-6 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-200 border-t border-[#E5DEC9] text-center">
            <div className="w-10 h-1 rounded-full bg-charcoal-300 mx-auto -mt-2" />

            <div className="py-4 space-y-1">
              <span className="text-xs font-serif text-charcoal-400">
                {selectedWordCard.pinyin}
              </span>
              <h2 className="text-3xl font-serif text-charcoal-900">
                {selectedWordCard.word}
              </h2>
            </div>

            <p className="text-xs text-charcoal-500 px-4 leading-relaxed font-sans">
              将这个词带入你最近思索的一件事中，看看会产生怎样的体会。
            </p>

            <button
              onClick={() => setSelectedWordCard(null)}
              className="w-full py-3 rounded-full bg-charcoal-900 text-white text-xs font-medium"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
