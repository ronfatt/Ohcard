import { ExplorationSession, ReflectionRecord } from "../types/session";

export interface ReflectionSynthesis {
  disclaimer: string;
  structuredEcho: string;
  unresolvedQuestions: string[];
  smallActionSuggestions: string[];
}

export interface ReflectionProvider {
  /**
   * 生成第 N 个追问（0, 1, 2）
   */
  generateFollowUpQuestion(
    session: ExplorationSession,
    questionIndex: number
  ): Promise<string>;

  /**
   * 生成探索回顾与结构化整理
   */
  generateReflection(session: ExplorationSession): Promise<ReflectionSynthesis>;
}

/**
 * 演示引导提供者（MockReflectionProvider）
 * 严格遵守不诊断、不判定、不假借权威、仅回响用户原话与开放式提问的原则
 */
export class MockReflectionProvider implements ReflectionProvider {
  async generateFollowUpQuestion(
    session: ExplorationSession,
    questionIndex: number
  ): Promise<string> {
    // 提取用户前序表达的关键元素
    const word = session.wordCard?.word || "";
    const feelings = session.selectedFeelings || [];
    const attraction = session.attractionExpression.trim();
    const wordImpact = session.wordCombinationExpression.trim();

    // 提问 1：关于画面吸引点或词语关系的深化提问
    if (questionIndex === 0) {
      if (word && wordImpact && wordImpact.length > 2) {
        // 尝试抓取一句关键词或整句引用
        return `你刚才在看到「${word}」时提到“${wordImpact.slice(0, 18)}${wordImpact.length > 18 ? "..." : ""}”，如果在这个感觉里多停留一会儿，它给你带来的第一印象是什么？`;
      }
      if (feelings.length > 0 && feelings[0] !== "暂时没感觉") {
        return `你刚才留意到了「${feelings.join("、")}」的感觉。在平时的日常里，这个感受通常会在什么时候出现？`;
      }
      if (attraction) {
        return `你刚才被画面中的“${attraction.slice(0, 16)}${attraction.length > 16 ? "..." : ""}”所吸引，这对当下的你来说意味着什么？`;
      }
      return "看着眼前的图与词，如果用一个简单的比喻来描述这种感觉，你会想到什么？";
    }

    // 提问 2：与生活的可能联系（明确强调“也可能没有”，允许否认）
    if (questionIndex === 1) {
      const prevAnswer = session.dialogueHistory[0]?.answer;
      if (prevAnswer && prevAnswer.trim().length > 3) {
        return `你提到了“${prevAnswer.slice(0, 15)}...”，这与你最近的生活或某段关系有联系吗？（也可能并没有，纯粹是画面的联想）`;
      }
      return "画面中呈现的这种状态或氛围，和你最近经历的哪件事情有些相似吗？也可能只是当下的偶然感受。";
    }

    // 提问 3：关于视角转换或主观愿望的开放探索
    if (questionIndex === 2) {
      return "如果可以自由改变这幅画面中的一个地方，或是给画面里的人/物添加一个动作，你最想改变什么？";
    }

    return "关于这张卡片，还有什么想对自己轻声说的话吗？";
  }

  async generateReflection(session: ExplorationSession): Promise<ReflectionSynthesis> {
    const attraction = session.attractionExpression || "画面整体的氛围";
    const feelings =
      session.selectedFeelings.length > 0
        ? session.selectedFeelings.join("、")
        : "未特别定义";
    const word = session.wordCard?.word || "当前词语";
    const wordImpact = session.wordCombinationExpression || "自然呈现的观感";

    // 摘录有效回答
    const validDialogues = session.dialogueHistory.filter(
      (d) => !d.skipped && d.answer && d.answer.trim().length > 0
    );

    let structuredEcho = `从你刚才的表达中，最先触动你的是「${attraction}」，并由此觉察到了「${feelings}」的心境。\n\n当抽到词语卡「${word}」时，你梳理出：“${wordImpact}”。`;

    if (validDialogues.length > 0) {
      structuredEcho += `\n\n在随后的追问中，你提到：“${validDialogues[0].answer}”`;
      if (validDialogues.length > 1) {
        structuredEcho += `，以及“${validDialogues[1].answer}”。`;
      } else {
        structuredEcho += `。`;
      }
    }

    structuredEcho += `\n\n你可以看看，这样的整理是否贴近你当下的意思。如果不完全一致，可以随时在下方调整文字。`;

    const unresolvedQuestions = [
      `关于「${word}」，我是否还想给自己更多一点耐心或空间？`,
      "如果当下的感受有声音，它最想对自己说什么？",
      "在未来的几天里，我希望保留画面的哪一种温度？",
    ];

    const smallActionSuggestions = [
      "找一个安静的 5 分钟，把手机放下，深呼吸三次",
      "把今天抽到的词写在便签纸上，贴在看得见的地方",
      "给身边信任的人发一条轻松的问候，不聊复杂的事",
      "今天提前 20 分钟关灯休息，允许自己什么都不想",
      "出门散步 10 分钟，只观察路上看到的一棵树或一朵云",
    ];

    return {
      disclaimer: "本整理根据你的原话结构化梳理，不作任何心理诊断或定性评判。",
      structuredEcho,
      unresolvedQuestions,
      smallActionSuggestions,
    };
  }
}

// 统一的全局服务实例（未来可通过配置或环境变量无缝切换为真实 AI Provider）
export const activeReflectionProvider: ReflectionProvider = new MockReflectionProvider();
