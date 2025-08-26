// src/app/(main)/layout.tsx
"use client";

import { useState } from "react";
import TopBar from "@/components/layout/TopBar";
import SideBar from "@/components/layout/SideBar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-full flex flex-col">
      <TopBar onMenuClick={() => setSidebarOpen(true)} />
      <SideBar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 페이지 컨텐츠가 TopBar 아래에서 시작하고, 높이를 꽉 채우도록 설정 */}
      <div className="flex-1 pt-14 overflow-hidden">{children}</div>
    </div>
  );
}
