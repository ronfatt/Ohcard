"use client";

import React, { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Clock,
  CheckCircle,
  Info,
} from "lucide-react";
import { BookingService } from "@/services/bookingService";

const DEMO_DATES = [
  { label: "10月5日 周一", value: "2026-10-05" },
  { label: "10月6日 周二", value: "2026-10-06" },
  { label: "10月7日 周三", value: "2026-10-07" },
  { label: "10月8日 周四", value: "2026-10-08" },
];

const DEMO_SLOTS = [
  "10:00 - 10:45",
  "14:30 - 15:15",
  "19:00 - 19:45",
  "20:30 - 21:15",
];

export default function MobileBookingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const guideId = (params?.guideId as string) || "guide_chen";
  const guide = BookingService.getGuideById(guideId) || BookingService.getGuides()[0];

  const defaultTopic = searchParams?.get("topic") || "";
  const sessionId = searchParams?.get("sessionId") || "";

  const [selectedDate, setSelectedDate] = useState(DEMO_DATES[0].value);
  const [selectedSlot, setSelectedSlot] = useState(DEMO_SLOTS[0]);
  const [name, setName] = useState("");
  const [contactValue, setContactValue] = useState("");
  const [topic, setTopic] = useState(defaultTopic);
  const [shareConsent, setShareConsent] = useState(false);
  const [isDemoSubmitted, setIsDemoSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contactValue.trim()) {
      alert("请填写您的称呼与联系方式");
      return;
    }

    BookingService.submitDemoBooking({
      guideId: guide.id,
      guideName: guide.name,
      name: name.trim(),
      contactMethod: "微信/电话",
      contactValue: contactValue.trim(),
      selectedDate,
      selectedTimeSlot: selectedSlot,
      explorationTopic: topic.trim() || "未指定特定主题",
      shareExplorationConsent: shareConsent,
      explorationId: sessionId || undefined,
    });

    setIsDemoSubmitted(true);
  };

  return (
    <div className="flex-1 flex flex-col px-4 pt-2 pb-8 space-y-4">
      {!isDemoSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 带领者信息卡片 */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#E8E2D5] flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl ${guide.avatar} flex items-center justify-center font-serif text-base font-medium shrink-0`}
            >
              {guide.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-serif font-medium text-charcoal-900 truncate">
                  预约 {guide.name}
                </h3>
                <span className="px-1.5 py-0.2 text-[9px] rounded-full bg-cream-200 text-charcoal-600">
                  演示
                </span>
              </div>
              <p className="text-[11px] text-charcoal-400 font-sans truncate">
                {guide.demoFee}
              </p>
            </div>
          </div>

          {/* 日期选择（水平紧凑胶囊） */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-charcoal-700 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-insight" />
              <span>选择演示日期</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_DATES.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setSelectedDate(d.value)}
                  className={`p-2.5 rounded-xl border text-xs text-center transition-all ${
                    selectedDate === d.value
                      ? "bg-white border-insight text-insight font-medium shadow-xs"
                      : "bg-white/70 border-[#E8E2D5] text-charcoal-700"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* 时段选择 */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-charcoal-700 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-insight" />
              <span>选择时段</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-2 rounded-xl border text-[11px] text-center transition-all ${
                    selectedSlot === slot
                      ? "bg-white border-insight text-insight font-medium shadow-xs"
                      : "bg-white/70 border-[#E8E2D5] text-charcoal-700"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* 称呼与联系方式 */}
          <div className="space-y-2">
            <div>
              <label className="block text-[11px] font-medium text-charcoal-700 mb-1">
                称呼 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="如何称呼您"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E0D8C7] text-xs text-charcoal-900 focus:outline-none focus:border-insight"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-charcoal-700 mb-1">
                联系方式（微信/手机号） <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={contactValue}
                onChange={(e) => setContactValue(e.target.value)}
                placeholder="仅作演示记录，不会发送短信"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E0D8C7] text-xs text-charcoal-900 focus:outline-none focus:border-insight"
              />
            </div>
          </div>

          {/* 想聊的主题 */}
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-charcoal-700">
              想探讨的主题（选填）
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="刚才抽卡想到的事，或某段感受..."
              rows={2}
              className="w-full p-3 rounded-xl bg-white border border-[#E0D8C7] text-xs text-charcoal-900 focus:outline-none focus:border-insight resize-none"
            />
          </div>

          {/* 授权勾选 */}
          <div className="p-3 rounded-xl bg-[#F4EFE6] border border-[#DDD4C3] space-y-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={shareConsent}
                onChange={(e) => setShareConsent(e.target.checked)}
                className="w-3.5 h-3.5 mt-0.5 rounded text-insight focus:ring-insight accent-insight cursor-pointer"
              />
              <span className="text-xs text-charcoal-800 leading-snug">
                我同意将本次探索记录提供给带领者。
              </span>
            </label>
            <p className="text-[10px] text-charcoal-500 pl-6">
              默认不勾选。勾选后带领者会提前了解您的卡牌与原话。
            </p>
          </div>

          {/* 提交按钮 */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-charcoal-900 text-white text-xs font-medium active:scale-[0.98] shadow-md hover:bg-insight"
            >
              提交预约意向（演示体验）
            </button>
            <p className="text-center text-[10px] text-charcoal-400 pt-1.5">
              演示体验 · 不会扣费 · 不发送外部信息
            </p>
          </div>
        </form>
      ) : (
        <div className="p-6 rounded-2xl bg-white border border-[#E8E2D5] shadow-xs text-center space-y-4 my-auto">
          <div className="w-12 h-12 rounded-full bg-sage/60 border border-sage-dark flex items-center justify-center mx-auto text-sage-deep">
            <CheckCircle className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-serif uppercase tracking-widest text-insight">
              DEMO COMPLETED
            </span>
            <h3 className="text-lg font-serif text-charcoal-900 font-medium">
              预约流程演示完成，尚未发送预约
            </h3>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF8F4] text-left text-[11px] space-y-1.5 text-charcoal-600 leading-relaxed font-sans">
            <p>• 当前为系统原型阶段，尚未对接真实预约与收费网关。</p>
            <p>• 系统未扣费，亦未向任何人发送短信或通知。</p>
            {shareConsent && (
              <p className="text-insight font-medium">
                • 您勾选了探索分享，真实版本中带领者会提前查阅卡牌。
              </p>
            )}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/journal"
              className="w-full py-2.5 rounded-full bg-charcoal-900 text-white text-xs font-medium text-center"
            >
              查看我的日记
            </Link>
            <Link
              href="/"
              className="w-full py-2.5 rounded-full border border-charcoal-200 text-charcoal-700 text-xs text-center"
            >
              返回首页
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
