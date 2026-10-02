import type { Metadata, Viewport } from "next";
import "./globals.css";
import { MobileContainer } from "@/components/MobileContainer";

export const metadata: Metadata = {
  title: "映见 INSIGHT · 图像联想自我探索",
  description: "借助原创水彩图像卡、词语卡与开放式提问，帮助你表达感受、梳理内在想法的自我探索 Web App。",
  keywords: ["映见", "自我探索", "图像联想", "心理表达", "正念梳理", "视觉隐喻", "Web App"],
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "映见 INSIGHT",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#F6F3EC",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased selection:bg-insight/20 selection:text-insight">
        <MobileContainer>
          {children}
        </MobileContainer>
      </body>
    </html>
  );
}
