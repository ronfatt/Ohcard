"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Search, Layers, Image as ImageIcon, Type, X, ArrowRight } from "lucide-react";
import { CardView } from "@/components/CardView";
import { CardRepository, IMAGE_CARDS, WORD_CARDS } from "@/repositories/cardRepository";
import { ImageCard, WordCard } from "@/types/card";

export default function CardsGalleryPage() {
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
    <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* 头部标题与定位 */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E2D5] pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage/60 border border-sage-dark/40 text-xs text-charcoal-800">
            <span className="w-1.5 h-1.5 rounded-full bg-insight" />
            <span>原创图像联想体系 · 全库展陈</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-charcoal-900">
            卡牌画廊（88 张水彩图卡 + 88 张词语卡）
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600">
            以水彩湿画法与留白技法呈现的 88 幅意境插画，与 88 个中立开放的联想词语。不作吉凶占卜与性格诊断。
          </p>
        </div>

        <Link
          href="/explore"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-charcoal-900 text-white text-xs font-medium hover:bg-insight transition-all shadow-sm shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>开始一次抽卡探索</span>
        </Link>
      </div>

      {/* 标签页与搜索条 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Tab 切换 */}
        <div className="flex items-center p-1 rounded-full bg-[#EAE4D7] border border-[#DDD5C4] w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("image")}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2 rounded-full text-xs font-medium transition-all ${
              activeTab === "image"
                ? "bg-white text-charcoal-900 shadow-xs"
                : "text-charcoal-600 hover:text-charcoal-900"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>88 张水彩画图卡</span>
            <span className="px-1.5 py-0.5 rounded-full bg-cream-200 text-[10px]">
              {IMAGE_CARDS.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("word")}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2 rounded-full text-xs font-medium transition-all ${
              activeTab === "word"
                ? "bg-white text-charcoal-900 shadow-xs"
                : "text-charcoal-600 hover:text-charcoal-900"
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>88 张词语卡</span>
            <span className="px-1.5 py-0.5 rounded-full bg-cream-200 text-[10px]">
              {WORD_CARDS.length}
            </span>
          </button>
        </div>

        {/* 搜索框 */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === "image" ? "搜索画面描述..." : "搜索词语或拼音..."}
            className="w-full pl-9 pr-4 py-2.5 rounded-full bg-white border border-[#E0D8C7] text-xs text-charcoal-900 focus:outline-none focus:border-insight"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-3 text-charcoal-400 hover:text-charcoal-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 卡牌网格展陈 */}
      {activeTab === "image" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
          {filteredImageCards.map((card, idx) => (
            <div
              key={card.id}
              onClick={() => setSelectedImageCard(card)}
              className="group cursor-pointer flex flex-col items-center p-2.5 rounded-2xl bg-white border border-[#E8E2D5] hover:border-insight/50 hover:shadow-card transition-all"
            >
              <div className="w-full aspect-[3/4] rounded-xl overflow-hidden mb-2">
                <CardView
                  card={card}
                  type="image"
                  isFlipped={true}
                  className="w-full h-full pointer-events-none"
                />
              </div>
              <div className="w-full text-center px-1">
                <span className="text-[10px] text-charcoal-400 font-serif block">
                  NO. {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="text-xs text-charcoal-800 line-clamp-1 font-sans group-hover:text-insight transition-colors">
                  {card.alt.split("下的")[0].split("中的")[0] || card.alt}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
          {filteredWordCards.map((word, idx) => (
            <div
              key={word.id}
              onClick={() => setSelectedWordCard(word)}
              className="group cursor-pointer flex flex-col items-center justify-between p-4 aspect-[3/4] rounded-2xl bg-white border border-[#E8E2D5] hover:border-insight/60 hover:shadow-card transition-all"
            >
              <span className="text-[9px] text-charcoal-400 font-serif self-start uppercase">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <div className="text-center my-auto">
                <span className="text-xl sm:text-2xl font-serif text-charcoal-900 group-hover:text-insight transition-colors">
                  {word.word}
                </span>
                <span className="block text-[10px] text-charcoal-400 font-sans mt-0.5">
                  {word.pinyin}
                </span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-insight/40 group-hover:bg-insight self-end" />
            </div>
          ))}
        </div>
      )}

      {/* 图像卡单张大图详情弹窗 */}
      {selectedImageCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/50 backdrop-blur-sm">
          <div className="bg-[#FAF8F4] border border-[#E5DEC9] max-w-lg w-full rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedImageCard(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-cream-200 text-charcoal-500"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center space-y-4">
              <span className="text-xs font-serif uppercase tracking-widest text-insight">
                WATERCOLOR CARD · {selectedImageCard.id.toUpperCase()}
              </span>

              <div className="w-56 h-[298px] rounded-2xl overflow-hidden shadow-card">
                <CardView
                  card={selectedImageCard}
                  type="image"
                  isFlipped={true}
                  className="w-full h-full"
                />
              </div>

              <div className="text-center space-y-2 pt-2">
                <h3 className="text-lg font-serif text-charcoal-900">
                  {selectedImageCard.alt}
                </h3>
                <p className="text-xs text-charcoal-600 leading-relaxed max-w-sm">
                  {selectedImageCard.artBrief}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                onClick={() => setSelectedImageCard(null)}
                className="px-6 py-2 rounded-full bg-charcoal-900 text-white text-xs font-medium hover:bg-insight transition-colors"
              >
                收起卡片
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 词语卡弹窗 */}
      {selectedWordCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/50 backdrop-blur-sm">
          <div className="bg-[#FAF8F4] border border-[#E5DEC9] max-w-xs w-full rounded-3xl p-6 space-y-5 shadow-2xl relative text-center">
            <button
              onClick={() => setSelectedWordCard(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-cream-200 text-charcoal-500"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="py-6 space-y-2">
              <span className="text-xs font-serif text-charcoal-400">
                {selectedWordCard.pinyin}
              </span>
              <h2 className="text-4xl font-serif text-charcoal-900">
                {selectedWordCard.word}
              </h2>
            </div>

            <p className="text-xs text-charcoal-500 leading-relaxed">
              试着将这个词带入你最近思索的一件事中，看看会产生怎样的体会。
            </p>

            <div className="pt-2">
              <button
                onClick={() => setSelectedWordCard(null)}
                className="px-6 py-2 rounded-full bg-charcoal-900 text-white text-xs font-medium hover:bg-insight"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
