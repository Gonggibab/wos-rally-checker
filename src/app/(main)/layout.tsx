// src/app/(main)/layout.tsx
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import SideBar from "@/components/layout/SideBar";
import Header from "@/components/Header";
import { useClock } from "@/hooks/useClock";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { now, isMounted, formatTime } = useClock();

  const isMainPage = pathname === "/";

  return (
    <div className="h-full flex flex-col">
      <TopBar onMenuClick={() => setSidebarOpen(true)} />
      <SideBar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 메인 페이지일 때만 Header를 렌더링합니다. */}
      {isMainPage && (
        <Header isMounted={isMounted} now={now} formatTime={formatTime} />
      )}

      {/* Header 유무에 따라 main 영역의 시작 위치를 동적으로 조절합니다. */}
      <main
        className={`flex-grow overflow-y-auto ${
          isMainPage ? "pt-44" : "pt-14"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
