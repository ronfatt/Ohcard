"use client";

import React, { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Shield,
  Info,
} from "lucide-react";
import { BookingService } from "@/services/bookingService";

const DEMO_DATES = [
  { label: "10月5日（周一）", value: "2026-10-05" },
  { label: "10月6日（周二）", value: "2026-10-06" },
  { label: "10月7日（周三）", value: "2026-10-07" },
  { label: "10月8日（周四）", value: "2026-10-08" },
  { label: "10月9日（周五）", value: "2026-10-09" },
];

const DEMO_SLOTS = [
  "10:00 - 10:45",
  "14:30 - 15:15",
  "19:00 - 19:45",
  "20:30 - 21:15",
];

export default function BookingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const guideId = (params?.guideId as string) || "guide_chen";
  const guide = BookingService.getGuideById(guideId) || BookingService.getGuides()[0];

  const defaultTopic = searchParams?.get("topic") || "";
  const sessionId = searchParams?.get("sessionId") || "";

  // 表单状态
  const [selectedDate, setSelectedDate] = useState(DEMO_DATES[0].value);
  const [selectedSlot, setSelectedSlot] = useState(DEMO_SLOTS[0]);
  const [name, setName] = useState("");
  const [contactMethod, setContactMethod] = useState("微信");
  const [contactValue, setContactValue] = useState("");
  const [topic, setTopic] = useState(defaultTopic);
  const [shareConsent, setShareConsent] = useState(false); // 默认不勾选！

  // 演示完成状态
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
      contactMethod,
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
    <div className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <Link
        href="/guides"
        className="inline-flex items-center gap-1.5 text-xs text-charcoal-400 hover:text-charcoal-800 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>返回带领者列表</span>
      </Link>

      {!isDemoSubmitted ? (
        <div className="space-y-8">
          {/* 带领者信息摘要 */}
          <div className="p-6 rounded-3xl bg-white border border-[#E8E2D5] shadow-soft flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl ${guide.avatar} flex items-center justify-center font-serif text-xl font-medium`}
              >
                {guide.name[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-serif text-charcoal-900">
                    预约 {guide.name}
                  </h2>
                  <span className="px-2 py-0.5 text-[10px] rounded-full bg-cream-200 text-charcoal-600">
                    演示资料
                  </span>
                </div>
                <p className="text-xs text-charcoal-500 mt-1 font-sans">
                  {guide.demoFee}
                </p>
              </div>
            </div>
          </div>

          {/* 预约表单 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. 日期选择 */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-charcoal-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-insight" />
                <span>选择演示日期</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {DEMO_DATES.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setSelectedDate(d.value)}
                    className={`p-3 rounded-2xl border text-xs text-center transition-all ${
                      selectedDate === d.value
                        ? "bg-white border-insight text-insight font-medium shadow-xs"
                        : "bg-[#FAF8F4] border-[#E8E2D5] text-charcoal-700 hover:border-charcoal-300"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. 时段选择 */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-charcoal-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-insight" />
                <span>选择时段</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3 rounded-2xl border text-xs text-center transition-all ${
                      selectedSlot === slot
                        ? "bg-white border-insight text-insight font-medium shadow-xs"
                        : "bg-[#FAF8F4] border-[#E8E2D5] text-charcoal-700 hover:border-charcoal-300"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. 称呼与联系方式 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-charcoal-800">
                  您的称呼 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="如何称呼您"
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-[#E0D8C7] text-sm text-charcoal-900 focus:outline-none focus:border-insight"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-charcoal-800">
                  联系方式（微信/手机号） <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={contactValue}
                  onChange={(e) => setContactValue(e.target.value)}
                  placeholder="用于发送确认信息（演示）"
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-[#E0D8C7] text-sm text-charcoal-900 focus:outline-none focus:border-insight"
                />
              </div>
            </div>

            {/* 4. 想聊的主题 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-charcoal-800">
                本次想聊的主题或困惑（选填）
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="例如：刚才抽卡时想到的某件事；或者一段复杂的人际感受..."
                rows={3}
                className="w-full p-4 rounded-2xl bg-white border border-[#E0D8C7] text-sm text-charcoal-900 focus:outline-none focus:border-insight resize-none"
              />
            </div>

            {/* 5. 探索记录授权分享勾选框（默认不勾选！） */}
            <div className="p-4 rounded-2xl bg-[#F4EFE6] border border-[#DDD4C3] space-y-2">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={shareConsent}
                  onChange={(e) => setShareConsent(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-insight focus:ring-insight accent-insight cursor-pointer"
                />
                <span className="text-xs text-charcoal-800 leading-relaxed">
                  我同意将本次探索记录提供给这位带领者。
                </span>
              </label>
              <p className="text-[11px] text-charcoal-500 pl-7">
                默认不勾选。只有当您主动勾选时，带领者才会提前了解您的卡牌与原话，帮助更快进入对话。
              </p>
            </div>

            {/* 提交按钮与免责提示 */}
            <div className="pt-2 space-y-3">
              <button
                type="submit"
                className="w-full py-4 rounded-full bg-charcoal-900 text-[#F6F3EC] hover:bg-insight transition-all shadow-md text-sm font-medium text-center"
              >
                提交预约意向（演示体验）
              </button>

              <p className="text-center text-[11px] text-charcoal-400">
                本页面为产品流程演示，点击提交后不会真实扣款或发出外部通知
              </p>
            </div>
          </form>
        </div>
      ) : (
        /* 提交后演示完成状态（实事求是，绝不假装预约成功） */
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E8E2D5] shadow-card text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-sage/60 border border-sage-dark flex items-center justify-center mx-auto text-sage-deep">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-serif uppercase tracking-widest text-insight">
              DEMO COMPLETED
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-charcoal-900">
              预约流程演示完成，尚未发送预约
            </h2>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF8F4] border border-[#E8E2D5] text-left text-xs space-y-2 text-charcoal-700 leading-relaxed">
            <div className="font-medium text-charcoal-900 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-insight" />
              <span>当前为系统原型阶段，以下说明供您了解：</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-charcoal-600">
              <li>本系统尚未对接真实带领者的日程系统与收款网关。</li>
              <li>系统<strong>未扣除任何费用</strong>，亦<strong>未向带领者或您的手机发送通知</strong>。</li>
              <li>您刚才填写的意向数据仅保存在当前设备，未上传第三方服务器。</li>
              {shareConsent && (
                <li className="text-insight font-medium">
                  您勾选了探索记录分享：在未来真实版本中，带领者会在对话前查阅您的本次探索卡片与整理。
                </li>
              )}
            </ul>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/journal"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-charcoal-900 text-white text-xs font-medium hover:bg-insight transition-colors"
            >
              查看我的探索日记
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-full border border-charcoal-200 text-charcoal-700 text-xs hover:bg-[#ECE6D8] transition-colors"
            >
              返回首页
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
