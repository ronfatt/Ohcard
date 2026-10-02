import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "映见 INSIGHT | 从一张图，开始听见自己",
  description: "借助原创图像卡、词语卡与开放式提问，帮助你表达感受、梳理内在想法的自我探索工具。",
  keywords: ["映见", "自我探索", "图像联想", "心理表达", "正念梳理", "视觉隐喻"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-[#F6F3EC] text-[#222222] min-h-screen flex flex-col antialiased selection:bg-insight/20 selection:text-insight selection:font-medium">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <footer className="w-full py-6 text-center text-xs text-charcoal-400 border-t border-[#E8E2D5] bg-[#F6F3EC]">
          <div className="max-w-4xl mx-auto px-4 space-y-1">
            <p>映见 INSIGHT · 自我探索与感受梳理工具</p>
            <p className="text-[11px] text-charcoal-400/80">
              探索记录保存在当前设备浏览器中，清除数据后可能丢失 · 不替代专业心理咨询
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
