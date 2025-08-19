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

  // ## 1. 실시간 데이터 구독 전용 useEffect
  useEffect(() => {
    const q = query(collection(db, "rallies"), orderBy("arrivalTime"));
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
    // now 또는 rallies 상태가 변경될 때마다 실행
    rallies.forEach((rally) => {
      if (rally.arrivalTime.toDate().getTime() <= now.getTime()) {
        deleteRally(rally.id);
      }
    });
  }, [now, rallies]); // now 또는 rallies가 변경될 때마다 만료 여부 체크

  // --- Firestore 데이터 조작 함수들 ---

  const addRally = async () => {
    const arrivalTime = new Date(Date.now() + 5 * 60 * 1000);
    await addDoc(collection(db, "rallies"), {
      nickname: `적 랠리 ${rallies.length + 1}`,
      arrivalTime: Timestamp.fromDate(arrivalTime),
    });
  };

  const deleteRally = async (rallyId: string) => {
    await deleteDoc(doc(db, "rallies", rallyId));
  };

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
    // 입력값이 12자를 초과하면 업데이트하지 않음
    if (newNickname.length > 12) {
      setErrorMessage("별명은 12자 이상 입력할 수 없습니다.");
      setTimeout(() => setErrorMessage(""), 3000);
      // DB 업데이트 전 원래 값으로 되돌리기 위해 상태를 다시 불러옴
      const q = query(collection(db, "rallies"), orderBy("arrivalTime"));
      onSnapshot(q, (snapshot) => {
        const ralliesFromDB: Rally[] = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Rally)
        );
        setRallies(ralliesFromDB);
      });
      return;
    }
    setErrorMessage("");
    await updateDoc(doc(db, "rallies", rallyId), { nickname: newNickname });
  };

  // --- 클라이언트 상태 조작 함수 ---

  const toggleEditMode = (rallyId: string) => {
    setRallies(
      rallies.map((rally) =>
        rally.id === rallyId
          ? { ...rally, isEditing: !rally.isEditing }
          : { ...rally, isEditing: false }
      )
    );
  };

  // --- Helper Functions (시간 계산 및 포맷) ---

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

  // --- JSX (화면 렌더링) ---
  // (이 아래 return 부분은 이전과 동일하므로 생략합니다. 위의 로직 부분만 교체하시면 됩니다.)
  return (
    <div className="flex justify-center min-h-screen">
      <main className="w-full max-w-lg mx-auto flex flex-col p-4 pt-12">
        <header className="text-center mb-12">
          <h1 className="text-2xl font-bold tracking-tight">
            WOS 랠리 타임 체커
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            현재 UTC 시간 기준
          </p>
        </header>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-500/20 text-red-400 text-center rounded-lg">
            {errorMessage}
          </div>
        )}

        <section className="mb-10 text-center">
          <p className="text-7xl md:text-8xl font-mono font-extralight tracking-tighter">
            {formatTime(now)}
          </p>
        </section>

        <section className="flex-grow space-y-3">
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
                  onClick={() =>
                    adjustRallyTime(rally.id, rally.arrivalTime, -5 * 60 * 1000)
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
                    adjustRallyTime(rally.id, rally.arrivalTime, 5 * 60 * 1000)
                  }
                  className="h-10 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg"
                >
                  +5분
                </button>
              </div>
            </div>
          ))}
          {rallies.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center h-full pt-10">
              <p className="text-lg font-semibold">활성화된 랠리가 없습니다.</p>
              <p className="text-[var(--muted-foreground)] mt-2">
                아래 버튼을 눌러 새 랠리를 추가하세요.
              </p>
            </div>
          )}
        </section>

        <footer className="py-4 mt-auto">
          <button
            onClick={addRally}
            className="w-full h-16 flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold text-lg rounded-xl"
          >
            <PlusIcon className="w-6 h-6" />
            5분 랠리 추가
          </button>
        </footer>
      </main>
    </div>
  );
}
