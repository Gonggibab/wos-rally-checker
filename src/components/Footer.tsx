// src/components/Footer.tsx
"use client";

import { PlusIcon } from "@heroicons/react/24/solid";

interface FooterProps {
  onAddRally: (minutes: number) => void; // props 타입 변경
}

export default function Footer({ onAddRally }: FooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-[var(--background)] to-transparent">
      {/* 두 버튼을 나란히 놓기 위해 flex와 gap 사용 */}
      <div className="max-w-lg mx-auto flex gap-3">
        {/* 5분 랠리 추가 버튼 */}
        <button
          onClick={() => onAddRally(5)}
          className="w-full h-16 flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold text-lg rounded-xl"
        >
          <PlusIcon className="w-6 h-6" />
          5분 랠리
        </button>
        {/* 10분 랠리 추가 버튼 */}
        <button
          onClick={() => onAddRally(10)}
          className="w-full h-16 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-xl"
        >
          <PlusIcon className="w-6 h-6" />
          10분 랠리
        </button>
      </div>
    </footer>
  );
}
