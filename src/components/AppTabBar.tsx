"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Layers, BookOpen, Users } from "lucide-react";

export const AppTabBar: React.FC = () => {
  const pathname = usePathname();

  // 在抽卡进行中隐藏底栏，给予沉浸式对话全屏空间
  if (pathname.startsWith("/session/")) {
    return null;
  }

  const tabs = [
    {
      label: "探索",
      href: "/",
      icon: Compass,
      isActive: pathname === "/" || pathname === "/explore",
    },
    {
      label: "画廊",
      href: "/cards",
      icon: Layers,
      isActive: pathname === "/cards",
      badge: "88+88",
    },
    {
      label: "日记",
      href: "/journal",
      icon: BookOpen,
      isActive: pathname === "/journal" || pathname.startsWith("/reflection/"),
    },
    {
      label: "陪伴",
      href: "/guides",
      icon: Users,
      isActive: pathname.startsWith("/guides") || pathname.startsWith("/booking"),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div className="w-full max-w-md pointer-events-auto mobile-tabbar pb-safe pt-2 px-6">
        <div className="flex items-center justify-around h-14">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Link
                key={tab.label}
                href={tab.href}
                className="flex-1 flex flex-col items-center justify-center relative py-1 group select-none active:scale-95 transition-transform"
              >
                <div className="relative">
                  <div
                    className={`w-9 h-7 rounded-full flex items-center justify-center transition-colors ${
                      tab.isActive
                        ? "bg-insight/15 text-insight"
                        : "text-charcoal-400 group-hover:text-charcoal-700"
                    }`}
                  >
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  {tab.badge && (
                    <span className="absolute -top-1 -right-3 px-1 py-0.2 text-[8px] font-sans font-medium bg-insight text-white rounded-full">
                      {tab.badge}
                    </span>
                  )}
                </div>

                <span
                  className={`text-[10px] font-sans mt-0.5 tracking-tight transition-colors ${
                    tab.isActive
                      ? "text-insight font-medium"
                      : "text-charcoal-400"
                  }`}
                >
                  {tab.label}
                </span>

                {tab.isActive && (
                  <span className="w-1 h-1 rounded-full bg-insight absolute bottom-0.5" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
