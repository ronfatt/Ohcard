"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowRight,
  Sparkles,
  ChevronLeft,
  RefreshCw,
  X,
  RotateCcw,
} from "lucide-react";
import { CardView } from "@/components/CardView";
import { CardRepository } from "@/repositories/cardRepository";
import { SessionStore } from "@/services/sessionStore";
import { ExplorationSession, SessionStep, DialogueItem } from "@/types/session";
import { ImageCard, WordCard } from "@/types/card";
import { activeReflectionProvider } from "@/services/reflectionService";

const FEELING_TAGS = [
  "平静",
  "孤独",
  "期待",
  "压力",
  "自由",
  "迷茫",
  "暂时没感觉",
];

export default function MobileSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params?.id as string;

  const [session, setSession] = useState<ExplorationSession | null>(null);
  const [candidates, setCandidates] = useState<ImageCard[]>([]);
  const [wordCandidates, setWordCandidates] = useState<WordCard[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isWordDrawing, setIsWordDrawing] = useState(false);

  // 临时状态（自动同步到 session）
  const [attractionText, setAttractionText] = useState("");
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const [customFeelingInput, setCustomFeelingInput] = useState("");
  const [isCustomActive, setIsCustomActive] = useState(false);
  const [wordImpactText, setWordImpactText] = useState("");

  // 追问当前回答
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [currentQuestionText, setCurrentQuestionText] = useState("");
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);

  // 1. 初始化或从 localStorage 恢复会话
  useEffect(() => {
    if (!sessionId) return;
    let s = SessionStore.getSession(sessionId);
    if (!s) {
      s = SessionStore.createSession("自主探索");
    }

    setSession(s);
    setAttractionText(s.attractionExpression || "");
    setSelectedFeelings(s.selectedFeelings || []);
    setWordImpactText(s.wordCombinationExpression || "");

    // 恢复/初始化 5 张图像候选卡
    if (!s.imageCard) {
      if (s.drawnCandidateIds && s.drawnCandidateIds.length === 5) {
        const restored = s.drawnCandidateIds
          .map((id) => CardRepository.getImageCardById(id))
          .filter(Boolean) as ImageCard[];
        setCandidates(restored.length === 5 ? restored : CardRepository.getRandomImageCandidates(5));
      } else {
        const newCandidates = CardRepository.getRandomImageCandidates(5);
        setCandidates(newCandidates);
        SessionStore.updateSession(sessionId, {
          drawnCandidateIds: newCandidates.map((c) => c.id),
        });
      }
    }

    // 恢复/初始化 3 张词语候选卡
    if (s.imageCard && !s.wordCard) {
      if (s.drawnWordCandidateIds && s.drawnWordCandidateIds.length > 0) {
        const restored = s.drawnWordCandidateIds
          .map((id) => CardRepository.getWordCardById(id))
          .filter(Boolean) as WordCard[];
        setWordCandidates(restored.length > 0 ? restored : CardRepository.getRandomWordCandidates(3));
      } else {
        const newWordCandidates = CardRepository.getRandomWordCandidates(3);
        setWordCandidates(newWordCandidates);
        SessionStore.updateSession(sessionId, {
          drawnWordCandidateIds: newWordCandidates.map((c) => c.id),
        });
      }
    }
  }, [sessionId]);

  // 2. 当进入对话阶段时，自动加载当前索引的问题
  useEffect(() => {
    if (!session || session.currentStep !== "dialogue") return;

    let isMounted = true;
    const loadQuestion = async () => {
      setIsLoadingQuestion(true);
      const qIndex = session.currentDialogueIndex || 0;

      if (session.dialogueHistory[qIndex]) {
        setCurrentQuestionText(session.dialogueHistory[qIndex].question);
        setCurrentAnswer(session.dialogueHistory[qIndex].answer || "");
        setIsLoadingQuestion(false);
        return;
      }

      const question = await activeReflectionProvider.generateFollowUpQuestion(
        session,
        qIndex
      );
      if (isMounted) {
        setCurrentQuestionText(question);
        setCurrentAnswer("");
        setIsLoadingQuestion(false);
      }
    };

    loadQuestion();
    return () => {
      isMounted = false;
    };
  }, [session?.currentStep, session?.currentDialogueIndex]);

  // 防抖自动保存文本
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoSave = (partial: Partial<ExplorationSession>) => {
    if (!session) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      const updated = SessionStore.updateSession(session.id, partial);
      if (updated) setSession(updated);
    }, 300);
  };

  // 处理图卡抽取
  const handleSelectImageCard = (card: ImageCard) => {
    if (isDrawing || !session) return;
    setIsDrawing(true);

    setTimeout(() => {
      const updated = SessionStore.updateSession(session.id, {
        imageCard: card,
        currentStep: "express_image",
      });
      if (updated) setSession(updated);
      setIsDrawing(false);
    }, 350);
  };

  // 处理感受标签点击
  const toggleFeeling = (tag: string) => {
    let next: string[];
    if (tag === "暂时没感觉") {
      next = selectedFeelings.includes("暂时没感觉") ? [] : ["暂时没感觉"];
    } else {
      next = selectedFeelings.filter((t) => t !== "暂时没感觉");
      if (next.includes(tag)) {
        next = next.filter((t) => t !== tag);
      } else {
        next.push(tag);
      }
    }
    setSelectedFeelings(next);
    autoSave({ selectedFeelings: next });
  };

  const handleAddCustomFeeling = () => {
    const val = customFeelingInput.trim();
    if (!val) return;
    const next = [...selectedFeelings.filter((t) => t !== "暂时没感觉"), val];
    setSelectedFeelings(next);
    setCustomFeelingInput("");
    setIsCustomActive(false);
    autoSave({ selectedFeelings: next });
  };

  // 阶段 B -> 阶段 C（进入抽词卡）
  const handleProceedToWordDraw = () => {
    if (!session) return;
    const words = CardRepository.getRandomWordCandidates(3);
    setWordCandidates(words);
    const updated = SessionStore.updateSession(session.id, {
      attractionExpression: attractionText,
      selectedFeelings,
      currentStep: "draw_word",
      drawnWordCandidateIds: words.map((w) => w.id),
    });
    if (updated) setSession(updated);
  };

  // 处理词卡抽取
  const handleSelectWordCard = (wordCard: WordCard) => {
    if (isWordDrawing || !session) return;
    setIsWordDrawing(true);

    setTimeout(() => {
      const updated = SessionStore.updateSession(session.id, {
        wordCard,
      });
      if (updated) setSession(updated);
      setIsWordDrawing(false);
    }, 350);
  };

  // 阶段 C -> 阶段 D
  const handleProceedToDialogue = () => {
    if (!session) return;
    const updated = SessionStore.updateSession(session.id, {
      wordCombinationExpression: wordImpactText,
      currentStep: "dialogue",
      currentDialogueIndex: 0,
    });
    if (updated) setSession(updated);
  };

  // 提交当前追问
  const handleAnswerDialogue = (skip: boolean = false) => {
    if (!session) return;
    const currentIndex = session.currentDialogueIndex || 0;
    const history = [...session.dialogueHistory];

    const newItem: DialogueItem = {
      id: "q_" + currentIndex,
      question: currentQuestionText,
      answer: skip ? "（跳过此问题）" : currentAnswer.trim(),
      skipped: skip,
    };

    history[currentIndex] = newItem;

    if (currentIndex >= 2) {
      const updated = SessionStore.updateSession(session.id, {
        dialogueHistory: history,
        currentStep: "review",
      });
      if (updated) setSession(updated);
      router.push(`/reflection/${session.id}`);
    } else {
      const updated = SessionStore.updateSession(session.id, {
        dialogueHistory: history,
        currentDialogueIndex: currentIndex + 1,
      });
      if (updated) setSession(updated);
      setCurrentAnswer("");
    }
  };

  // 随时提前结束
  const handleFinishEarly = () => {
    if (!session) return;
    if (currentAnswer.trim() && currentQuestionText) {
      const history = [...session.dialogueHistory];
      history[session.currentDialogueIndex || 0] = {
        id: "q_" + (session.currentDialogueIndex || 0),
        question: currentQuestionText,
        answer: currentAnswer.trim(),
      };
      SessionStore.updateSession(session.id, { dialogueHistory: history });
    }
    router.push(`/reflection/${session.id}`);
  };

  // 返回上一步
  const handleGoBackStep = () => {
    if (!session) return;
    if (session.currentStep === "express_image") {
      const updated = SessionStore.updateSession(session.id, {
        currentStep: "draw_image",
        imageCard: null,
      });
      if (updated) setSession(updated);
    } else if (session.currentStep === "draw_word") {
      if (session.wordCard) {
        const updated = SessionStore.updateSession(session.id, {
          wordCard: null,
        });
        if (updated) setSession(updated);
      } else {
        const updated = SessionStore.updateSession(session.id, {
          currentStep: "express_image",
        });
        if (updated) setSession(updated);
      }
    } else if (session.currentStep === "dialogue") {
      if (session.currentDialogueIndex > 0) {
        const prevIndex = session.currentDialogueIndex - 1;
        const updated = SessionStore.updateSession(session.id, {
          currentDialogueIndex: prevIndex,
        });
        if (updated) setSession(updated);
      } else {
        const updated = SessionStore.updateSession(session.id, {
          currentStep: "draw_word",
        });
        if (updated) setSession(updated);
      }
    }
  };

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-xs text-charcoal-400">
        开启探索空间...
      </div>
    );
  }

  const currentStepNum =
    session.currentStep === "draw_image"
      ? 1
      : session.currentStep === "express_image"
      ? 2
      : session.currentStep === "draw_word"
      ? 3
      : 4;

  return (
    <div className="flex-1 flex flex-col justify-between px-4 py-2 space-y-4">
      {/* 顶部原生分段进度条 (iOS Segmented Progress) */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-[11px] text-charcoal-500">
          <div className="flex items-center gap-1.5 truncate max-w-[200px]">
            {currentStepNum > 1 && (
              <button
                onClick={handleGoBackStep}
                className="p-1 -ml-1 text-charcoal-600 active:scale-90"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <span className="font-serif text-charcoal-800 font-medium truncate">
              {session.topic}
            </span>
          </div>

          <button
            onClick={handleFinishEarly}
            className="text-[11px] text-charcoal-400 active:text-charcoal-700"
          >
            结束探索
          </button>
        </div>

        {/* 4 节分段进度指示条 */}
        <div className="grid grid-cols-4 gap-1.5 h-1 w-full">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`rounded-full transition-all duration-300 ${
                currentStepNum >= step ? "bg-insight" : "bg-cream-300/60"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 阶段 A：点选图像卡                                               */}
      {/* ============================================================== */}
      {session.currentStep === "draw_image" && (
        <div className="flex-1 flex flex-col justify-between space-y-4 my-auto">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-serif uppercase tracking-widest text-insight">
              STAGE 01 · 图像抽取
            </span>
            <h2 className="text-lg font-serif text-charcoal-900">
              凭第一直觉，点选一张卡牌
            </h2>
            <p className="text-xs text-charcoal-500">
              让手指停留在吸引你的那一处
            </p>
          </div>

          {/* 5 张卡牌紧凑移动端陈列 */}
          <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto py-2">
            {candidates.slice(0, 3).map((card) => (
              <div key={card.id} className="flex justify-center">
                <CardView
                  card={card}
                  type="image"
                  isFlipped={false}
                  interactive={!isDrawing}
                  onClick={() => handleSelectImageCard(card)}
                  className="w-24 h-32 active:scale-95 transition-transform"
                />
              </div>
            ))}
            <div className="col-span-3 flex justify-center gap-2.5">
              {candidates.slice(3, 5).map((card) => (
                <div key={card.id}>
                  <CardView
                    card={card}
                    type="image"
                    isFlipped={false}
                    interactive={!isDrawing}
                    onClick={() => handleSelectImageCard(card)}
                    className="w-24 h-32 active:scale-95 transition-transform"
                  />
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-[10px] text-charcoal-400">
            点选后固定本次探索结果 · 纯随机抽取
          </p>
        </div>
      )}

      {/* ============================================================== */}
      {/* 阶段 B：观察与表达                                               */}
      {/* ============================================================== */}
      {session.currentStep === "express_image" && session.imageCard && (
        <div className="flex-1 flex flex-col justify-between space-y-4">
          {/* 上半部分：抽中的水彩画卡 */}
          <div className="flex flex-col items-center pt-1">
            <div className="w-40 h-[213px] rounded-2xl overflow-hidden shadow-card">
              <CardView
                card={session.imageCard}
                type="image"
                isFlipped={true}
                className="w-full h-full"
              />
            </div>
            <p className="pt-2 text-[10px] text-charcoal-400 text-center max-w-[240px] truncate">
              {session.imageCard.alt}
            </p>
          </div>

          {/* 交互输入区 */}
          <div className="space-y-3">
            <div className="space-y-1">
              <h3 className="text-sm font-serif text-charcoal-900 font-medium">
                画面里，什么最先吸引了你？
              </h3>
              <p className="text-[11px] text-charcoal-500">
                一个局部、光影，或让你有共鸣的氛围
              </p>
            </div>

            <textarea
              value={attractionText}
              onChange={(e) => {
                setAttractionText(e.target.value);
                autoSave({ attractionExpression: e.target.value });
              }}
              placeholder="例如：我第一眼注意到了那束温暖的光芒..."
              rows={3}
              className="w-full p-3 rounded-2xl bg-white border border-[#E0D8C7] text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:border-insight text-xs resize-none leading-relaxed"
            />

            {/* 辅助感受词横滑 */}
            <div className="space-y-1">
              <span className="text-[10px] text-charcoal-400 block">
                点选此时的感受词（可选）：
              </span>
              <div className="flex flex-wrap gap-1.5">
                {FEELING_TAGS.map((tag) => {
                  const isSelected = selectedFeelings.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleFeeling(tag)}
                      className={`px-2.5 py-1 rounded-full text-[11px] transition-all border ${
                        isSelected
                          ? "bg-insight text-white border-insight"
                          : "bg-white/80 border-[#DFD8C7] text-charcoal-700 active:bg-cream-200"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 下一步操作 */}
          <div className="pt-1">
            <button
              onClick={handleProceedToWordDraw}
              className="w-full py-3.5 rounded-full bg-charcoal-900 text-white text-xs font-medium flex items-center justify-center gap-1.5 active:scale-[0.98] shadow-md hover:bg-insight"
            >
              <span>继续，抽一张词语卡</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 阶段 C：抽词语卡与图词碰撞                                       */}
      {/* ============================================================== */}
      {session.currentStep === "draw_word" && (
        <div className="flex-1 flex flex-col justify-between space-y-4">
          {!session.wordCard ? (
            <div className="flex-1 flex flex-col justify-between space-y-6 my-auto text-center">
              <div className="space-y-1">
                <span className="text-[10px] font-serif uppercase tracking-widest text-insight">
                  STAGE 03 · 词语卡
                </span>
                <h2 className="text-lg font-serif text-charcoal-900">
                  为你的画面引入一个词语
                </h2>
                <p className="text-xs text-charcoal-500">
                  词语如同投入水面的石子，唤起新的觉察
                </p>
              </div>

              {/* 3 张词卡待翻 */}
              <div className="flex justify-center gap-3 py-2">
                {wordCandidates.map((word) => (
                  <CardView
                    key={word.id}
                    card={word}
                    type="word"
                    isFlipped={false}
                    interactive={!isWordDrawing}
                    onClick={() => handleSelectWordCard(word)}
                    className="w-24 h-34 active:scale-95 transition-transform"
                  />
                ))}
              </div>

              <p className="text-[10px] text-charcoal-400">
                轻触其中一张翻开
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between space-y-4">
              {/* 双卡并置展陈 */}
              <div className="flex items-center justify-center gap-3 pt-1">
                <div className="w-32 h-[170px] rounded-xl overflow-hidden shadow-xs">
                  <CardView
                    card={session.imageCard}
                    type="image"
                    isFlipped={true}
                    className="w-full h-full"
                  />
                </div>
                <div className="w-32 h-[170px] rounded-xl overflow-hidden shadow-xs">
                  <CardView
                    card={session.wordCard}
                    type="word"
                    isFlipped={true}
                    className="w-full h-full"
                  />
                </div>
              </div>

              {/* 感受变化输入 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-serif text-charcoal-900 font-medium">
                    把「{session.wordCard.word}」放进画面，感觉有何变化？
                  </h3>
                  <button
                    onClick={() => {
                      const newWords = CardRepository.getRandomWordCandidates(3);
                      setWordCandidates(newWords);
                      const updated = SessionStore.updateSession(session.id, {
                        wordCard: null,
                        drawnWordCandidateIds: newWords.map((w) => w.id),
                      });
                      if (updated) setSession(updated);
                    }}
                    className="text-[10px] text-charcoal-400 flex items-center gap-0.5"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>重抽</span>
                  </button>
                </div>

                <textarea
                  value={wordImpactText}
                  onChange={(e) => {
                    setWordImpactText(e.target.value);
                    autoSave({ wordCombinationExpression: e.target.value });
                  }}
                  placeholder="写下这个词语带来的联想..."
                  rows={3}
                  className="w-full p-3 rounded-2xl bg-white border border-[#E0D8C7] text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:border-insight text-xs resize-none leading-relaxed"
                />
              </div>

              <div className="pt-1">
                <button
                  onClick={handleProceedToDialogue}
                  className="w-full py-3.5 rounded-full bg-charcoal-900 text-white text-xs font-medium flex items-center justify-center gap-1.5 active:scale-[0.98] shadow-md hover:bg-insight"
                >
                  <span>进入深入追问</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 阶段 D：逐次追问                                                */}
      {/* ============================================================== */}
      {session.currentStep === "dialogue" && (
        <div className="flex-1 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-[11px]">
            <span className="px-2 py-0.5 rounded-full bg-sage text-charcoal-800 text-[10px]">
              演示引导 · 第 {(session.currentDialogueIndex || 0) + 1} / 3 问
            </span>
            <span className="text-[10px] text-charcoal-400">
              可随时跳过
            </span>
          </div>

          {/* 问题卡片 */}
          <div className="p-4 rounded-2xl bg-white border border-[#E0D8C7] shadow-soft space-y-3">
            {isLoadingQuestion ? (
              <div className="py-6 text-center text-xs text-charcoal-400 animate-pulse">
                生成温和追问中...
              </div>
            ) : (
              <>
                <p className="text-sm font-serif text-charcoal-900 leading-relaxed font-medium">
                  {currentQuestionText}
                </p>

                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="写下你的想法，或者点击跳过..."
                  rows={4}
                  className="w-full p-3 rounded-xl bg-[#FAF8F4] border border-[#E8E2D5] text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:border-insight text-xs resize-none leading-relaxed"
                />
              </>
            )}
          </div>

          {/* 底部按钮 */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={() => handleAnswerDialogue(false)}
              disabled={isLoadingQuestion}
              className="w-full py-3.5 rounded-full bg-charcoal-900 text-white text-xs font-medium flex items-center justify-center gap-1.5 active:scale-[0.98] shadow-md hover:bg-insight disabled:opacity-50"
            >
              <span>
                {(session.currentDialogueIndex || 0) >= 2
                  ? "完成并查看回顾"
                  : "回答并进入下一问"}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => handleAnswerDialogue(true)}
              className="w-full py-2 text-center text-[11px] text-charcoal-400 hover:text-charcoal-700"
            >
              暂无感觉，跳过此问
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
