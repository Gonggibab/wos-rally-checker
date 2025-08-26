// src/app/(main)/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import RallyCard from "@/components/RallyCard";
import Footer from "@/components/Footer";
import AddProfileModal from "@/components/AddProfileModal";
import MyMarchTimeModal from "@/components/MyMarchTimeModal";
import { useClock } from "@/hooks/useClock";
import { useRallies } from "@/hooks/useRallies";
import { useMyMarchTime } from "@/hooks/useMyMarchTime";

export default function RallyCheckerPage() {
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

  const [isFooterExpanded, setFooterExpanded] = useState(true);
  const [footerHeight, setFooterHeight] = useState(0);
  const footerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (footerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        // `let`을 `const`로 수정합니다.
        for (const entry of entries) {
          setFooterHeight(entry.contentRect.height);
        }
      });
      resizeObserver.observe(footerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  return (
    <div className="h-full flex flex-col relative">
      <Header isMounted={isMounted} now={now} formatTime={formatTime} />

      <div
        className="flex-grow overflow-y-auto"
        style={{ paddingBottom: `${footerHeight}px` }}
      >
        <div className="px-4 py-4">
          <div className="max-w-lg mx-auto">
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-500/20 text-red-400 text-center rounded-lg">
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
      </div>

      <Footer
        ref={footerRef}
        isExpanded={isFooterExpanded}
        onToggle={() => setFooterExpanded((prev) => !prev)}
        profiles={profiles}
        selectedProfileId={selectedProfileId}
        onAddRally={addRally}
        onAddProfileClick={() => setProfileModalOpen(true)}
        onProfileSelect={setSelectedProfileId}
        onProfileDelete={deleteProfile}
        onMyMarchTimeClick={() => setMarchTimeModalOpen(true)}
      />

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
    </div>
  );
}
