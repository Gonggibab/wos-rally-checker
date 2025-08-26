// src/components/calendar/EventDetailModal.tsx
"use client";

import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, PencilIcon } from "@heroicons/react/24/solid";
import { Fragment, useState, useEffect } from "react";
import Image from "next/image";
import { Event } from "@/data/event-data";
import { useEventDetails } from "@/hooks/useEventDetails";

// 두 라이브러리를 모두 import 합니다.
import MDEditor from "@uiw/react-md-editor";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// MDEditor의 CSS는 편집 모드에서만 필요합니다.
import "@uiw/react-md-editor/markdown-editor.css";

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

export default function EventDetailModal({
  isOpen,
  onClose,
  event,
}: EventDetailModalProps) {
  const { markdown, loading, updateDetails } = useEventDetails(event?.detailId);
  const [isEditing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState<string | undefined>("");

  useEffect(() => {
    if (isOpen) {
      setEditedContent(markdown);
    } else {
      // 모달이 닫힐 때 편집 모드와 내용을 초기화합니다.
      setEditing(false);
      setEditedContent("");
    }
  }, [isOpen, markdown]);

  const handleEditClick = () => {
    const password = prompt("수정을 위해 비밀번호를 입력하세요:");
    if (password === "2592") {
      setEditing(true);
    } else if (password !== null) {
      alert("비밀번호가 틀렸습니다.");
    }
  };

  const handleSave = async () => {
    const success = await updateDetails(editedContent || "");
    if (success) {
      alert("성공적으로 저장되었습니다.");
      setEditing(false);
    } else {
      alert("저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleCancel = () => {
    setEditedContent(markdown);
    setEditing(false);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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

        <div className="fixed inset-0">
          <div className="flex min-h-full items-end justify-center text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-full"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-full"
            >
              <Dialog.Panel className="w-full max-w-2xl h-[90vh] flex flex-col transform overflow-hidden rounded-t-2xl bg-[var(--card)] border-t border-[var(--card-border)] text-left align-middle shadow-xl transition-all">
                <div className="flex-shrink-0 p-6 flex items-start justify-between border-b border-[var(--card-border)]">
                  <div className="flex items-center gap-4">
                    {event?.iconUrl && (
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                          src={event.iconUrl}
                          alt={event.name}
                          fill
                          sizes="48px"
                          className={`rounded-lg ${
                            event.iconFit === "contain"
                              ? "object-contain"
                              : "object-cover"
                          }`}
                        />
                      </div>
                    )}
                    <div>
                      <Dialog.Title
                        as="h3"
                        className="text-xl font-bold leading-6 text-white"
                      >
                        {event?.name}
                      </Dialog.Title>
                      <p className="mt-1 text-sm text-gray-400">
                        이벤트 상세 정보
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="p-2 -mr-2 text-gray-400 hover:text-white"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div
                  className="flex-grow overflow-y-auto px-6 py-4"
                  data-color-mode="dark"
                >
                  {isEditing ? (
                    // 수정 모드: MDEditor 사용
                    <MDEditor
                      value={editedContent}
                      onChange={setEditedContent}
                      preview="live"
                      height="100%"
                    />
                  ) : (
                    // 보기 모드: ReactMarkdown과 우리 CSS 사용
                    <div className="prose prose-invert prose-sm md:prose-base max-w-none">
                      {loading ? (
                        <p>로딩 중...</p>
                      ) : (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {markdown}
                        </ReactMarkdown>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex-shrink-0 p-4 border-t border-[var(--card-border)] flex justify-end gap-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleCancel}
                        className="h-10 px-4 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600"
                      >
                        취소
                      </button>
                      <button
                        onClick={handleSave}
                        className="h-10 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-500"
                      >
                        저장
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleEditClick}
                      className="h-10 px-4 flex items-center gap-2 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600"
                    >
                      <PencilIcon className="w-4 h-4" />
                      수정
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
