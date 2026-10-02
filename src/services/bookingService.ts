import { Guide, BookingSubmission } from "../types/guide";

export const DEMO_GUIDES: Guide[] = [
  {
    id: "guide_chen",
    name: "陈禾",
    title: "图像联想引导者（演示资料）",
    avatar: "bg-[#E2D9CD] text-[#5C5247]",
    languages: ["中文普通话", "英语"],
    approach: "以倾听与非评判性提问为主，注重为探索者提供安全、专注的静默与表达空间。",
    suitableTopics: ["近期精力疲惫与节奏调整", "人际边界与未说出口的话", "职业转变期的情绪整理"],
    demoFee: "演示参考：¥180 / 45分钟",
    bio: "专注通过视觉联想与具身觉察陪伴探索者理清思路。本卡片为系统演示数据，非真实可执业认证。",
    isDemo: true,
  },
  {
    id: "guide_lin",
    name: "林见微",
    title: "叙事表达陪伴者（演示资料）",
    avatar: "bg-[#DCE6D9] text-[#475C45]",
    languages: ["中文普通话", "粤语"],
    approach: "善于捕捉表达中的隐喻，陪伴你用自己的语言将模糊的体会细细命名并看见。",
    suitableTopics: ["面临重大抉择的纠结期", "探索内在自我与多重角色", "亲密关系中的期待与距离"],
    demoFee: "演示参考：¥220 / 50分钟",
    bio: "重视每个人的独特性，坚信每个人自己才是生活最好的作者。本卡片为系统演示数据。",
    isDemo: true,
  },
  {
    id: "guide_mo",
    name: "莫南",
    title: "温和梳理伙伴（演示资料）",
    avatar: "bg-[#E0D7F9] text-[#553E96]",
    languages: ["中文普通话"],
    approach: "节奏舒缓，不急于寻找答案。通过启发性开放提问，协助你找到日常可落地的小行动。",
    suitableTopics: ["无特定困扰的例行自我复盘", "情绪内耗与内疚感释放", "寻找生活中的松弛感与趣味"],
    demoFee: "演示参考：¥160 / 45分钟",
    bio: "温和陪伴型的对话者，注重实际生活小切口的觉察。本卡片为系统演示数据。",
    isDemo: true,
  },
];

const BOOKINGS_STORAGE_KEY = "insight_demo_bookings";

export class BookingService {
  static getGuides(): Guide[] {
    return DEMO_GUIDES;
  }

  static getGuideById(id: string): Guide | undefined {
    return DEMO_GUIDES.find((g) => g.id === id);
  }

  /**
   * 提交演示预约（保存在本地演示列表，不发送网络请求或扣款）
   */
  static submitDemoBooking(data: Omit<BookingSubmission, "id" | "createdAt">): BookingSubmission {
    const submission: BookingSubmission = {
      ...data,
      id: "booking_" + Date.now().toString(36),
      createdAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      try {
        const existing = localStorage.getItem(BOOKINGS_STORAGE_KEY);
        const list: BookingSubmission[] = existing ? JSON.parse(existing) : [];
        list.unshift(submission);
        localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(list));
      } catch (e) {
        console.error("Failed to save demo booking:", e);
      }
    }

    return submission;
  }
}
