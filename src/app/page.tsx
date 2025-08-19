// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilIcon,
  CheckIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

interface Rally {
  id: number;
  arrivalTime: Date;
  nickname: string;
  isEditing: boolean;
}

export default function Home() {
  const [now, setNow] = useState<Date>(new Date());
  const [rallies, setRallies] = useState<Rally[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false); // 1. 마운트 상태 추가

  // 2. 클라이언트에서 마운트된 후에 isMounted를 true로 설정
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addRally = () => {
    const startTime = new Date();
    const arrivalTime = new Date(startTime.getTime() + 5 * 60 * 1000);
    const newRally: Rally = {
      id: Date.now(),
      arrivalTime: arrivalTime,
      nickname: `적 랠리 ${rallies.length + 1}`,
      isEditing: false,
    };
    setRallies((prevRallies) => [...prevRallies, newRally]);
  };

  const deleteRally = (rallyId: number) => {
    setRallies(rallies.filter((rally) => rally.id !== rallyId));
  };

  const toggleEditMode = (rallyId: number) => {
    setRallies(
      rallies.map((rally) =>
        rally.id === rallyId
          ? { ...rally, isEditing: !rally.isEditing }
          : { ...rally, isEditing: false }
      )
    );
  };

  const handleNicknameChange = (rallyId: number, newNickname: string) => {
    if (newNickname.length > 12) {
      setErrorMessage("별명은 12자 이상 입력할 수 없습니다.");
      setTimeout(() => setErrorMessage(""), 3000);
      const originalRally = rallies.find((r) => r.id === rallyId);
      if (originalRally) {
        setRallies(
          rallies.map((r) =>
            r.id === rallyId ? { ...r, nickname: originalRally.nickname } : r
          )
        );
      }
      return;
    }
    setErrorMessage("");
    setRallies(
      rallies.map((rally) =>
        rally.id === rallyId ? { ...rally, nickname: newNickname } : rally
      )
    );
  };

  const adjustRallyTime = (rallyId: number, milliseconds: number) => {
    setRallies(
      rallies.map((rally) => {
        if (rally.id === rallyId) {
          const newArrivalTime = new Date(
            rally.arrivalTime.getTime() + milliseconds
          );
          return { ...rally, arrivalTime: newArrivalTime };
        }
        return rally;
      })
    );
  };

  const formatTime = (date: Date) => date.toISOString().substr(11, 8);
  const calculateCounterTime = (arrivalTime: Date) =>
    formatTime(new Date(arrivalTime.getTime() - 5 * 60 * 1000));
  const calculateRemainingTime = (arrivalTime: Date) => {
    const difference = arrivalTime.getTime() - now.getTime();
    if (difference <= 0) {
      setTimeout(() => {
        setRallies((prevRallies) =>
          prevRallies.filter(
            (r) => r.arrivalTime.getTime() > new Date().getTime()
          )
        );
      }, 100);
      return "도착 완료";
    }
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )} 남음`;
  };

  return (
    <div className="h-screen bg-[var(--background)] flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-10 bg-[var(--background)]/80 backdrop-blur-sm pt-6 pb-4 text-center">
        <p className="text-xl text-[var(--muted-foreground)] mb-1">
          현재 UTC 시간
        </p>
        <p className="text-6xl md:text-7xl font-mono font-extralight tracking-tighter">
          {/* 3. isMounted가 true일 때만 시간을 렌더링 */}
          {isMounted ? formatTime(now) : "00:00:00"}
        </p>
      </header>

      {/* The rest of the code remains the same */}
      <main className="flex-grow overflow-y-auto pt-32 pb-28 px-4">
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-500/20 text-red-400 text-center rounded-lg">
            {errorMessage}
          </div>
        )}
        <div className="max-w-lg mx-auto space-y-3">
          {rallies.map((rally) => (
            <div
              key={rally.id}
              className="fade-in bg-[var(--card)] border border-[var(--card-border)] rounded-lg p-5"
            >
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
                  <span className="text-[var(--muted-foreground)]">
                    랠리 켜진 시간
                  </span>
                  <span className="font-mono text-base text-sky-400">
                    {calculateCounterTime(rally.arrivalTime)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--muted-foreground)]">
                    남은 시간
                  </span>
                  <span className="font-mono text-base text-yellow-400">
                    {calculateRemainingTime(rally.arrivalTime)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mt-4">
                <button
                  onClick={() => adjustRallyTime(rally.id, -300000)}
                  className="h-10 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg"
                >
                  -5분
                </button>
                <button
                  onClick={() => adjustRallyTime(rally.id, -1000)}
                  className="h-10 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg"
                >
                  -1초
                </button>
                <button
                  onClick={() => adjustRallyTime(rally.id, 1000)}
                  className="h-10 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg"
                >
                  +1초
                </button>
                <button
                  onClick={() => adjustRallyTime(rally.id, 300000)}
                  className="h-10 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg"
                >
                  +5분
                </button>
              </div>
            </div>
          ))}
          {rallies.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center pt-10">
              <p className="text-lg font-semibold">활성화된 랠리가 없습니다.</p>
              <p className="text-[var(--muted-foreground)] mt-2">
                아래 버튼을 눌러 새 랠리를 추가하세요.
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-[var(--background)] to-transparent">
        <div className="max-w-lg mx-auto">
          <button
            onClick={addRally}
            className="w-full h-16 flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold text-lg rounded-xl"
          >
            <PlusIcon className="w-6 h-6" />
            5분 랠리 추가
          </button>
        </div>
      </footer>
    </div>
  );
}
