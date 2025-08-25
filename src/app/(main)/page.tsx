// src/app/(main)/page.tsx
"use client";

import { useState } from "react";
import RallyCard from "@/components/RallyCard";
import Footer from "@/components/Footer";
import AddProfileModal from "@/components/AddProfileModal";
import MyMarchTimeModal from "@/components/MyMarchTimeModal";
import { useClock } from "@/hooks/useClock";
import { useRallies } from "@/hooks/useRallies";
import { useMyMarchTime } from "@/hooks/useMyMarchTime";

export default function RallyCheckerPage() {
  // RallyCard에 props를 전달하기 위해 useClock은 여전히 필요합니다.
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

  const { myMarchTime, saveMyMarchTime } = useMyMarchTime();

  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isMarchTimeModalOpen, setMarchTimeModalOpen] = useState(false);

  return (
    <>
      {/* Header가 Layout으로 이동했으므로 여기서 제거합니다. */}
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

      <div className="px-4 pb-64">
        <div className="max-w-lg mx-auto">
          {errorMessage && (
            <div className="my-4 p-3 bg-red-500/20 text-red-400 text-center rounded-lg">
              {errorMessage}
            </div>
          )}
          <div className="space-y-3">
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
                isMounted={isMounted}
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
        </div>
      </div>

      <Footer
        profiles={profiles}
        selectedProfileId={selectedProfileId}
        onAddRally={addRally}
        onAddProfileClick={() => setProfileModalOpen(true)}
        onProfileSelect={setSelectedProfileId}
        onProfileDelete={deleteProfile}
        onMyMarchTimeClick={() => setMarchTimeModalOpen(true)}
      />
    </>
  );
}
