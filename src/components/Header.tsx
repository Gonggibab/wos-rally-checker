// src/components/Header.tsx
"use client";

interface HeaderProps {
  isMounted: boolean;
  now: Date;
  formatTime: (date: Date) => string;
}

export default function Header({ isMounted, now, formatTime }: HeaderProps) {
  return (
    // TopBar(h-14) 바로 아래에 고정되도록 top-14와 z-index를 추가합니다.
    <header className="fixed top-14 left-0 right-0 z-10 bg-[var(--background)] py-6 text-center border-b border-[var(--card-border)]">
      <p className="text-xl text-[var(--muted-foreground)] mb-1">
        현재 UTC 시간
      </p>
      <p className="text-6xl md:text-7xl font-mono font-extralight tracking-tighter">
        {isMounted ? formatTime(now) : "00:00:00"}
      </p>
    </header>
  );
}
