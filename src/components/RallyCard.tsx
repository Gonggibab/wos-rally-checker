// src/components/RallyCard.tsx
"use client";

import { PencilIcon, CheckIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Timestamp } from "firebase/firestore";

// 컴포넌트가 받을 props 타입을 정의합니다.
interface Rally {
  id: string;
  arrivalTime: Timestamp;
  nickname: string;
  isEditing?: boolean;
}

interface RallyCardProps {
  rally: Rally;
  now: Date;
  toggleEditMode: (id: string) => void;
  handleNicknameChange: (id: string, nickname: string) => void;
  deleteRally: (id: string) => void;
  adjustRallyTime: (id: string, arrivalTime: Timestamp, ms: number) => void;
  calculateCounterTime: (arrivalTime: Timestamp) => string;
  calculateRemainingTime: (arrivalTime: Timestamp, now: Date) => string;
}

export default function RallyCard({
  rally,
  now,
  toggleEditMode,
  handleNicknameChange,
  deleteRally,
  adjustRallyTime,
  calculateCounterTime,
  calculateRemainingTime,
}: RallyCardProps) {
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
            {calculateCounterTime(rally.arrivalTime)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[var(--muted-foreground)]">남은 시간</span>
          <span className="font-mono text-base text-yellow-400">
            {calculateRemainingTime(rally.arrivalTime, now)}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2 mt-4">
        <button
          onClick={() => adjustRallyTime(rally.id, rally.arrivalTime, -60000)}
          className="h-10 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg"
        >
          -1분
        </button>
        <button
          onClick={() => adjustRallyTime(rally.id, rally.arrivalTime, -1000)}
          className="h-10 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg"
        >
          -1초
        </button>
        <button
          onClick={() => adjustRallyTime(rally.id, rally.arrivalTime, 1000)}
          className="h-10 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg"
        >
          +1초
        </button>
        <button
          onClick={() => adjustRallyTime(rally.id, rally.arrivalTime, 60000)}
          className="h-10 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg"
        >
          +1분
        </button>
      </div>
    </div>
  );
}
