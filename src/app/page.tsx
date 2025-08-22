// src/app/page.tsx
"use client";

import { useState } from "react";
import { Timestamp } from "firebase/firestore";
import Header from "@/components/Header";
import RallyCard from "@/components/RallyCard";
import Footer from "@/components/Footer";
import AddProfileModal from "@/components/AddProfileModal";
import MyMarchTimeModal from "@/components/MyMarchTimeModal";
import { useClock } from "@/hooks/useClock";
import { useRallies, Rally, Profile } from "@/hooks/useRallies";
import { useMyMarchTime } from "@/hooks/useMyMarchTime"; // 훅 import

export default function Home() {
  const { now, isMounted, formatTime } = useClock();
  const {
    rallies,
    profiles,
    errorMessage,
    selectedProfileId,
    setSelectedProfileId,
    addRally,
    addProfile,
    deleteProfile,
    deleteRally,
    adjustRallyTime,
    handleNicknameChange,
    toggleEditMode,
  } = useRallies();

  // --- 이 부분이 추가/수정되었습니다 ---
  const { myMarchTime, saveMyMarchTime } = useMyMarchTime();

  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isMarchTimeModalOpen, setMarchTimeModalOpen] = useState(false);

  return (
    <div className="fixed inset-0 bg-[var(--background)] flex flex-col">
      <Header isMounted={isMounted} now={now} formatTime={formatTime} />

      <AddProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onSave={addProfile}
      />
      <MyMarchTimeModal
        isOpen={isMarchTimeModalOpen}
        onClose={() => setMarchTimeModalOpen(false)}
        onSave={saveMyMarchTime}
        initialTime={myMarchTime}
      />

      <main className="flex-grow overflow-y-auto pt-32 pb-64 px-4">
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
              formatTime={formatTime}
              toggleEditMode={toggleEditMode}
              handleNicknameChange={handleNicknameChange}
              deleteRally={deleteRally}
              adjustRallyTime={adjustRallyTime}
              myMarchTime={myMarchTime}
            />
          ))}
          {rallies.length === 0 && (
            <div className="text-center pt-10">
              <p className="text-lg font-semibold text-white">
                활성화된 랠리가 없습니다.
              </p>
              <p className="text-[var(--muted-foreground)] mt-2">
                아래 버튼을 눌러 새 랠리를 추가하세요.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer
        profiles={profiles}
        selectedProfileId={selectedProfileId}
        onAddRally={addRally}
        onAddProfileClick={() => setProfileModalOpen(true)}
        onProfileSelect={setSelectedProfileId}
        onProfileDelete={deleteProfile}
        onMyMarchTimeClick={() => setMarchTimeModalOpen(true)}
      />
    </div>
  );
}
