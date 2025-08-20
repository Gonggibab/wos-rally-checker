// src/components/Header.tsx
"use client";

interface HeaderProps {
  isMounted: boolean;
  now: Date;
  formatTime: (date: Date) => string;
}

export default function Header({ isMounted, now, formatTime }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-[var(--background)]/80 backdrop-blur-sm pt-6 pb-4 text-center">
      <p className="text-xl text-[var(--muted-foreground)] mb-1">
        현재 UTC 시간
      </p>
      <p className="text-6xl md:text-7xl font-mono font-extralight tracking-tighter">
        {isMounted ? formatTime(now) : "00:00:00"}
      </p>
    </header>
  );
}
