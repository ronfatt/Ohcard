"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, HelpCircle, Eye, MessageSquare, Compass, X } from "lucide-react";
import { CardView } from "@/components/CardView";
import { CardRepository } from "@/repositories/cardRepository";

export default function HomePage() {
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  // 展示一张有艺术感的主卡与错位卡片
  const sampleImageCard = CardRepository.getImageCardById("img_01"); // 窗边的人
  const sampleImageCard2 = CardRepository.getImageCardById("img_05"); // 木桥
  const sampleWordCard = CardRepository.getWordCardById("word_03"); // 等待

  return (
    <div className="flex-1 flex flex-col justify-between max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-16">
      {/* 头部留白与主视觉区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center my-auto">
        {/* 左侧文案层级 */}
        <div className="lg:col-span-7 space-y-8 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage/60 border border-sage-dark/40 text-charcoal-800 text-xs tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-insight" />
            <span>原创图像联想与感受梳理</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal text-charcoal-900 leading-[1.25] tracking-tight">
              从一张图，<br />
              <span className="text-charcoal-800">开始听见自己。</span>
            </h1>
            <p className="text-base sm:text-lg text-charcoal-600 font-sans leading-relaxed max-w-lg">
              不急着找到答案。先看看，这张图让你想起什么。
            </p>
          </div>

          {/* 交互按钮组 */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <Link
              href="/explore"
              className="inline-flex justify-center items-center gap-2.5 px-8 py-3.5 rounded-full bg-charcoal-900 text-[#F6F3EC] hover:bg-insight transition-all shadow-md text-base font-medium group"
            >
              <span>开始一次探索</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              onClick={() => setShowHowItWorks(true)}
              className="inline-flex justify-center items-center gap-2 px-6 py-3.5 rounded-full border border-charcoal-200 text-charcoal-700 hover:bg-[#ECE6D8]/60 transition-colors text-base"
            >
              <HelpCircle className="w-4 h-4 text-charcoal-400" />
              <span>看看怎么玩</span>
            </button>
          </div>

          <div className="pt-2 text-xs text-charcoal-400 flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-charcoal-400" />
            <span>无须注册 · 离线私密存储 · 纯粹的自我对话</span>
          </div>
        </div>

        {/* 右侧艺术叠卡视觉 */}
        <div className="lg:col-span-5 flex justify-center items-center relative py-6">
          <div className="relative w-64 h-[350px] sm:w-72 sm:h-[390px]">
            {/* 底层斜置图卡 */}
            <motion.div
              initial={{ rotate: -8, x: -20, opacity: 0.8 }}
              animate={{ rotate: -7, x: -16 }}
              className="absolute inset-0 pointer-events-none transform origin-bottom-left"
            >
              <div className="w-full h-full rounded-2xl bg-[#EDE7DA] border border-[#DDD5C3] shadow-soft" />
            </motion.div>

            {/* 中层错位词语卡 */}
            <motion.div
              initial={{ rotate: 10, x: 26, y: -10 }}
              animate={{ rotate: 9, x: 22, y: -8 }}
              className="absolute inset-0 pointer-events-none transform origin-bottom-right"
            >
              <CardView
                card={sampleWordCard}
                type="word"
                isFlipped={true}
                className="w-full h-full shadow-soft opacity-90"
              />
            </motion.div>

            {/* 顶层主图卡 */}
            <motion.div
              initial={{ y: 10, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative z-10 w-full h-full"
            >
              <CardView
                card={sampleImageCard}
                type="image"
                isFlipped={true}
                className="w-full h-full shadow-card hover:shadow-floating transition-shadow"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* 下方简洁三步介绍 */}
      <div className="mt-16 pt-12 border-t border-[#E8E2D5] grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-[#FAF8F4] border border-[#EBE5D6] space-y-2">
          <div className="w-8 h-8 rounded-full bg-sage flex items-center justify-center text-charcoal-800 text-sm font-serif">
            1
          </div>
          <h3 className="text-base font-medium text-charcoal-800 flex items-center gap-2">
            <Eye className="w-4 h-4 text-insight" />
            看见一张图
          </h3>
          <p className="text-sm text-charcoal-600 leading-relaxed">
            从 24 张意境画面中随心抽取，留意第一眼吸引你的细节。
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#FAF8F4] border border-[#EBE5D6] space-y-2">
          <div className="w-8 h-8 rounded-full bg-sage flex items-center justify-center text-charcoal-800 text-sm font-serif">
            2
          </div>
          <h3 className="text-base font-medium text-charcoal-800 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-insight" />
            说出你的感受
          </h3>
          <p className="text-sm text-charcoal-600 leading-relaxed">
            结合抽中的词语卡，跟随中立温和的追问，自由表达你的联想。
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#FAF8F4] border border-[#EBE5D6] space-y-2">
          <div className="w-8 h-8 rounded-full bg-sage flex items-center justify-center text-charcoal-800 text-sm font-serif">
            3
          </div>
          <h3 className="text-base font-medium text-charcoal-800 flex items-center gap-2">
            <Compass className="w-4 h-4 text-insight" />
            找到一个小方向
          </h3>
          <p className="text-sm text-charcoal-600 leading-relaxed">
            不评判、不对号入座。整理自己的原话，带走一个微小的行动。
          </p>
        </div>
      </div>

      {/* 玩法弹窗 */}
      {showHowItWorks && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/40 backdrop-blur-sm">
          <div className="bg-[#FAF8F4] border border-[#E5DEC9] max-w-lg w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowHowItWorks(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-cream-200 text-charcoal-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="text-xs font-serif tracking-widest text-insight uppercase">
                GUIDE & PRINCIPLE
              </span>
              <h2 className="text-2xl font-serif text-charcoal-900">
                映见的设计理念与玩法
              </h2>
            </div>

            <div className="space-y-4 text-sm text-charcoal-600 leading-relaxed">
              <p>
                <strong>这不是占卜，也不是性格测试：</strong>
                我们不预测未来，也不给出所谓“权威结论”。每一张卡牌只是一个倒影，映出的是你心里本来就有的感受。
              </p>
              <p>
                <strong>你的感觉永远是对的：</strong>
                同一张画，有人看见宁静，有人看见孤独。卡牌没有任何预设的标准答案，请相信你第一时间的直接体会。
              </p>
              <p>
                <strong>随心表达，随时跳过：</strong>
                所有的提问都允许你修改、反驳或直接跳过。整个过程完全属于你自己。
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowHowItWorks(false)}
                className="px-6 py-2.5 rounded-full bg-charcoal-900 text-[#F6F3EC] hover:bg-insight transition-colors text-sm font-medium"
              >
                我了解了
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
