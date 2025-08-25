// src/app/(main)/event-schedule/page.tsx
"use client";

import EventCalendar from "@/components/calendar/EventCalendar";

export default function EventSchedulePage() {
  const currentDate = new Date();
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    // 전체 페이지를 Flexbox 컨테이너로 만들어 헤더와 본문을 분리합니다.
    <div className="h-full flex flex-col">
      {/* 고정될 상단 헤더 영역 */}
      <div className="px-4 pt-6 pb-2 bg-[var(--background)] z-10">
        <h1 className="text-3xl font-bold text-white text-center mb-4">
          이벤트 일정
        </h1>
        <div className="grid grid-cols-7 text-center font-semibold text-gray-400 border-b border-gray-700 pb-2">
          {weekDays.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
      </div>

      {/* 스크롤될 달력 본문 영역 */}
      <div className="flex-grow overflow-y-auto px-4">
        <EventCalendar currentDate={currentDate} />
      </div>
    </div>
  );
}
