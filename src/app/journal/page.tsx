"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  Trash2,
  ChevronRight,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { CardView } from "@/components/CardView";
import { SessionStore } from "@/services/sessionStore";
import { ReflectionRecord } from "@/types/session";

export default function MobileJournalPage() {
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
    <div className="flex-1 flex flex-col px-4 pt-3 pb-6 space-y-4">
      {/* 头部微标题与清空选项 */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D5]">
        <div>
          <span className="text-[10px] font-serif uppercase tracking-widest text-insight">
            JOURNAL
          </span>
          <h2 className="text-base font-serif text-charcoal-900 font-medium">
            探索日记 ({records.length})
          </h2>
        </div>

        {records.length > 0 && (
          <button
            onClick={() => setShowClearAllModal(true)}
            className="text-[11px] text-charcoal-400 hover:text-red-600 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>清空</span>
          </button>
        )}
      </div>

      {/* 列表或空状态 */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-charcoal-400">
          读取记录中...
        </div>
      ) : records.length === 0 ? (
        <div className="py-16 text-center space-y-4 my-auto">
          <div className="w-14 h-14 rounded-full bg-cream-200 border border-[#DFD8C4] flex items-center justify-center mx-auto text-charcoal-500">
            <BookOpen className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-serif text-charcoal-900">
              还没有探索记录
            </h3>
            <p className="text-xs text-charcoal-500">
              完成一次联想梳理并保存后，它们会陈列在这里。
            </p>
          </div>

          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-charcoal-900 text-white text-xs font-medium active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>开启第一次探索</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3 pb-6">
          {records.map((rec) => (
            <Link
              key={rec.id}
              href={`/reflection/${rec.sessionId || rec.id}`}
              className="block p-3.5 rounded-2xl bg-white border border-[#E8E2D5] active:scale-[0.98] transition-transform shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between text-[11px] text-charcoal-400 border-b border-[#F2ECE1] pb-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {new Date(rec.createdAt).toLocaleDateString("zh-CN", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </span>

                <button
                  onClick={(e) => handleDeleteOne(rec.id, e)}
                  className="p-1 text-charcoal-300 hover:text-red-500"
                  title="删除"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex -space-x-4 shrink-0">
                  <div className="w-14 h-19 rounded-lg overflow-hidden border border-[#E0D8C7] shadow-xs">
                    <CardView
                      card={rec.imageCard}
                      type="image"
                      isFlipped={true}
                      size="sm"
                      className="w-full h-full pointer-events-none"
                    />
                  </div>
                  <div className="w-14 h-19 rounded-lg overflow-hidden border border-[#E0D8C7] shadow-xs rotate-6">
                    <CardView
                      card={rec.wordCard}
                      type="word"
                      isFlipped={true}
                      size="sm"
                      className="w-full h-full pointer-events-none"
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="text-xs font-serif font-medium text-charcoal-900 truncate">
                    {rec.topic}
                  </h4>
                  <p className="text-[11px] text-charcoal-600 line-clamp-2 italic font-sans">
                    “{rec.userExpressions.attraction || rec.userExpressions.wordCombination}”
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-charcoal-400">
                    <span className="px-2 py-0.5 rounded-full bg-cream-200 text-charcoal-700">
                      {rec.wordCard.word}
                    </span>
                    {rec.smallAction && (
                      <span className="truncate max-w-[120px]">
                        行动: {rec.smallAction}
                      </span>
                    )}
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-charcoal-300 shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* 清空弹窗 */}
      {showClearAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/50 backdrop-blur-xs">
          <div className="bg-[#FAF8F4] w-full max-w-xs rounded-3xl p-5 space-y-3 shadow-xl">
            <h4 className="font-medium text-xs text-red-600 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>清空全部探索记录？</span>
            </h4>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              此操作将清空本机已保存的历史探索，无法撤销。
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowClearAllModal(false)}
                className="px-3.5 py-1.5 text-xs text-charcoal-600 rounded-full"
              >
                取消
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-1.5 text-xs bg-red-600 text-white rounded-full font-medium"
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
