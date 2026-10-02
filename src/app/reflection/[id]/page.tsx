"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
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

export default function MobileReflectionPage() {
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
      router.push("/");
      return;
    }

    setSession(s);

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

  const handleDeleteRecord = () => {
    SessionStore.deleteSavedReflection(sessionId);
    router.push("/journal");
  };

  if (!reflection || !session || !session.imageCard || !session.wordCard) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-xs text-charcoal-400">
        梳理探索回顾中...
      </div>
    );
  }

  const finalActionText = customAction.trim() || selectedAction;

  return (
    <div className="flex-1 flex flex-col px-4 pt-2 pb-8 space-y-5">
      {/* 顶部操作条（保存与分享） */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-full bg-sage text-[10px] text-charcoal-800">
            {reflection.topic}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveRecord}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              isSaved
                ? "bg-sage text-charcoal-800 border border-sage-dark"
                : "bg-charcoal-900 text-white"
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-3 h-3 text-insight" />
                <span>已存日记</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3 h-3" />
                <span>保存</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowShareModal(true)}
            className="p-1.5 rounded-full border border-charcoal-200 text-charcoal-600 active:scale-95"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 双卡并置展陈 */}
      <div className="p-3.5 rounded-2xl bg-white border border-[#E8E2D5] shadow-xs flex items-center justify-around gap-3">
        <div className="flex flex-col items-center">
          <CardView
            card={reflection.imageCard}
            type="image"
            isFlipped={true}
            className="w-28 h-38 shrink-0"
          />
          <span className="text-[10px] text-charcoal-400 pt-1.5 truncate max-w-[110px]">
            {reflection.imageCard.alt}
          </span>
        </div>

        <span className="text-xl font-serif text-charcoal-300">+</span>

        <div className="flex flex-col items-center">
          <CardView
            card={reflection.wordCard}
            type="word"
            isFlipped={true}
            className="w-28 h-38 shrink-0"
          />
          <span className="text-[10px] text-charcoal-400 pt-1.5">
            {reflection.wordCard.word}
          </span>
        </div>
      </div>

      {/* 你的原话轨迹 */}
      <div className="p-4 rounded-2xl bg-white border border-[#E8E2D5] space-y-3">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-insight" />
          <h3 className="text-xs font-serif text-charcoal-900 font-medium">
            你的表达记录
          </h3>
        </div>

        <div className="space-y-2 text-xs">
          <div>
            <span className="text-[10px] text-charcoal-400 block">最初吸引你的：</span>
            <p className="text-charcoal-800 leading-relaxed font-sans">
              “{reflection.userExpressions.attraction}”
            </p>
          </div>

          {reflection.userExpressions.feelings.length > 0 && (
            <div>
              <span className="text-[10px] text-charcoal-400 block mb-1">当时觉察的感受：</span>
              <div className="flex flex-wrap gap-1">
                {reflection.userExpressions.feelings.map((f) => (
                  <span key={f} className="px-2 py-0.5 rounded-full text-[10px] bg-cream-200 text-charcoal-700">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {reflection.userExpressions.dialogues.length > 0 && (
            <div className="pt-2 border-t border-[#F2ECE1] space-y-1.5">
              {reflection.userExpressions.dialogues.map((d, i) => (
                <div key={i} className="space-y-0.5">
                  <p className="text-[10px] text-charcoal-400 font-serif">问：{d.question}</p>
                  <p className="text-xs text-charcoal-800">答：“{d.answer}”</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 系统整理与回响 */}
      <div className="p-4 rounded-2xl bg-white border border-[#E8E2D5] space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sage-deep" />
            <h3 className="text-xs font-serif text-charcoal-900 font-medium">
              系统整理
            </h3>
          </div>
          <button
            onClick={() => setIsEditingSynthesis(!isEditingSynthesis)}
            className="text-[11px] text-insight flex items-center gap-0.5"
          >
            <Edit3 className="w-3 h-3" />
            <span>{isEditingSynthesis ? "完成" : "编辑"}</span>
          </button>
        </div>

        {isEditingSynthesis ? (
          <textarea
            value={editedSynthesisText}
            onChange={(e) => setEditedSynthesisText(e.target.value)}
            rows={5}
            className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-insight/40 text-xs text-charcoal-900 leading-relaxed"
          />
        ) : (
          <p className="text-xs text-charcoal-700 leading-relaxed font-sans whitespace-pre-line">
            {editedSynthesisText}
          </p>
        )}
      </div>

      {/* 微小行动建议 */}
      <div className="p-4 rounded-2xl bg-white border border-[#E8E2D5] space-y-2.5">
        <h3 className="text-xs font-serif text-charcoal-900 font-medium">
          带走一个微小行动
        </h3>

        <div className="space-y-1.5">
          {actionOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                setSelectedAction(opt);
                setCustomAction("");
              }}
              className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                selectedAction === opt && !customAction.trim()
                  ? "bg-sage/40 border-sage-deep text-charcoal-900 font-medium"
                  : "bg-white/80 border-[#E8E2D5] text-charcoal-700"
              }`}
            >
              <span>{opt}</span>
              {selectedAction === opt && !customAction.trim() && (
                <Check className="w-3.5 h-3.5 text-sage-deep" />
              )}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={customAction}
          onChange={(e) => setCustomAction(e.target.value)}
          placeholder="或自定义你的微小行动..."
          className="w-full px-3 py-2 rounded-xl bg-[#FAF8F4] border border-[#E0D8C7] text-xs text-charcoal-900"
        />
      </div>

      {/* 底部导航组 */}
      <div className="space-y-2 pt-1">
        <div className="flex gap-2">
          <Link
            href={`/booking/guide_chen?topic=${encodeURIComponent(reflection.topic)}&sessionId=${reflection.sessionId}`}
            className="flex-1 py-3 rounded-full border border-charcoal-800 text-charcoal-900 text-xs font-medium text-center active:scale-95"
          >
            真人带领者（演示）
          </Link>

          <Link
            href="/explore"
            className="flex-1 py-3 rounded-full bg-charcoal-900 text-white text-xs font-medium text-center active:scale-95 flex items-center justify-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>再来一次</span>
          </Link>
        </div>

        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full py-2 text-center text-[11px] text-charcoal-400 hover:text-red-500"
        >
          删除本次记录
        </button>
      </div>

      {/* 分享受控抽屉 */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal-900/50 backdrop-blur-xs">
          <div className="bg-[#FAF8F4] w-full max-w-md rounded-t-3xl p-5 space-y-4 shadow-2xl border-t border-[#E5DEC9]">
            <div className="w-10 h-1 rounded-full bg-charcoal-300 mx-auto -mt-1" />

            <div className="flex items-center justify-between">
              <span className="text-[10px] font-serif uppercase tracking-widest text-insight">
                SHARE CARD
              </span>
              <button onClick={() => setShowShareModal(false)}>
                <X className="w-5 h-5 text-charcoal-400" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E8E2D5] space-y-2 text-center text-xs">
              <p className="font-serif font-medium text-charcoal-900">
                映见 ·「{reflection.topic}」
              </p>
              <p className="text-charcoal-600">
                {reflection.imageCard.alt} × 词语「{reflection.wordCard.word}」
              </p>
              <div className="p-2 rounded-lg bg-sage/30 text-charcoal-800 text-[11px]">
                今日微小行动：{finalActionText}
              </div>
            </div>

            <p className="text-[10px] text-charcoal-400 text-center">
              保护隐私：默认不包含私密对话原文
            </p>

            <button
              onClick={() => {
                const text = `【映见 INSIGHT】\n主题：${reflection.topic}\n卡牌：${reflection.imageCard.alt} ×「${reflection.wordCard.word}」\n今日微小行动：${finalActionText}`;
                navigator.clipboard.writeText(text);
                setCopiedShare(true);
                setTimeout(() => setCopiedShare(false), 2000);
              }}
              className="w-full py-3 rounded-full bg-charcoal-900 text-white text-xs font-medium flex items-center justify-center gap-1.5"
            >
              {copiedShare ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>已复制分享文本</span>
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
      )}

      {/* 删除确认弹窗 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/50 backdrop-blur-xs">
          <div className="bg-[#FAF8F4] w-full max-w-xs rounded-3xl p-5 space-y-3 shadow-xl">
            <h4 className="font-medium text-xs text-red-600 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>确认删除此条记录？</span>
            </h4>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              删除后，本机保存的本次探索将被移除。
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3.5 py-1.5 text-xs text-charcoal-600 rounded-full"
              >
                取消
              </button>
              <button
                onClick={handleDeleteRecord}
                className="px-4 py-1.5 text-xs bg-red-600 text-white rounded-full font-medium"
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
