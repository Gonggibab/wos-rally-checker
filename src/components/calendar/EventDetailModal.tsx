// src/components/calendar/EventDetailModal.tsx
"use client";

import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Fragment, useState, useEffect } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Event } from "@/data/event-data";

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
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    if (isOpen && event?.detailId) {
      import(`@/data/event-details/${event.detailId}.md`)
        .then((res) => setMarkdown(res.default))
        .catch((err) => {
          console.error("Failed to load markdown file:", err);
          setMarkdown("상세 정보를 불러오는 데 실패했습니다.");
        });
    } else if (!isOpen) {
      setMarkdown("");
    }
  }, [isOpen, event]);

  if (!event) return null;

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
                    {event.iconUrl && (
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                          src={event.iconUrl}
                          alt={event.name}
                          fill
                          // sizes 속성 추가
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
                        {event.name}
                      </Dialog.Title>
                      <p className="mt-1 text-sm text-gray-400">이벤트 팁</p>
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

                <div className="flex-grow overflow-y-auto px-6 py-4">
                  <div className="prose prose-invert prose-sm md:prose-base max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {markdown || "이벤트에 대한 설명이 아직 없습니다."}
                    </ReactMarkdown>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
