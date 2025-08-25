// src/components/RallyCard.tsx
"use client";

import { PencilIcon, CheckIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Timestamp } from "firebase/firestore";
import { Rally } from "@/hooks/useRallies";
import { useMemo } from "react";

interface RallyCardProps {
  rally: Rally;
  now: Date;
  formatTime: (date: Date) => string;
  toggleEditMode: (id: string) => void;
  handleNicknameChange: (id: string, nickname: string) => void;
  deleteRally: (id: string) => void;
  adjustRallyTime: (id: string, rally: Rally, ms: number) => void;
  myMarchTime: number;
  isMounted: boolean;
}

export default function RallyCard({
  rally,
  now,
  formatTime,
  toggleEditMode,
  handleNicknameChange,
  deleteRally,
  adjustRallyTime,
  myMarchTime,
  isMounted,
}: RallyCardProps) {
  const remainingSeconds = useMemo(() => {
    const difference = rally.arrivalTime.toDate().getTime() - now.getTime();
    return Math.max(0, difference / 1000);
  }, [rally.arrivalTime, now]);

  const fuelingStartSeconds = useMemo(() => {
    return Math.max(0, remainingSeconds - myMarchTime);
  }, [remainingSeconds, myMarchTime]);

  const formatDisplayTime = (totalSeconds: number) => {
    if (totalSeconds <= 0) return "출발!";
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )} 남음`;
  };

  const remainingTimeDisplay = useMemo(() => {
    if (remainingSeconds <= 0) return "도착 완료";
    return formatDisplayTime(remainingSeconds);
  }, [remainingSeconds]);

  return (
    <div className="fade-in bg-[var(--card)] border border-[var(--card-border)] rounded-lg p-5">
      <div className="flex justify-between items-center gap-3">
        <div className="flex-1 min-w-0">
          {rally.isEditing ? (
            <input
              type="text"
              defaultValue={rally.nickname}
              maxLength={12}
              className="w-full bg-gray-700 text-white text-base font-medium rounded px-2 py-1"
              onBlur={(e) => {
                handleNicknameChange(rally.id, e.target.value);
                toggleEditMode(rally.id);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleNicknameChange(rally.id, e.currentTarget.value);
                  toggleEditMode(rally.id);
                }
              }}
              autoFocus
            />
          ) : (
            <span className="text-base font-medium truncate">
              {rally.nickname}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleEditMode(rally.id)}
            className="p-1 text-gray-400 hover:text-white"
          >
            {rally.isEditing ? (
              <CheckIcon className="w-5 h-5" />
            ) : (
              <PencilIcon className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => deleteRally(rally.id)}
            className="p-1 text-red-500 hover:text-red-400"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <hr className="border-t border-white/10 my-4" />
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-[var(--muted-foreground)]">랠리 켜진 시간</span>
          <span className="font-mono text-base text-sky-400">
            {formatTime(rally.startTime.toDate())}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[var(--muted-foreground)]">남은 시간</span>
          <span className="font-mono text-base text-yellow-400">
            {isMounted ? remainingTimeDisplay : "계산 중..."}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-orange-400">주유 출발 시간</span>
          <span className={`font-mono text-base font-bold text-orange-400`}>
            {isMounted ? formatDisplayTime(fuelingStartSeconds) : "계산 중..."}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2 mt-4">
        <button
          onClick={() => adjustRallyTime(rally.id, rally, -60000)}
          className="h-10 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg"
        >
          -1분
        </button>
        <button
          onClick={() => adjustRallyTime(rally.id, rally, -1000)}
          className="h-10 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg"
        >
          -1초
        </button>
        <button
          onClick={() => adjustRallyTime(rally.id, rally, 1000)}
          className="h-10 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg"
        >
          +1초
        </button>
        <button
          onClick={() => adjustRallyTime(rally.id, rally, 60000)}
          className="h-10 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg"
        >
          +1분
        </button>
      </div>
    </div>
  );
}
