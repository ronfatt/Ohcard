"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Users, Globe, AlertCircle, X, ChevronRight } from "lucide-react";
import { BookingService } from "@/services/bookingService";
import { Guide } from "@/types/guide";

export default function MobileGuidesPage() {
  const guides = BookingService.getGuides();
  const [selectedGuideForBio, setSelectedGuideForBio] = useState<Guide | null>(null);

  return (
    <div className="flex-1 flex flex-col px-4 pt-3 pb-8 space-y-4">
      {/* 头部微提示 */}
      <div className="space-y-1 pb-1">
        <span className="text-[10px] font-serif uppercase tracking-widest text-insight">
          HUMAN COMPANIONS · 真人带领
        </span>
        <h2 className="text-base font-serif text-charcoal-900 font-medium">
          认识真人带领者
        </h2>
        <p className="text-[11px] text-charcoal-500 font-sans leading-relaxed">
          温和、不评判的倾听伙伴，陪伴你梳理卡牌联想。
        </p>
      </div>

      {/* 演示说明胶囊 */}
      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#EFE9DD] border border-[#DDD4C3] text-[10px] text-charcoal-700">
        <AlertCircle className="w-3.5 h-3.5 text-insight shrink-0" />
        <span>带领者为原型演示资料，当前不涉及真实收费</span>
      </div>

      {/* 3 位带领者列表 */}
      <div className="space-y-3">
        {guides.map((guide) => (
          <div
            key={guide.id}
            className="p-4 rounded-2xl bg-white border border-[#E8E2D5] shadow-2xs space-y-3"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl ${guide.avatar} flex items-center justify-center font-serif text-lg font-medium shrink-0`}
              >
                {guide.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-serif font-medium text-charcoal-900 truncate">
                    {guide.name}
                  </h3>
                  <span className="px-1.5 py-0.2 text-[9px] rounded-full bg-cream-200 text-charcoal-600 font-sans">
                    演示
                  </span>
                </div>
                <p className="text-[11px] text-charcoal-400 font-sans truncate">
                  {guide.title}
                </p>
              </div>
            </div>

            <p className="text-xs text-charcoal-600 leading-relaxed font-sans line-clamp-2">
              {guide.approach}
            </p>

            <div className="flex flex-wrap gap-1">
              {guide.suitableTopics.map((topic) => (
                <span
                  key={topic}
                  className="px-2 py-0.5 rounded-md text-[10px] bg-[#FAF8F4] text-charcoal-600 border border-[#EAE3D6]"
                >
                  {topic}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#F2ECE1]">
              <span className="text-[11px] font-serif text-charcoal-700">
                {guide.demoFee}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedGuideForBio(guide)}
                  className="px-3 py-1.5 rounded-full border border-charcoal-200 text-[11px] text-charcoal-700 active:scale-95"
                >
                  介绍
                </button>

                <Link
                  href={`/booking/${guide.id}`}
                  className="px-4 py-1.5 rounded-full bg-charcoal-900 text-white text-[11px] font-medium active:scale-95 shadow-2xs"
                >
                  预约带领
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 带领者详细底部抽屉 */}
      {selectedGuideForBio && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal-900/50 backdrop-blur-xs">
          <div className="bg-[#FAF8F4] w-full max-w-md rounded-t-3xl p-5 space-y-4 shadow-2xl border-t border-[#E5DEC9]">
            <div className="w-10 h-1 rounded-full bg-charcoal-300 mx-auto -mt-1" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-lg ${selectedGuideForBio.avatar} flex items-center justify-center font-serif text-base font-medium`}
                >
                  {selectedGuideForBio.name[0]}
                </div>
                <div>
                  <h4 className="text-sm font-serif text-charcoal-900 font-medium">
                    {selectedGuideForBio.name}
                  </h4>
                  <p className="text-[10px] text-charcoal-400">
                    {selectedGuideForBio.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedGuideForBio(null)}
                className="p-1 text-charcoal-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-charcoal-600 leading-relaxed font-sans">
              {selectedGuideForBio.bio}
            </p>

            <div className="p-3 rounded-xl bg-white border border-[#E8E2D5] space-y-1.5 text-[11px]">
              <span className="font-medium text-charcoal-800">带领准则：</span>
              <ul className="list-disc pl-4 space-y-0.5 text-charcoal-600">
                <li>不评判、不贴标签、不代替探索者下结论</li>
                <li>严格遵守保密原则与对话边界</li>
              </ul>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setSelectedGuideForBio(null)}
                className="flex-1 py-2.5 rounded-full text-xs text-charcoal-600 border border-charcoal-200"
              >
                关闭
              </button>
              <Link
                href={`/booking/${selectedGuideForBio.id}`}
                className="flex-1 py-2.5 rounded-full bg-charcoal-900 text-white text-xs font-medium text-center"
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
