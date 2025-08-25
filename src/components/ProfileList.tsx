// src/components/ProfileList.tsx
"use client";

import { XCircleIcon } from "@heroicons/react/24/solid";
import { Profile } from "@/hooks/useRallies";

interface ProfileListProps {
  profiles: Profile[];
  selectedProfileId: string | null;
  onProfileSelect: (profileId: string | null) => void;
  onProfileDelete: (profileId: string) => void;
}

export default function ProfileList({
  profiles,
  selectedProfileId,
  onProfileSelect,
  onProfileDelete,
}: ProfileListProps) {
  if (profiles.length === 0) {
    return (
      <div className="text-center text-sm text-gray-500 py-2">
        '적 프로필 추가' 버튼으로 프로필을 만드세요.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto pt-3 pb-2 no-scrollbar px-1">
      <div className="flex gap-3 whitespace-nowrap">
        {profiles.map((profile) => {
          const isSelected = profile.id === selectedProfileId;
          return (
            <div key={profile.id} className="relative group">
              <button
                onClick={() => onProfileSelect(isSelected ? null : profile.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold text-white transition-all duration-200 ${
                  isSelected
                    ? "bg-blue-600 ring-2 ring-offset-2 ring-offset-[var(--background)] ring-blue-500"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {profile.nickname} ({profile.marchSpeed}s)
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onProfileDelete(profile.id);
                }}
                className="absolute -top-1 -right-1 z-10 text-red-400 hover:text-red-300 transition-colors"
              >
                <XCircleIcon className="w-5 h-5 bg-[var(--background)] rounded-full" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
