"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Users, Globe, Tag, Sparkles, AlertCircle, ArrowRight, ShieldCheck, X } from "lucide-react";
import { BookingService, DEMO_GUIDES } from "@/services/bookingService";
import { Guide } from "@/types/guide";

export default function GuidesPage() {
  const guides = BookingService.getGuides();
  const [selectedGuideForBio, setSelectedGuideForBio] = useState<Guide | null>(null);

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* 标题与演示免责声明 */}
      <div className="space-y-4 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage/60 border border-sage-dark/40 text-xs text-charcoal-800">
          <span className="w-1.5 h-1.5 rounded-full bg-insight" />
          <span>真人陪伴 · 演示专区</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif text-charcoal-900">
          认识真人带领者
        </h1>

        <p className="text-sm text-charcoal-600 leading-relaxed">
          当你希望有一位温和、受过倾听训练的伙伴陪你一起梳理卡牌联想时，可以选择真人带领。带领者不提供心理疾病诊治，只提供安全的表达空间。
        </p>

        {/* 严格标注演示资料 */}
        <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#EFE9DD] border border-[#DDD4C3] text-xs text-charcoal-700">
          <AlertCircle className="w-4 h-4 text-insight shrink-0 mt-0.5" />
          <p>
            <strong>说明：</strong>
            当前页面展示的带领者信息、服务价格均为<strong>系统原型演示资料</strong>，不含虚构资质或虚假好评。当前版本不涉及真实预约与收款。
          </p>
        </div>
      </div>

      {/* 3 位带领者卡片展示 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {guides.map((guide) => (
          <div
            key={guide.id}
            className="p-6 rounded-3xl bg-white border border-[#E8E2D5] shadow-soft flex flex-col justify-between space-y-6 hover:border-insight/50 transition-all"
          >
            <div className="space-y-4">
              {/* 头像与基础信息 */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-14 h-14 rounded-2xl ${guide.avatar} flex items-center justify-center font-serif text-xl font-medium shadow-xs`}
                >
                  {guide.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-serif font-medium text-charcoal-900">
                      {guide.name}
                    </h3>
                    <span className="px-2 py-0.5 text-[10px] rounded-full bg-cream-200 text-charcoal-600 font-sans">
                      演示
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-400 font-sans mt-0.5">
                    {guide.title}
                  </p>
                </div>
              </div>

              {/* 语言 */}
              <div className="flex items-center gap-1.5 text-xs text-charcoal-500">
                <Globe className="w-3.5 h-3.5 text-charcoal-400" />
                <span>服务语言：{guide.languages.join(" / ")}</span>
              </div>

              {/* 带领方式 */}
              <div className="space-y-1.5">
                <span className="text-xs font-medium text-charcoal-800">
                  带领风格：
                </span>
                <p className="text-xs text-charcoal-600 leading-relaxed font-sans">
                  {guide.approach}
                </p>
              </div>

              {/* 适合探索的主题 */}
              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-medium text-charcoal-800">
                  适合探索：
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {guide.suitableTopics.map((topic) => (
                    <span
                      key={topic}
                      className="px-2.5 py-1 rounded-lg text-[11px] bg-[#FAF8F4] border border-[#EAE3D6] text-charcoal-600"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* 演示价格 */}
              <div className="pt-2 border-t border-[#F0EAE0] text-xs font-serif text-charcoal-700">
                {guide.demoFee}
              </div>
            </div>

            {/* 操作按钮组 */}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedGuideForBio(guide)}
                className="flex-1 py-2.5 rounded-full border border-charcoal-200 text-xs text-charcoal-700 hover:bg-[#FAF8F5] transition-colors"
              >
                查看介绍
              </button>

              <Link
                href={`/booking/${guide.id}`}
                className="flex-1 py-2.5 rounded-full bg-charcoal-900 text-[#F6F3EC] hover:bg-insight transition-colors text-xs font-medium text-center shadow-xs"
              >
                预约带领
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* 查看详细介绍弹窗 */}
      {selectedGuideForBio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/40 backdrop-blur-sm">
          <div className="bg-[#FAF8F4] border border-[#E5DEC9] max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedGuideForBio(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-cream-200 text-charcoal-500"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl ${selectedGuideForBio.avatar} flex items-center justify-center font-serif text-lg font-medium`}
              >
                {selectedGuideForBio.name[0]}
              </div>
              <div>
                <h3 className="text-xl font-serif text-charcoal-900">
                  {selectedGuideForBio.name}
                </h3>
                <p className="text-xs text-charcoal-400">
                  {selectedGuideForBio.title}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-charcoal-600 leading-relaxed">
              <p>{selectedGuideForBio.bio}</p>
              <div className="p-4 rounded-2xl bg-white border border-[#E8E2D5] space-y-2 text-xs">
                <div className="font-medium text-charcoal-800">
                  带领准则：
                </div>
                <ul className="list-disc pl-4 space-y-1 text-charcoal-600">
                  <li>不评判、不贴标签、不代替探索者下结论</li>
                  <li>严格遵守保密原则与对话边界</li>
                  <li>以倾听、澄清与回响为主，引导探索者自主觉察</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedGuideForBio(null)}
                className="px-5 py-2 rounded-full text-xs text-charcoal-600 hover:bg-[#ECE6D8]"
              >
                关闭
              </button>
              <Link
                href={`/booking/${selectedGuideForBio.id}`}
                className="px-6 py-2 rounded-full bg-charcoal-900 text-white text-xs font-medium hover:bg-insight"
              >
                去预约体验
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
