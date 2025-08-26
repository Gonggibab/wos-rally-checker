// src/components/Footer.tsx
"use client";

import { forwardRef, Fragment } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { Transition } from "@headlessui/react";
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
  isExpanded: boolean; // 부모로부터 상태를 받음
  onToggle: () => void; // 부모의 상태를 변경하는 함수를 받음
}

const Footer = forwardRef<HTMLElement, FooterProps>(function Footer(
  {
    profiles,
    selectedProfileId,
    onAddRally,
    onAddProfileClick,
    onProfileSelect,
    onProfileDelete,
    onMyMarchTimeClick,
    isExpanded,
    onToggle,
  },
  ref
) {
  const isProfileSelected = selectedProfileId !== null;

  const handleDisabledClick = () => {
    if (!isProfileSelected) {
      alert("적프로필을 선택한 뒤 추가할 수 있습니다.");
    }
  };

  return (
    // footer 태그가 이제 페이지 바닥에 고정(absolute)됩니다.
    <footer
      ref={ref}
      className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-[var(--background)]/80 backdrop-blur-sm"
    >
      <div className="max-w-lg mx-auto">
        <button
          onClick={onToggle}
          className="w-full flex justify-center items-center text-gray-500 hover:text-white mb-2"
        >
          {isExpanded ? (
            <ChevronDownIcon className="w-6 h-6" />
          ) : (
            <ChevronUpIcon className="w-6 h-6" />
          )}
        </button>

        <Transition
          as={Fragment}
          show={isExpanded}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 -translate-y-4"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 -translate-y-4"
        >
          <div className="space-y-2">
            <ProfileList
              profiles={profiles}
              selectedProfileId={selectedProfileId}
              onProfileSelect={onProfileSelect}
              onProfileDelete={onProfileDelete}
            />

            <div className="flex gap-2">
              <button
                onClick={
                  isProfileSelected ? () => onAddRally(5) : handleDisabledClick
                }
                className={`w-full h-10 flex items-center justify-center text-white font-semibold text-sm rounded-lg transition-colors duration-300 ${
                  isProfileSelected
                    ? "bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                5분 랠리
              </button>
              <button
                onClick={
                  isProfileSelected ? () => onAddRally(10) : handleDisabledClick
                }
                className={`w-full h-10 flex items-center justify-center text-white font-semibold text-sm rounded-lg transition-colors duration-300 ${
                  isProfileSelected
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                10분 랠리
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onAddProfileClick}
                className="w-7/10 h-10 flex items-center justify-center text-gray-200 font-semibold text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                적 프로필 추가
              </button>
              <button
                onClick={onMyMarchTimeClick}
                className="w-3/10 h-10 flex items-center justify-center text-gray-200 font-semibold text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                내 행군 시간
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </footer>
  );
});

export default Footer;
