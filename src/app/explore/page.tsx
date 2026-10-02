"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import Link from "next/link";
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
    <div className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-between">
      {/* 顶部返回与层级 */}
      <div className="space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-charcoal-400 hover:text-charcoal-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>返回首页</span>
        </Link>

        <div className="space-y-3">
          <div className="text-xs font-serif text-insight uppercase tracking-widest">
            STEP 01 / TOPIC
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-charcoal-900 leading-tight">
            这一次，你想探索什么？
          </h1>
          <p className="text-sm sm:text-base text-charcoal-600 leading-relaxed">
            选择一个贴近此时心境的主题，也可以写下你心中的疑问。哪怕只是随便看看，也是极好的开始。
          </p>
        </div>

        {/* 预设主题列表 */}
        <div className="space-y-3 pt-2">
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
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                  isSelected
                    ? "bg-white border-insight shadow-soft ring-1 ring-insight/30"
                    : "bg-[#FAF8F5] border-[#E8E2D5] hover:border-charcoal-300 hover:bg-white"
                }`}
              >
                <span
                  className={`text-sm sm:text-base transition-colors ${
                    isSelected ? "text-charcoal-900 font-medium" : "text-charcoal-700"
                  }`}
                >
                  {topic}
                </span>
                <span
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected
                      ? "border-insight bg-insight text-white"
                      : "border-charcoal-300 group-hover:border-charcoal-400"
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
              </button>
            );
          })}
        </div>

        {/* 自定义输入框 */}
        <div className="pt-2 space-y-2">
          <label className="block text-xs font-medium text-charcoal-600">
            或者，用自己的话写下（可选，最多 200 字）：
          </label>
          <div className="relative">
            <textarea
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value.slice(0, 200))}
              placeholder="例如：换了新团队后感觉很不适应；想理清自己真正想要的生活..."
              rows={3}
              maxLength={200}
              className="w-full p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D5] text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-insight/30 focus:border-insight focus:bg-white transition-all resize-none text-sm"
            />
            <div className="text-right text-[11px] text-charcoal-400 pt-1 pr-1">
              {customTopic.length}/200
            </div>
          </div>
        </div>

        {/* 轻量数据提示 */}
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-sage/40 border border-sage-dark/30 text-xs text-charcoal-600">
          <AlertCircle className="w-4 h-4 text-sage-deep shrink-0 mt-0.5" />
          <p>
            探索记录保存在当前设备的浏览器中，清除缓存后可能丢失。过程全程私密，不上传个人身份信息。
          </p>
        </div>
      </div>

      {/* 底部确认按钮 */}
      <div className="pt-8 flex items-center justify-between gap-4">
        <span className="text-xs text-charcoal-400">
          无需深思熟虑，随时可以开始
        </span>

        <button
          onClick={handleStart}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-charcoal-900 text-[#F6F3EC] hover:bg-insight transition-all shadow-md text-base font-medium disabled:opacity-50"
        >
          <span>进入抽卡</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
