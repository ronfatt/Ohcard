import { ImageCard, WordCard } from "./card";

export type SessionStep =
  | "draw_image"
  | "express_image"
  | "draw_word"
  | "dialogue"
  | "review";

export interface DialogueItem {
  id: string;
  question: string;
  answer: string;
  skipped?: boolean;
}

export interface ExplorationSession {
  id: string;
  createdAt: string;
  updatedAt: string;
  topic: string;
  imageCard: ImageCard | null;
  drawnCandidateIds?: string[]; // 抽卡时展示的5张候选ID，保持刷新后一致
  attractionExpression: string; // 画面里最先吸引你的地方
  selectedFeelings: string[];    // 选择的感受词汇
  customFeeling?: string;
  wordCard: WordCard | null;
  drawnWordCandidateIds?: string[];
  wordCombinationExpression: string; // 放入词语后的感受变化
  dialogueHistory: DialogueItem[];
  currentStep: SessionStep;
  currentDialogueIndex: number;
  isSaved?: boolean;
}

export interface ReflectionRecord {
  id: string;
  sessionId: string;
  createdAt: string;
  topic: string;
  imageCard: ImageCard;
  wordCard: WordCard;
  userExpressions: {
    attraction: string;
    feelings: string[];
    wordCombination: string;
    dialogues: { question: string; answer: string }[];
  };
  systemSynthesis: {
    disclaimer: string;
    structuredEcho: string;
    unresolvedQuestions: string[];
  };
  smallAction: string;
  userEditedSynthesis?: string;
  isSaved: boolean;
}
