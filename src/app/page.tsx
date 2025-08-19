// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilIcon,
  CheckIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { db } from "@/firebase/config";
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
  orderBy,
  query,
} from "firebase/firestore";

interface Rally {
  id: string;
  arrivalTime: Timestamp;
  nickname: string;
  isEditing?: boolean;
}

export default function Home() {
  const [now, setNow] = useState<Date>(new Date());
  const [rallies, setRallies] = useState<Rally[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

  // Hydration 에러 방지를 위해 클라이언트에서만 마운트 상태 설정
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ## 1. 실시간 데이터 구독 전용 useEffect
  useEffect(() => {
    const q = query(collection(db, "rallies"), orderBy("arrivalTime", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ralliesFromDB: Rally[] = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Rally)
      );
      setRallies(ralliesFromDB);
    });
    // 컴포넌트가 사라질 때 구독 해제
    return () => unsubscribe();
  }, []); // 최초 1회만 실행

  // ## 2. 1초 시계 전용 useEffect
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    // 컴포넌트가 사라질 때 타이머 정리
    return () => clearInterval(timer);
  }, []); // 최초 1회만 실행

  // ## 3. 자동 삭제 검사 전용 useEffect
  useEffect(() => {
    // now 또는 rallies 상태가 변경될 때마다 만료된 랠리가 있는지 확인
    rallies.forEach((rally) => {
      if (rally.arrivalTime.toDate().getTime() <= now.getTime()) {
        deleteRally(rally.id);
      }
    });
  }, [now, rallies]); // now 또는 rallies가 변경될 때마다 실행

  // --- Firestore 데이터 함수 ---
  const addRally = async () => {
    const arrivalTime = new Date(Date.now() + 5 * 60 * 1000);
    await addDoc(collection(db, "rallies"), {
      nickname: `새로운 랠리`,
      arrivalTime: Timestamp.fromDate(arrivalTime),
    });
  };

  const deleteRally = async (rallyId: string) =>
    await deleteDoc(doc(db, "rallies", rallyId));
  const adjustRallyTime = async (
    rallyId: string,
    currentArrivalTime: Timestamp,
    milliseconds: number
  ) => {
    const newDate = new Date(
      currentArrivalTime.toDate().getTime() + milliseconds
    );
    await updateDoc(doc(db, "rallies", rallyId), {
      arrivalTime: Timestamp.fromDate(newDate),
    });
  };
  const handleNicknameChange = async (rallyId: string, newNickname: string) => {
    if (newNickname.length > 12) {
      setErrorMessage("별명은 12자를 초과할 수 없습니다.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    await updateDoc(doc(db, "rallies", rallyId), { nickname: newNickname });
  };
  const toggleEditMode = (rallyId: string) => {
    setRallies(
      rallies.map((r) =>
        r.id === rallyId
          ? { ...r, isEditing: !r.isEditing }
          : { ...r, isEditing: false }
      )
    );
  };

  // --- Helper 함수 ---
  const formatTime = (date: Date) => date.toISOString().substr(11, 8);
  const calculateCounterTime = (arrivalTime: Timestamp) =>
    formatTime(new Date(arrivalTime.toDate().getTime() - 5 * 60 * 1000));
  const calculateRemainingTime = (arrivalTime: Timestamp) => {
    const difference = arrivalTime.toDate().getTime() - now.getTime();
    if (difference <= 0) return "도착 완료";
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
          {isMounted ? formatTime(now) : "00:00:00"}
        </p>
      </header>

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
                    <PencilIcon className="w-5 h-5" />
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
                  onClick={() =>
                    adjustRallyTime(rally.id, rally.arrivalTime, -300000)
                  }
                  className="h-10 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg"
                >
                  -5분
                </button>
                <button
                  onClick={() =>
                    adjustRallyTime(rally.id, rally.arrivalTime, -1000)
                  }
                  className="h-10 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg"
                >
                  -1초
                </button>
                <button
                  onClick={() =>
                    adjustRallyTime(rally.id, rally.arrivalTime, 1000)
                  }
                  className="h-10 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg"
                >
                  +1초
                </button>
                <button
                  onClick={() =>
                    adjustRallyTime(rally.id, rally.arrivalTime, 300000)
                  }
                  className="h-10 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg"
                >
                  +5분
                </button>
              </div>
            </div>
          ))}
          {rallies.length === 0 && (
            <div className="text-center pt-10">
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
