// src/app/page.tsx
"use client";

import { Timestamp } from "firebase/firestore";
import Header from "@/components/Header";
import RallyCard from "@/components/RallyCard";
import Footer from "@/components/Footer";
import { useClock } from "@/hooks/useClock";
import { useRallies } from "@/hooks/useRallies";

const calculateRemainingTime = (arrivalTime: Timestamp, now: Date) => {
  const difference = arrivalTime.toDate().getTime() - now.getTime();
  if (difference <= 0) return "도착 완료";
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const seconds = Math.floor((difference / 1000) % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )} 남음`;
};

export default function Home() {
  const { now, isMounted, formatTime } = useClock();
  const {
    rallies,
    errorMessage,
    addRally,
    deleteRally,
    adjustRallyTime,
    handleNicknameChange,
    toggleEditMode,
  } = useRallies();

  return (
    <div className="h-screen bg-[var(--background)] flex flex-col">
      <Header isMounted={isMounted} now={now} formatTime={formatTime} />

      <main className="flex-grow overflow-y-auto pt-32 pb-28 px-4">
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-500/20 text-red-400 text-center rounded-lg">
            {errorMessage}
          </div>
        )}
        <div className="max-w-lg mx-auto space-y-3">
          {rallies.map((rally) => (
            <RallyCard
              key={rally.id}
              rally={rally}
              now={now}
              formatTime={formatTime} // formatTime 함수를 RallyCard로 전달
              toggleEditMode={toggleEditMode}
              handleNicknameChange={handleNicknameChange}
              deleteRally={deleteRally}
              adjustRallyTime={adjustRallyTime}
              calculateRemainingTime={calculateRemainingTime}
            />
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

      <Footer onAddRally={addRally} />
    </div>
  );
}
