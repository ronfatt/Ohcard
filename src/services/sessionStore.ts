import { ExplorationSession, ReflectionRecord, SessionStep } from "../types/session";

const CURRENT_SESSION_KEY_PREFIX = "insight_session_";
const SAVED_REFLECTIONS_KEY = "insight_saved_reflections";

export class SessionStore {
  private static isClient(): boolean {
    return typeof window !== "undefined";
  }

  /**
   * 创建新的探索会话
   */
  static createSession(topic: string = "随意探索"): ExplorationSession {
    const id = "sess_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 6);
    const now = new Date().toISOString();

    const session: ExplorationSession = {
      id,
      createdAt: now,
      updatedAt: now,
      topic: topic.trim() || "不设主题，随意探索",
      imageCard: null,
      attractionExpression: "",
      selectedFeelings: [],
      wordCard: null,
      wordCombinationExpression: "",
      dialogueHistory: [],
      currentStep: "draw_image",
      currentDialogueIndex: 0,
      isSaved: false,
    };

    this.saveSession(session);
    return session;
  }

  /**
   * 保存会话状态（支持断点续填与刷新防丢失）
   */
  static saveSession(session: ExplorationSession): void {
    if (!this.isClient()) return;
    try {
      session.updatedAt = new Date().toISOString();
      localStorage.setItem(
        `${CURRENT_SESSION_KEY_PREFIX}${session.id}`,
        JSON.stringify(session)
      );
    } catch (e) {
      console.error("Failed to save session to localStorage:", e);
    }
  }

  /**
   * 读取已有会话
   */
  static getSession(id: string): ExplorationSession | null {
    if (!this.isClient()) return null;
    try {
      const data = localStorage.getItem(`${CURRENT_SESSION_KEY_PREFIX}${id}`);
      if (!data) return null;
      return JSON.parse(data) as ExplorationSession;
    } catch (e) {
      console.error("Failed to parse session from localStorage:", e);
      return null;
    }
  }

  /**
   * 更新会话的局部字段
   */
  static updateSession(
    id: string,
    partial: Partial<ExplorationSession>
  ): ExplorationSession | null {
    const current = this.getSession(id);
    if (!current) return null;

    const updated: ExplorationSession = {
      ...current,
      ...partial,
      updatedAt: new Date().toISOString(),
    };

    this.saveSession(updated);
    return updated;
  }

  /**
   * 获取所有已保存的回顾记录
   */
  static getSavedReflections(): ReflectionRecord[] {
    if (!this.isClient()) return [];
    try {
      const data = localStorage.getItem(SAVED_REFLECTIONS_KEY);
      if (!data) return [];
      const list = JSON.parse(data) as ReflectionRecord[];
      // 按时间倒序
      return list.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (e) {
      console.error("Failed to read saved reflections:", e);
      return [];
    }
  }

  /**
   * 获取单条保存的回顾记录
   */
  static getSavedReflectionById(id: string): ReflectionRecord | null {
    const list = this.getSavedReflections();
    return list.find((item) => item.id === id || item.sessionId === id) || null;
  }

  /**
   * 保存回顾记录到日记本
   */
  static saveReflection(record: ReflectionRecord): void {
    if (!this.isClient()) return;
    try {
      const list = this.getSavedReflections();
      const existingIndex = list.findIndex((item) => item.id === record.id);

      if (existingIndex >= 0) {
        list[existingIndex] = { ...record, isSaved: true };
      } else {
        list.unshift({ ...record, isSaved: true });
      }

      localStorage.setItem(SAVED_REFLECTIONS_KEY, JSON.stringify(list));

      // 同步更新 session
      this.updateSession(record.sessionId, { isSaved: true });
    } catch (e) {
      console.error("Failed to save reflection to journal:", e);
    }
  }

  /**
   * 删除单条保存记录
   */
  static deleteSavedReflection(id: string): void {
    if (!this.isClient()) return;
    try {
      const list = this.getSavedReflections();
      const filtered = list.filter((item) => item.id !== id && item.sessionId !== id);
      localStorage.setItem(SAVED_REFLECTIONS_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error("Failed to delete reflection:", e);
    }
  }

  /**
   * 清空全部已保存记录
   */
  static clearAllSavedReflections(): void {
    if (!this.isClient()) return;
    try {
      localStorage.removeItem(SAVED_REFLECTIONS_KEY);
    } catch (e) {
      console.error("Failed to clear saved reflections:", e);
    }
  }
}
