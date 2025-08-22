// src/components/AddProfileModal.tsx
"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useRef, useEffect } from "react";

interface AddProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (nickname: string, marchSpeed: number) => void;
}

export default function AddProfileModal({
  isOpen,
  onClose,
  onSave,
}: AddProfileModalProps) {
  const [nickname, setNickname] = useState("");
  // 1. 숫자 상태를 문자열로 관리
  const [marchSpeed, setMarchSpeed] = useState("30");

  const nicknameInputRef = useRef<HTMLInputElement>(null);

  // 2. 모달이 열릴 때 안정적으로 포커스 주기
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        nicknameInputRef.current?.focus();
      }, 100); // 애니메이션 시간을 고려한 약간의 지연
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!nickname.trim()) {
      alert("별명을 입력해주세요.");
      return;
    }
    // 3. 저장 시에만 문자열을 숫자로 변환 (비어있을 경우 기본값 30)
    onSave(nickname, Number(marchSpeed) || 30);
    onClose();
    setNickname("");
    setMarchSpeed("30");
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* ... 배경 오버레이 ... */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-[var(--card)] border border-[var(--card-border)] p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-bold leading-6 text-white"
                >
                  적 프로필 추가
                </Dialog.Title>
                <div className="mt-6 space-y-4">
                  <div>
                    <label
                      htmlFor="nickname"
                      className="block text-sm font-medium text-gray-400 mb-1"
                    >
                      적 랠리 별명
                    </label>
                    <input
                      ref={nicknameInputRef}
                      type="text"
                      id="nickname"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="w-full h-12 px-4 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      maxLength={12}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="marchSpeed"
                      className="block text-sm font-medium text-gray-400 mb-1"
                    >
                      행군 속도 (초)
                    </label>
                    <input
                      type="number"
                      id="marchSpeed"
                      value={marchSpeed}
                      onChange={(e) => setMarchSpeed(e.target.value)}
                      className="w-full h-12 px-4 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <button
                    type="button"
                    className="h-12 px-6 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600"
                    onClick={onClose}
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    className="h-12 px-6 rounded-lg bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary-hover)]"
                    onClick={handleSave}
                  >
                    저장
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
