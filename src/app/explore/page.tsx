"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, Check, AlertCircle } from "lucide-react";
import { SessionStore } from "@/services/sessionStore";

const PRESET_TOPICS = [
  "最近有点累",
  "关系里有些话说不出口",
  "我正面临一个选择",
  "想更了解自己",
  "不设主题，随意探索",
];

export default function ExploreTopicPage() {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState<string>("最近有点累");
  const [customTopic, setCustomTopic] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStart = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const finalTopic = customTopic.trim() ? customTopic.trim() : selectedTopic;
    const session = SessionStore.createSession(finalTopic);
    router.push(`/session/${session.id}`);
  };

  return (
    <div className="flex-1 flex flex-col justify-between px-5 pt-3 pb-6 space-y-5">
      <div className="space-y-4">
        <div className="space-y-1">
          <span className="text-[10px] font-serif text-insight uppercase tracking-widest font-medium">
            STEP 01 / 心境主题
          </span>
          <h1 className="text-xl font-serif text-charcoal-900 leading-snug">
            这一次，你想探索什么？
          </h1>
          <p className="text-xs text-charcoal-500 font-sans">
            选择一个贴近此时的心境，也可以写下心中的疑问。
          </p>
        </div>

        {/* 预设主题列表（原生移动端分组列表） */}
        <div className="space-y-2 pt-1">
          {PRESET_TOPICS.map((topic) => {
            const isSelected = selectedTopic === topic && !customTopic.trim();
            return (
              <button
                key={topic}
                type="button"
                onClick={() => {
                  setSelectedTopic(topic);
                  setCustomTopic("");
                }}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between active:scale-[0.99] select-none ${
                  isSelected
                    ? "bg-white border-insight shadow-xs ring-1 ring-insight/30"
                    : "bg-white/70 border-[#E8E2D5] active:bg-[#ECE6D8]"
                }`}
              >
                <span
                  className={`text-xs font-sans transition-colors ${
                    isSelected ? "text-charcoal-900 font-medium" : "text-charcoal-700"
                  }`}
                >
                  {topic}
                </span>
                <span
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected
                      ? "border-insight bg-insight text-white"
                      : "border-charcoal-300"
                  }`}
                >
                  {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </span>
              </button>
            );
          })}
        </div>

        {/* 自定义输入框 */}
        <div className="space-y-1.5 pt-1">
          <label className="block text-[11px] font-medium text-charcoal-600">
            或输入属于你的问题（最多 200 字）：
          </label>
          <div className="relative">
            <textarea
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value.slice(0, 200))}
              placeholder="例如：换了新团队后感觉有些不适应..."
              rows={3}
              maxLength={200}
              className="w-full p-3.5 rounded-2xl bg-white border border-[#E0D8C7] text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:border-insight transition-all resize-none text-xs leading-relaxed"
            />
            <div className="text-right text-[10px] text-charcoal-400 pr-1">
              {customTopic.length}/200
            </div>
          </div>
        </div>

        {/* 轻量数据提示 */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-sage/30 text-[11px] text-charcoal-600">
          <AlertCircle className="w-3.5 h-3.5 text-sage-deep shrink-0" />
          <p>记录仅保存在本机，过程私密无外传</p>
        </div>
      </div>

      {/* 底部吸底进入按钮 */}
      <div className="pt-2">
        <button
          onClick={handleStart}
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-full bg-charcoal-900 text-[#F6F3EC] active:scale-[0.98] transition-transform text-sm font-medium flex items-center justify-center gap-2 shadow-md hover:bg-insight disabled:opacity-50"
        >
          <span>进入抽卡</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
