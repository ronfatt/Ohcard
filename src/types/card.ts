export interface ImageCard {
  id: string;
  imageUrl?: string; // 可选的未来扩展真实图片路径
  alt: string;       // 客观画面描述（不作心理学解释）
  artBrief: string;  // 画面构图/意境简述（内部参考，不对用户作判定）
  svgName: string;   // 本地渲染的SVG构图标识
}

export interface WordCard {
  id: string;
  word: string;
  pinyin?: string;
}
