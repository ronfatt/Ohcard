"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Share2,
  Bookmark,
  BookmarkCheck,
  RotateCcw,
  Trash2,
  Users,
  Check,
  Edit3,
  Copy,
  AlertTriangle,
  X,
} from "lucide-react";
import { CardView } from "@/components/CardView";
import { SessionStore } from "@/services/sessionStore";
import { ExplorationSession, ReflectionRecord } from "@/types/session";
import { activeReflectionProvider, ReflectionSynthesis } from "@/services/reflectionService";

export default function ReflectionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params?.id as string;

  const [session, setSession] = useState<ExplorationSession | null>(null);
  const [reflection, setReflection] = useState<ReflectionRecord | null>(null);
  const [isEditingSynthesis, setIsEditingSynthesis] = useState(false);
  const [editedSynthesisText, setEditedSynthesisText] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [customAction, setCustomAction] = useState("");
  const [actionOptions, setActionOptions] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    // 优先读取已保存记录
    const saved = SessionStore.getSavedReflectionById(sessionId);
    const s = SessionStore.getSession(sessionId);

    if (saved) {
      setReflection(saved);
      setSession(s || {
        id: saved.sessionId,
        createdAt: saved.createdAt,
        updatedAt: saved.createdAt,
        topic: saved.topic,
        imageCard: saved.imageCard,
        attractionExpression: saved.userExpressions.attraction,
        selectedFeelings: saved.userExpressions.feelings,
        wordCard: saved.wordCard,
        wordCombinationExpression: saved.userExpressions.wordCombination,
        dialogueHistory: saved.userExpressions.dialogues.map((d, i) => ({
          id: `q_${i}`,
          question: d.question,
          answer: d.answer,
        })),
        currentStep: "review",
        currentDialogueIndex: 2,
        isSaved: true,
      });
      setEditedSynthesisText(saved.userEditedSynthesis || saved.systemSynthesis.structuredEcho);
      setSelectedAction(saved.smallAction);
      setIsSaved(true);
      return;
    }

    if (!s) {
      // 容错重定向
      router.push("/");
      return;
    }

    setSession(s);

    // 生成回顾内容
    const generate = async () => {
      const syn: ReflectionSynthesis = await activeReflectionProvider.generateReflection(s);
      setActionOptions(syn.smallActionSuggestions);
      setSelectedAction(syn.smallActionSuggestions[0] || "给自己留 5 分钟放空时间");
      setEditedSynthesisText(syn.structuredEcho);

      const record: ReflectionRecord = {
        id: "ref_" + s.id,
        sessionId: s.id,
        createdAt: s.createdAt || new Date().toISOString(),
        topic: s.topic,
        imageCard: s.imageCard!,
        wordCard: s.wordCard!,
        userExpressions: {
          attraction: s.attractionExpression || "未填写",
          feelings: s.selectedFeelings || [],
          wordCombination: s.wordCombinationExpression || "未填写",
          dialogues: s.dialogueHistory.map((d) => ({
            question: d.question,
            answer: d.answer,
          })),
        },
        systemSynthesis: {
          disclaimer: syn.disclaimer,
          structuredEcho: syn.structuredEcho,
          unresolvedQuestions: syn.unresolvedQuestions,
        },
        smallAction: syn.smallActionSuggestions[0] || "",
        isSaved: false,
      };

      setReflection(record);
    };

    if (s.imageCard && s.wordCard) {
      generate();
    }
  }, [sessionId, router]);

  // 保存探索记录
  const handleSaveRecord = () => {
    if (!reflection) return;
    const finalAction = customAction.trim() || selectedAction;
    const recordToSave: ReflectionRecord = {
      ...reflection,
      userEditedSynthesis: editedSynthesisText,
      smallAction: finalAction,
      isSaved: true,
    };
    SessionStore.saveReflection(recordToSave);
    setReflection(recordToSave);
    setIsSaved(true);
  };

  // 删除当前探索
  const handleDeleteRecord = () => {
    SessionStore.deleteSavedReflection(sessionId);
    router.push("/journal");
  };

  if (!reflection || !session || !session.imageCard || !session.wordCard) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-charcoal-400">
        正在梳理你的探索回顾...
      </div>
    );
  }

  const finalActionText = customAction.trim() || selectedAction;

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* 顶部导航与状态 */}
      <div className="flex items-center justify-between">
        <Link
          href="/journal"
          className="inline-flex items-center gap-1.5 text-xs text-charcoal-400 hover:text-charcoal-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>返回我的探索</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveRecord}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all ${
              isSaved
                ? "bg-sage text-charcoal-800 border border-sage-dark"
                : "bg-charcoal-900 text-[#F6F3EC] hover:bg-insight"
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-3.5 h-3.5 text-insight" />
                <span>已保存在本地</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5" />
                <span>保存本次探索</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowShareModal(true)}
            className="p-2 rounded-full border border-charcoal-200 text-charcoal-600 hover:bg-[#ECE6D8] transition-colors"
            title="生成分享卡片（隐私受控）"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 标题区域 */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage/50 border border-sage-dark/40 text-xs text-charcoal-700">
          <span>主题：{reflection.topic}</span>
          <span>·</span>
          <span>
            {new Date(reflection.createdAt).toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif text-charcoal-900">
          这一次，你看见了什么？
        </h1>
        <p className="text-sm text-charcoal-600">
          探索的意义不在于寻找标准答案，而在于清晰地看见当下的自己。
        </p>
      </div>

      {/* 本次卡牌展示并置 */}
      <div className="p-6 rounded-3xl bg-white border border-[#E8E2D5] shadow-soft flex flex-col sm:flex-row items-center justify-around gap-6">
        <div className="flex flex-col items-center">
          <span className="text-[11px] font-serif text-charcoal-400 mb-2 uppercase tracking-widest">
            IMAGE CARD · 图卡
          </span>
          <CardView
            card={reflection.imageCard}
            type="image"
            isFlipped={true}
            className="w-36 h-48 sm:w-44 sm:h-60"
          />
          <span className="text-[11px] text-charcoal-500 pt-2 text-center max-w-[200px]">
            {reflection.imageCard.alt}
          </span>
        </div>

        <div className="hidden sm:block text-2xl font-serif text-charcoal-300">
          +
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[11px] font-serif text-charcoal-400 mb-2 uppercase tracking-widest">
            WORD CARD · 词语卡
          </span>
          <CardView
            card={reflection.wordCard}
            type="word"
            isFlipped={true}
            className="w-36 h-48 sm:w-44 sm:h-60"
          />
          <span className="text-[11px] text-charcoal-500 pt-2 text-center">
            联想词：{reflection.wordCard.word}
          </span>
        </div>
      </div>

      {/* 区块 1：你的表达（明确区分：原话不作篡改） */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-insight" />
          <h2 className="text-lg font-serif text-charcoal-900">
            你的表达记录
          </h2>
          <span className="text-xs text-charcoal-400">（真实记录你的原话）</span>
        </div>

        <div className="p-6 rounded-3xl bg-[#FAF8F4] border border-[#E8E2D5] space-y-5 text-sm">
          <div>
            <span className="text-xs font-medium text-charcoal-400 block mb-1">
              画面中最先触动你的：
            </span>
            <p className="text-charcoal-800 leading-relaxed font-sans">
              “{reflection.userExpressions.attraction || "未填写"}”
            </p>
          </div>

          {reflection.userExpressions.feelings.length > 0 && (
            <div>
              <span className="text-xs font-medium text-charcoal-400 block mb-1.5">
                当时留意到的感受词：
              </span>
              <div className="flex flex-wrap gap-2">
                {reflection.userExpressions.feelings.map((f) => (
                  <span
                    key={f}
                    className="px-3 py-1 rounded-full text-xs bg-white border border-[#DFD8C4] text-charcoal-700"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {reflection.userExpressions.wordCombination && (
            <div>
              <span className="text-xs font-medium text-charcoal-400 block mb-1">
                融入词语「{reflection.wordCard.word}」后的感觉：
              </span>
              <p className="text-charcoal-800 leading-relaxed">
                “{reflection.userExpressions.wordCombination}”
              </p>
            </div>
          )}

          {/* 追问问答记录 */}
          {reflection.userExpressions.dialogues.length > 0 && (
            <div className="pt-2 border-t border-[#ECE5D6] space-y-3">
              <span className="text-xs font-medium text-charcoal-400 block">
                问答轨迹：
              </span>
              {reflection.userExpressions.dialogues.map((d, idx) => (
                <div key={idx} className="space-y-1 bg-white/70 p-3.5 rounded-2xl border border-[#EDE7D9]">
                  <p className="text-xs text-charcoal-500 font-serif">
                    问：{d.question}
                  </p>
                  <p className="text-sm text-charcoal-800 font-medium">
                    答：{d.answer || "（未作具体展开）"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 区块 2：系统整理（明确区分，允许编辑） */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-sage-deep" />
            <h2 className="text-lg font-serif text-charcoal-900">
              系统整理与回响
            </h2>
          </div>

          <button
            onClick={() => setIsEditingSynthesis(!isEditingSynthesis)}
            className="inline-flex items-center gap-1 text-xs text-insight hover:text-insight-hover transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditingSynthesis ? "完成修改" : "修改整理内容"}</span>
          </button>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#E8E2D5] shadow-soft space-y-4">
          <p className="text-xs text-charcoal-400">
            {reflection.systemSynthesis.disclaimer}
          </p>

          {isEditingSynthesis ? (
            <textarea
              value={editedSynthesisText}
              onChange={(e) => setEditedSynthesisText(e.target.value)}
              rows={6}
              className="w-full p-4 rounded-2xl bg-[#FAF8F5] border border-insight/50 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-insight/20 text-sm leading-relaxed"
            />
          ) : (
            <div className="text-sm text-charcoal-700 leading-relaxed whitespace-pre-line font-sans">
              {editedSynthesisText}
            </div>
          )}
        </div>
      </section>

      {/* 区块 3：仍想继续探索的问题 */}
      {reflection.systemSynthesis.unresolvedQuestions.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-serif text-charcoal-700">
            留给未来的开放性思考（无需立刻作答）
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {reflection.systemSynthesis.unresolvedQuestions.map((q, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#E8E2D5] text-xs text-charcoal-600 leading-relaxed font-sans"
              >
                {q}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 区块 4：一个由用户选择或编辑的小行动 */}
      <section className="space-y-4">
        <h2 className="text-lg font-serif text-charcoal-900">
          带走一个微小的行动
        </h2>
        <p className="text-xs text-charcoal-500">
          探索不是为了停留在文字里。今天，给自己一件轻松、不费力的小事：
        </p>

        <div className="space-y-2">
          {actionOptions.map((opt) => {
            const isSelected = selectedAction === opt && !customAction.trim();
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  setSelectedAction(opt);
                  setCustomAction("");
                }}
                className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm transition-all flex items-center justify-between ${
                  isSelected
                    ? "bg-sage/40 border-sage-deep text-charcoal-900 font-medium"
                    : "bg-white border-[#E8E2D5] text-charcoal-700 hover:border-charcoal-300"
                }`}
              >
                <span>{opt}</span>
                {isSelected && <Check className="w-4 h-4 text-sage-deep" />}
              </button>
            );
          })}
        </div>

        {/* 自定义行动 */}
        <div className="pt-1">
          <input
            type="text"
            value={customAction}
            onChange={(e) => setCustomAction(e.target.value)}
            placeholder="或者，写下属于你自己的小行动..."
            className="w-full px-4 py-3 rounded-2xl bg-white border border-[#E0D8C7] text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:border-insight"
          />
        </div>
      </section>

      {/* 底部功能条：保存、真人带领、再探索、删除 */}
      <div className="pt-6 border-t border-[#E8E2D5] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={`/booking/guide_chen?topic=${encodeURIComponent(
              reflection.topic
            )}&sessionId=${reflection.sessionId}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-charcoal-800 text-charcoal-900 hover:bg-charcoal-900 hover:text-white transition-all text-xs font-medium"
          >
            <Users className="w-3.5 h-3.5" />
            <span>了解真人带领者（演示）</span>
          </Link>

          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs text-charcoal-600 hover:text-charcoal-900 hover:bg-[#ECE6D8]/60 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>再探索一次</span>
          </Link>
        </div>

        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="text-xs text-charcoal-400 hover:text-red-600 transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>删除本次记录</span>
        </button>
      </div>

      {/* 分享弹窗（遵循隐私第一原则，默认不含对话原文，用户清楚可见） */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/40 backdrop-blur-sm">
          <div className="bg-[#FAF8F4] border border-[#E5DEC9] max-w-md w-full rounded-3xl p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-cream-200 text-charcoal-500"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-[11px] font-serif uppercase tracking-widest text-insight">
                SHARE PREVIEW · 隐私受控分享
              </span>
              <h3 className="text-xl font-serif text-charcoal-900">
                分享你的探索卡片
              </h3>
              <p className="text-xs text-charcoal-500">
                为保护隐私，分享内容仅包含主题、卡牌和你的微小行动，<strong>默认不包含你的私密对话原文</strong>。
              </p>
            </div>

            {/* 卡片预览 */}
            <div className="p-5 rounded-2xl bg-white border border-[#E8E2D5] space-y-3 text-center">
              <div className="text-[11px] font-serif text-insight uppercase tracking-widest">
                映见 INSIGHT · 探索灵感
              </div>
              <div className="text-base font-serif text-charcoal-900">
                主题：「{reflection.topic}」
              </div>
              <div className="py-2 text-xs text-charcoal-600">
                抽中卡牌：<strong>{reflection.imageCard.alt}</strong> × 词语「<strong>{reflection.wordCard.word}</strong>」
              </div>
              <div className="p-3 rounded-xl bg-sage/30 text-xs text-charcoal-800">
                今日微小行动：{finalActionText}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  const text = `【映见 INSIGHT 探索】\n主题：${reflection.topic}\n画面：${reflection.imageCard.alt}\n词语：${reflection.wordCard.word}\n微小行动：${finalActionText}`;
                  navigator.clipboard.writeText(text);
                  setCopiedShare(true);
                  setTimeout(() => setCopiedShare(false), 2000);
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-charcoal-900 text-white text-xs font-medium hover:bg-insight transition-colors"
              >
                {copiedShare ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-sage" />
                    <span>已复制分享文案</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>复制分享摘要</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认弹窗 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/40 backdrop-blur-sm">
          <div className="bg-[#FAF8F4] border border-[#E5DEC9] max-w-sm w-full rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="font-medium text-sm">确认删除此条记录？</h4>
            </div>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              删除后，保存在当前设备中的本条探索记录将被完全移除，无法恢复。
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-xs text-charcoal-600 hover:bg-[#ECE6D8] rounded-full"
              >
                取消
              </button>
              <button
                onClick={handleDeleteRecord}
                className="px-4 py-2 text-xs bg-red-600 text-white hover:bg-red-700 rounded-full font-medium"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
