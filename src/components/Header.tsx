// src/components/Header.tsx
"use client";

interface HeaderProps {
  isMounted: boolean;
  now: Date;
  formatTime: (date: Date) => string;
}

export default function Header({ isMounted, now, formatTime }: HeaderProps) {
  // sticky 속성을 제거하고, flex-shrink-0을 추가하여 크기가 줄어들지 않도록 합니다.
  return (
    <header className="flex-shrink-0 bg-[var(--background)] py-4 text-center border-b border-[var(--card-border)] z-10">
      <p className="text-base text-[var(--muted-foreground)]">현재 UTC 시간</p>
      <p className="text-4xl font-mono font-light tracking-tighter">
        {isMounted ? formatTime(now) : "00:00:00"}
      </p>
    </header>
  );
}
