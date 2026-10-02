export interface Guide {
  id: string;
  name: string;
  title: string;
  avatar: string;
  languages: string[];
  approach: string; // 带领方式
  suitableTopics: string[]; // 适合探索的主题
  demoFee: string; // 明确标注为“演示价格”
  bio: string;
  isDemo: true; // 强制标注为演示资料
}

export interface BookingSubmission {
  id: string;
  guideId: string;
  guideName: string;
  name: string;
  contactMethod: string;
  contactValue: string;
  selectedDate: string;
  selectedTimeSlot: string;
  explorationTopic: string;
  shareExplorationConsent: boolean;
  explorationId?: string;
  createdAt: string;
}
