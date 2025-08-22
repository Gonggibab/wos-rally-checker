// src/components/Footer.tsx
"use client";

import { PlusIcon } from "@heroicons/react/24/solid";
import { Profile } from "@/hooks/useRallies";
import ProfileList from "./ProfileList";

interface FooterProps {
  profiles: Profile[];
  selectedProfileId: string | null;
  onAddRally: (minutes: number) => void;
  onAddProfileClick: () => void;
  onProfileSelect: (profileId: string | null) => void;
  onProfileDelete: (profileId: string) => void;
  onMyMarchTimeClick: () => void;
}

export default function Footer({
  profiles,
  selectedProfileId,
  onAddRally,
  onAddProfileClick,
  onProfileSelect,
  onProfileDelete,
  onMyMarchTimeClick,
}: FooterProps) {
  const isProfileSelected = selectedProfileId !== null;

  const handleDisabledClick = () => {
    if (!isProfileSelected) {
      // 이 부분의 메시지를 수정했습니다.
      alert("적프로필을 선택한 뒤 추가할 수 있습니다.");
    }
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-10 p-4 bg-[var(--background)]/80 backdrop-blur-sm">
      <div className="max-w-lg mx-auto space-y-3">
        <ProfileList
          profiles={profiles}
          selectedProfileId={selectedProfileId}
          onProfileSelect={onProfileSelect}
          onProfileDelete={onProfileDelete}
        />

        <div className="flex gap-3">
          <button
            onClick={
              isProfileSelected ? () => onAddRally(5) : handleDisabledClick
            }
            className={`w-full flex items-center justify-center text-white font-semibold text-base rounded-xl transition-colors duration-300 ${
              isProfileSelected
                ? "bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
            style={{ height: "54px" }}
          >
            5분 랠리 추가
          </button>

          <button
            onClick={
              isProfileSelected ? () => onAddRally(10) : handleDisabledClick
            }
            className={`w-full flex items-center justify-center text-white font-semibold text-base rounded-xl transition-colors duration-300 ${
              isProfileSelected
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
            style={{ height: "54px" }}
          >
            10분 랠리 추가
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onAddProfileClick}
            className="w-7/10 flex items-center justify-center text-gray-200 font-semibold text-base bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
            style={{ height: "54px" }}
          >
            적 프로필 추가
          </button>
          <button
            onClick={onMyMarchTimeClick}
            className="w-3/10 flex items-center justify-center text-gray-200 font-semibold text-base bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
            style={{ height: "54px" }}
          >
            내 행군 시간
          </button>
        </div>
      </div>
    </footer>
  );
}
