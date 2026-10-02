"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  Trash2,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { CardView } from "@/components/CardView";
import { SessionStore } from "@/services/sessionStore";
import { ReflectionRecord } from "@/types/session";

export default function JournalPage() {
  const [records, setRecords] = useState<ReflectionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showClearAllModal, setShowClearAllModal] = useState(false);

  useEffect(() => {
    const list = SessionStore.getSavedReflections();
    setRecords(list);
    setIsLoading(false);
  }, []);

  const handleDeleteOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    SessionStore.deleteSavedReflection(id);
    setRecords(SessionStore.getSavedReflections());
  };

  const handleClearAll = () => {
    SessionStore.clearAllSavedReflections();
    setRecords([]);
    setShowClearAllModal(false);
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* 头部标题与清空选项 */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E2D5] pb-6">
        <div className="space-y-2">
          <span className="text-xs font-serif uppercase tracking-widest text-insight">
            MY JOURNEY · 探索日记
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-charcoal-900">
            我的探索记录
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600">
            记录保存在当前设备的浏览器中。每一次看见，都是与自己的重逢。
          </p>
        </div>

        {records.length > 0 && (
          <button
            onClick={() => setShowClearAllModal(true)}
            className="text-xs text-charcoal-400 hover:text-red-600 transition-colors flex items-center gap-1 self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>清空全部记录</span>
          </button>
        )}
      </div>

      {/* 记录列表或空状态 */}
      {isLoading ? (
        <div className="py-16 text-center text-charcoal-400 text-sm">
          正在读取探索记录...
        </div>
      ) : records.length === 0 ? (
        <div className="py-16 sm:py-24 text-center max-w-md mx-auto space-y-6">
          <div className="w-16 h-16 rounded-full bg-cream-200 border border-[#DFD8C4] flex items-center justify-center mx-auto text-charcoal-500">
            <BookOpen className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-serif text-charcoal-900">
              还没有保存的探索
            </h3>
            <p className="text-sm text-charcoal-600 leading-relaxed">
              当你完成一次图像与词语的联想梳理并保存后，它们会安静地陈列在这里。
            </p>
          </div>

          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-charcoal-900 text-[#F6F3EC] hover:bg-insight transition-all shadow-md text-sm font-medium"
          >
            <Sparkles className="w-4 h-4" />
            <span>开始第一次探索</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {records.map((rec) => (
            <Link
              key={rec.id}
              href={`/reflection/${rec.sessionId || rec.id}`}
              className="group block p-5 rounded-3xl bg-white border border-[#E8E2D5] hover:border-insight/60 hover:shadow-card transition-all relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#F2ECE1]">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-charcoal-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {new Date(rec.createdAt).toLocaleDateString("zh-CN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <h3 className="text-base font-serif font-medium text-charcoal-900 group-hover:text-insight transition-colors line-clamp-1">
                    {rec.topic}
                  </h3>
                </div>

                <button
                  onClick={(e) => handleDeleteOne(rec.id, e)}
                  className="p-1.5 rounded-full text-charcoal-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="删除此条记录"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* 卡牌缩略与原话摘要 */}
              <div className="pt-4 flex items-center gap-4">
                {/* 双卡缩略图 */}
                <div className="flex -space-x-4 shrink-0">
                  <div className="w-16 h-22 rounded-lg overflow-hidden border border-[#E0D8C7] shadow-xs">
                    <CardView
                      card={rec.imageCard}
                      type="image"
                      isFlipped={true}
                      size="sm"
                      className="w-16 h-22 pointer-events-none"
                    />
                  </div>
                  <div className="w-16 h-22 rounded-lg overflow-hidden border border-[#E0D8C7] shadow-xs transform rotate-6">
                    <CardView
                      card={rec.wordCard}
                      type="word"
                      isFlipped={true}
                      size="sm"
                      className="w-16 h-22 pointer-events-none"
                    />
                  </div>
                </div>

                {/* 表达摘录 */}
                <div className="flex-1 min-w-0 space-y-1.5 text-xs">
                  <p className="text-charcoal-600 line-clamp-2 italic">
                    “{rec.userExpressions.attraction || rec.userExpressions.wordCombination}”
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-charcoal-400">
                    <span className="px-2 py-0.5 rounded-full bg-cream-200 text-charcoal-700">
                      词语：{rec.wordCard.word}
                    </span>
                    {rec.smallAction && (
                      <span className="truncate max-w-[120px]">
                        行动：{rec.smallAction}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 悬停箭头 */}
              <div className="pt-3 flex justify-end">
                <span className="text-xs text-charcoal-400 group-hover:text-insight inline-flex items-center gap-1 font-medium transition-colors">
                  <span>查看详情</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* 清空所有记录确认弹窗 */}
      {showClearAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/40 backdrop-blur-sm">
          <div className="bg-[#FAF8F4] border border-[#E5DEC9] max-w-sm w-full rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="font-medium text-sm">确认清空全部探索记录？</h4>
            </div>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              此操作将清空当前浏览器中已保存的所有历史探索记录，无法撤销。
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowClearAllModal(false)}
                className="px-4 py-2 text-xs text-charcoal-600 hover:bg-[#ECE6D8] rounded-full"
              >
                取消
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 text-xs bg-red-600 text-white hover:bg-red-700 rounded-full font-medium"
              >
                确认清空
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
