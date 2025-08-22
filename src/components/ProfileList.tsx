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
    return null;
  }

  return (
    // 1. 컨테이너에 상단 여백(pt-4)을 추가해 삭제 버튼이 잘리지 않도록 함
    <div className="w-full overflow-x-auto pt-4 pb-2 no-scrollbar px-2">
      <div className="flex gap-4 whitespace-nowrap">
        {profiles.map((profile) => {
          const isSelected = profile.id === selectedProfileId;
          return (
            <div key={profile.id} className="relative group">
              {/* 2. 버튼 크기를 키우고(px-6 py-3, text-base) 디자인 개선 */}
              <button
                onClick={() => onProfileSelect(isSelected ? null : profile.id)}
                className={`px-6 py-3 rounded-full text-base font-semibold text-white transition-all duration-200 ${
                  isSelected
                    ? "bg-blue-600 ring-2 ring-offset-2 ring-offset-[var(--background)] ring-blue-500"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {profile.nickname} ({profile.marchSpeed}s)
              </button>
              {/* 3. 삭제 버튼 색상 변경 및 항상 보이도록 수정 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onProfileDelete(profile.id);
                }}
                className="absolute -top-1.5 -right-1.5 z-10 text-red-400 hover:text-red-300 transition-colors"
              >
                <XCircleIcon className="w-6 h-6 bg-[var(--background)] rounded-full" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 스크롤바 숨기기 CSS
const styles = `
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
if (typeof window === "object") {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
