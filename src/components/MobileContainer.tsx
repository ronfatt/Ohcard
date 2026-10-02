"use client";

import React from "react";
import { AppHeader } from "./AppHeader";
import { AppTabBar } from "./AppTabBar";

interface MobileContainerProps {
  children: React.ReactNode;
}

export const MobileContainer: React.FC<MobileContainerProps> = ({ children }) => {
  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[#E8E2D2] sm:py-6 sm:px-4">
      {/* 手机 App 原生视窗外框 */}
      <div className="w-full max-w-md min-h-[100dvh] sm:min-h-[844px] sm:max-h-[920px] bg-[#F6F3EC] sm:rounded-[40px] sm:shadow-[0_30px_70px_-12px_rgba(30,26,20,0.25)] sm:border-[8px] sm:border-[#38332D] flex flex-col relative overflow-hidden">
        {/* 顶部手机镜头/灵动岛微装饰（仅在桌面模拟框显示） */}
        <div className="hidden sm:flex justify-center pt-2 pb-1 bg-[#38332D]">
          <div className="w-20 h-4 rounded-full bg-[#201D19] flex items-center justify-end pr-2.5">
            <div className="w-2 h-2 rounded-full bg-[#12100E] border border-[#38332D]" />
          </div>
        </div>

        {/* 移动端原生 App 头部 */}
        <AppHeader />

        {/* 页面主视图内容（支持平滑滚动与安全留白） */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar flex flex-col relative pb-20">
          {children}
        </main>

        {/* 移动端原生 App 底部 TabBar */}
        <AppTabBar />
      </div>
    </div>
  );
};
