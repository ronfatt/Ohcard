"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Eye,
  MessageSquare,
  Check,
  ChevronLeft,
  RefreshCw,
  Info,
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

export default function SessionPage() {
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

  // 移动端图卡放大或折叠查看
  const [showFullCardMobile, setShowFullCardMobile] = useState(false);

  // 1. 初始化或从 localStorage 恢复会话
  useEffect(() => {
    if (!sessionId) return;
    let s = SessionStore.getSession(sessionId);
    if (!s) {
      // 容错：如果用户直接输入未知的 session id，则创建或跳回
      s = SessionStore.createSession("自主探索");
    }

    setSession(s);
    setAttractionText(s.attractionExpression || "");
    setSelectedFeelings(s.selectedFeelings || []);
    setWordImpactText(s.wordCombinationExpression || "");

    // 恢复/初始化 5 张图像候选卡（确保刷新后候选卡面不变）
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

      // 如果历史里已有该问题，直接复用
      if (session.dialogueHistory[qIndex]) {
        setCurrentQuestionText(session.dialogueHistory[qIndex].question);
        setCurrentAnswer(session.dialogueHistory[qIndex].answer || "");
        setIsLoadingQuestion(false);
        return;
      }

      // 通过 ReflectionProvider 生成新的温和追问
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
    }, 400);
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

  // 提交自定义标签
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
    // 确保生成词卡候选
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
    }, 400);
  };

  // 阶段 C 确认感受变化 -> 进入阶段 D（追问）
  const handleProceedToDialogue = () => {
    if (!session) return;
    const updated = SessionStore.updateSession(session.id, {
      wordCombinationExpression: wordImpactText,
      currentStep: "dialogue",
      currentDialogueIndex: 0,
    });
    if (updated) setSession(updated);
  };

  // 提交当前追问回答并进入下一个或完成
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

    // 共 2~3 个问题，在第 3 个问题（index = 2）回答后进入回顾
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

  // 用户随时提前结束探索
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
      // 允许重新选图
      const updated = SessionStore.updateSession(session.id, {
        currentStep: "draw_image",
        imageCard: null,
      });
      if (updated) setSession(updated);
    } else if (session.currentStep === "draw_word") {
      if (session.wordCard) {
        // 重抽词卡
        const updated = SessionStore.updateSession(session.id, {
          wordCard: null,
        });
        if (updated) setSession(updated);
      } else {
        // 退回观察与表达
        const updated = SessionStore.updateSession(session.id, {
          currentStep: "express_image",
        });
        if (updated) setSession(updated);
      }
    } else if (session.currentStep === "dialogue") {
      if (session.currentDialogueIndex > 0) {
        // 退回上一题
        const prevIndex = session.currentDialogueIndex - 1;
        const updated = SessionStore.updateSession(session.id, {
          currentDialogueIndex: prevIndex,
        });
        if (updated) setSession(updated);
      } else {
        // 退回词图联想输入
        const updated = SessionStore.updateSession(session.id, {
          currentStep: "draw_word",
        });
        if (updated) setSession(updated);
      }
    }
  };

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-charcoal-400">
        正在开启探索空间...
      </div>
    );
  }

  // 步骤导航指示
  const stepsName = [
    { key: "draw_image", label: "抽图像卡" },
    { key: "express_image", label: "观察与表达" },
    { key: "draw_word", label: "抽词语卡" },
    { key: "dialogue", label: "深入追问" },
  ];

  const currentStepNum =
    session.currentStep === "draw_image"
      ? 1
      : session.currentStep === "express_image"
      ? 2
      : session.currentStep === "draw_word"
      ? 3
      : 4;

  return (
    <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-4 sm:px-6 py-4 sm:py-8">
      {/* 顶部栏：主题提示、返回步数、随时结束入口 */}
      <div className="w-full flex items-center justify-between pb-4 border-b border-[#E8E2D5] text-xs">
        <div className="flex items-center gap-3">
          {currentStepNum > 1 && (
            <button
              onClick={handleGoBackStep}
              className="inline-flex items-center gap-1 text-charcoal-600 hover:text-charcoal-900 transition-colors p-1 -ml-1 rounded"
              title="返回上一步（回答自动保留）"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">上一步</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className="text-charcoal-400 font-serif">主题:</span>
            <span className="text-charcoal-800 font-medium truncate max-w-[160px] sm:max-w-xs">
              {session.topic}
            </span>
          </div>
        </div>

        {/* 步骤条 */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs text-charcoal-400">
            {stepsName.map((st, i) => (
              <React.Fragment key={st.key}>
                <span
                  className={
                    currentStepNum === i + 1
                      ? "text-insight font-medium"
                      : currentStepNum > i + 1
                      ? "text-charcoal-700"
                      : "text-charcoal-300"
                  }
                >
                  {st.label}
                </span>
                {i < stepsName.length - 1 && (
                  <span className="text-charcoal-200">/</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {currentStepNum >= 2 && (
            <button
              onClick={handleFinishEarly}
              className="text-charcoal-500 hover:text-charcoal-800 underline underline-offset-4 transition-colors"
            >
              结束并查看回顾
            </button>
          )}
        </div>
      </div>

      {/* 主体交互区域 */}
      <div className="flex-1 flex flex-col justify-center py-6 sm:py-8">
        {/* ============================================================== */}
        {/* 阶段 A：抽图像卡                                                 */}
        {/* ============================================================== */}
        {session.currentStep === "draw_image" && (
          <div className="space-y-8 max-w-4xl mx-auto w-full text-center">
            <div className="space-y-2">
              <span className="text-xs font-serif text-insight uppercase tracking-widest">
                STAGE 01 · 图像卡
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-charcoal-900">
                请跟随第一直觉，点选一张卡牌
              </h2>
              <p className="text-sm text-charcoal-600">
                不用思考哪张更好。让手指停留在最吸引你的那一块。
              </p>
            </div>

            {/* 5 张卡牌背面展示 */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-5 justify-center items-center max-w-3xl mx-auto pt-4">
              {candidates.map((card, idx) => (
                <div
                  key={card.id}
                  className={`flex justify-center ${
                    idx === 4 ? "col-span-2 sm:col-span-1" : ""
                  }`}
                >
                  <CardView
                    card={card}
                    type="image"
                    isFlipped={false}
                    interactive={!isDrawing}
                    onClick={() => handleSelectImageCard(card)}
                    className="w-36 h-48 sm:w-full sm:h-auto"
                  />
                </div>
              ))}
            </div>

            <div className="text-xs text-charcoal-400 pt-4">
              点击翻开后将固定本次探索结果，不作偷偷替换
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 阶段 B：观察与表达                                               */}
        {/* 桌面端：左侧卡牌，右侧表达。移动端：紧凑聚焦                       */}
        {/* ============================================================== */}
        {session.currentStep === "express_image" && session.imageCard && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto w-full">
            {/* 左侧：抽中的图卡展示 */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-white/60 rounded-3xl border border-[#E8E2D5]">
              <CardView
                card={session.imageCard}
                type="image"
                isFlipped={true}
                showLabel={true}
                className="w-56 sm:w-64 max-w-full"
              />
              <p className="pt-3 text-[11px] text-charcoal-400 text-center">
                客观画面：{session.imageCard.alt}
              </p>
            </div>

            {/* 右侧：观察与表达交互 */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-serif text-insight uppercase tracking-widest">
                  STAGE 02 · 观察与表达
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-charcoal-900 leading-snug">
                  画面里，什么最先吸引了你？
                </h2>
                <p className="text-xs sm:text-sm text-charcoal-600">
                  可以是一个局部、一种颜色、一种氛围，或者是画中让你有共鸣的事物。
                </p>
              </div>

              {/* 输入框 */}
              <div className="space-y-2">
                <textarea
                  value={attractionText}
                  onChange={(e) => {
                    setAttractionText(e.target.value);
                    autoSave({ attractionExpression: e.target.value });
                  }}
                  placeholder="例如：我第一眼看到了那盏亮起的微弱路灯，周围很黑，但它一直静静亮着..."
                  rows={4}
                  className="w-full p-4 rounded-2xl bg-white border border-[#E0D8C7] text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-insight/30 focus:border-insight transition-all resize-none text-sm leading-relaxed"
                />
              </div>

              {/* 辅助感受词选择 */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-charcoal-700">
                    如果可以选几个词形容此刻的体会（辅助词，不替代你的回答）：
                  </label>
                </div>

                <div className="flex flex-wrap gap-2">
                  {FEELING_TAGS.map((tag) => {
                    const isSelected = selectedFeelings.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleFeeling(tag)}
                        className={`px-3.5 py-1.5 rounded-full text-xs transition-all border ${
                          isSelected
                            ? "bg-insight text-white border-insight shadow-xs"
                            : "bg-[#F3EFE6] border-[#DFD8C7] text-charcoal-700 hover:border-charcoal-400"
                        }`}
                      >
                        {isSelected && <span className="mr-1">✓</span>}
                        {tag}
                      </button>
                    );
                  })}

                  {!isCustomActive ? (
                    <button
                      type="button"
                      onClick={() => setIsCustomActive(true)}
                      className="px-3 py-1.5 rounded-full text-xs border border-dashed border-charcoal-300 text-charcoal-600 hover:border-insight hover:text-insight transition-colors"
                    >
                      + 自定义词
                    </button>
                  ) : (
                    <div className="inline-flex items-center gap-1.5">
                      <input
                        type="text"
                        value={customFeelingInput}
                        onChange={(e) => setCustomFeelingInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddCustomFeeling();
                          }
                        }}
                        placeholder="输入感受词..."
                        className="px-3 py-1 text-xs rounded-full border border-insight bg-white focus:outline-none w-28"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomFeeling}
                        className="text-xs px-2.5 py-1 bg-insight text-white rounded-full"
                      >
                        确定
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 下一步操作 */}
              <div className="pt-4 flex items-center justify-between">
                <span className="text-xs text-charcoal-400">
                  没有特别的感觉也可以直接跳过进入下一阶段
                </span>

                <button
                  onClick={handleProceedToWordDraw}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-charcoal-900 text-[#F6F3EC] hover:bg-insight transition-all shadow-md text-sm font-medium"
                >
                  <span>继续，抽一张词语卡</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 阶段 C：抽词语卡与图词结合                                       */}
        {/* ============================================================== */}
        {session.currentStep === "draw_word" && (
          <div className="space-y-8 max-w-5xl mx-auto w-full">
            {!session.wordCard ? (
              /* 还未抽取词卡：展示词卡背面供抽取 */
              <div className="text-center space-y-8 max-w-2xl mx-auto">
                <div className="space-y-2">
                  <span className="text-xs font-serif text-insight uppercase tracking-widest">
                    STAGE 03 · 抽取词语卡
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif text-charcoal-900">
                    为你的画面引入一个词语
                  </h2>
                  <p className="text-sm text-charcoal-600">
                    词语就像投进湖水的一粒石子，看看会激起怎样的涟漪。
                  </p>
                </div>

                <div className="flex justify-center items-center gap-4 sm:gap-6 pt-2">
                  {wordCandidates.map((word) => (
                    <CardView
                      key={word.id}
                      card={word}
                      type="word"
                      isFlipped={false}
                      interactive={!isWordDrawing}
                      onClick={() => handleSelectWordCard(word)}
                      className="w-32 h-44 sm:w-40 sm:h-56"
                    />
                  ))}
                </div>

                <p className="text-xs text-charcoal-400">
                  随机抽取一张，不根据前置表达作刻意调整
                </p>
              </div>
            ) : (
              /* 已抽中词卡：图卡与词卡并排，并提出问题 */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* 左侧：图卡与词卡双卡组合 */}
                <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-4 items-center justify-center p-5 bg-white/60 rounded-3xl border border-[#E8E2D5]">
                  <div className="w-full flex justify-center gap-3">
                    {/* 图卡 */}
                    <CardView
                      card={session.imageCard}
                      type="image"
                      isFlipped={true}
                      className="w-36 h-48 sm:w-40 sm:h-52 shrink-0"
                    />
                    {/* 词卡 */}
                    <CardView
                      card={session.wordCard}
                      type="word"
                      isFlipped={true}
                      className="w-36 h-48 sm:w-40 sm:h-52 shrink-0"
                    />
                  </div>
                  <div className="text-center pt-1 text-xs text-charcoal-500 font-serif">
                    图卡与词卡「{session.wordCard.word}」并置
                  </div>
                </div>

                {/* 右侧：图词碰撞问答 */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="space-y-2">
                    <span className="text-xs font-serif text-insight uppercase tracking-widest">
                      STAGE 03 · 联想与碰撞
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-serif text-charcoal-900 leading-snug">
                      把这个词放进画面，你的感觉有什么变化？
                    </h2>
                    <p className="text-xs sm:text-sm text-charcoal-600">
                      它让画面变得更轻，还是更重？是带来了某种解释，还是产生了新的冲突？
                    </p>
                  </div>

                  <div className="space-y-2">
                    <textarea
                      value={wordImpactText}
                      onChange={(e) => {
                        setWordImpactText(e.target.value);
                        autoSave({ wordCombinationExpression: e.target.value });
                      }}
                      placeholder={`例如：当「${session.wordCard.word}」出现时，我感觉...`}
                      rows={4}
                      className="w-full p-4 rounded-2xl bg-white border border-[#E0D8C7] text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-insight/30 focus:border-insight transition-all resize-none text-sm leading-relaxed"
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      onClick={() => {
                        // 允许换一张词卡
                        const newWords = CardRepository.getRandomWordCandidates(3);
                        setWordCandidates(newWords);
                        const updated = SessionStore.updateSession(session.id, {
                          wordCard: null,
                          drawnWordCandidateIds: newWords.map((w) => w.id),
                        });
                        if (updated) setSession(updated);
                      }}
                      className="text-xs text-charcoal-400 hover:text-charcoal-700 underline underline-offset-4 flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>换一张词语卡</span>
                    </button>

                    <button
                      onClick={handleProceedToDialogue}
                      className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-charcoal-900 text-[#F6F3EC] hover:bg-insight transition-all shadow-md text-sm font-medium"
                    >
                      <span>进入深入追问</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* 阶段 D：逐次深入追问                                            */}
        {/* ============================================================== */}
        {session.currentStep === "dialogue" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto w-full">
            {/* 左侧双卡参考 */}
            <div className="lg:col-span-4 flex flex-row lg:flex-col gap-3 justify-center items-center p-4 bg-white/60 rounded-3xl border border-[#E8E2D5]">
              <CardView
                card={session.imageCard}
                type="image"
                isFlipped={true}
                className="w-28 h-36 sm:w-36 sm:h-48"
              />
              <CardView
                card={session.wordCard}
                type="word"
                isFlipped={true}
                className="w-28 h-36 sm:w-36 sm:h-48"
              />
            </div>

            {/* 右侧追问区（单题聚焦） */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-sage text-charcoal-800 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-insight" />
                  <span>演示引导 · 第 {(session.currentDialogueIndex || 0) + 1} / 3 问</span>
                </div>

                <span className="text-xs text-charcoal-400">
                  不预设心理问题 · 允许跳过或否认
                </span>
              </div>

              {/* 问题卡片 */}
              <div className="p-6 rounded-3xl bg-white border border-[#E2DAD0] shadow-soft space-y-4">
                {isLoadingQuestion ? (
                  <div className="py-6 text-center text-charcoal-400 text-sm animate-pulse">
                    正在根据你的表达生成温和追问...
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg sm:text-xl font-serif text-charcoal-900 leading-relaxed">
                      {currentQuestionText}
                    </h3>

                    <textarea
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      placeholder="写下你的想法，或者随时点击跳过..."
                      rows={4}
                      className="w-full p-4 rounded-2xl bg-[#FAF8F4] border border-[#E8E2D5] text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-insight/30 focus:border-insight focus:bg-white transition-all resize-none text-sm leading-relaxed"
                    />
                  </>
                )}
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleAnswerDialogue(true)}
                    className="px-4 py-2.5 rounded-full text-xs text-charcoal-500 hover:text-charcoal-800 hover:bg-[#ECE6D8]/50 transition-colors"
                  >
                    暂无感觉，跳过此题
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentAnswer("并不是这样，画面纯粹是视觉联想。");
                    }}
                    className="hidden sm:inline-block px-3 py-2 text-xs text-charcoal-400 hover:text-charcoal-600"
                  >
                    “其实并没有这种联系”
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleAnswerDialogue(false)}
                  disabled={isLoadingQuestion}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-charcoal-900 text-[#F6F3EC] hover:bg-insight transition-all shadow-md text-sm font-medium disabled:opacity-50"
                >
                  <span>
                    {(session.currentDialogueIndex || 0) >= 2
                      ? "完成并查看回顾"
                      : "回答并进入下一问"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
