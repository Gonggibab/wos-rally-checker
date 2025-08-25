// src/components/layout/TopBar.tsx
"use client";

import { Bars3Icon } from "@heroicons/react/24/solid";

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 h-14 bg-[var(--background)]/80 backdrop-blur-sm border-b border-[var(--card-border)]">
      <div className="max-w-lg mx-auto h-full flex items-center justify-between px-4">
        <h1 className="text-lg font-bold text-white">WOS TOOL</h1>
        <button
          onClick={onMenuClick}
          className="p-2 text-gray-400 hover:text-white"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
