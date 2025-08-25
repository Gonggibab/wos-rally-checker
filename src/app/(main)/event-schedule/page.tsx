// src/app/(main)/event-schedule/page.tsx
"use client";

import EventCalendar from "@/components/calendar/EventCalendar";

export default function EventSchedulePage() {
  const currentDate = new Date();
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 pt-6 pb-2 bg-[var(--background)] z-10 flex-shrink-0">
        <h1 className="text-3xl font-bold text-white text-center mb-4">
          이벤트 일정
        </h1>
      </div>

      <div className="flex-grow overflow-x-auto px-4">
        {/* 최소 가로 넓이를 840px로 늘림 */}
        <div className="min-w-[840px]">
          <div className="grid grid-cols-7 text-center font-semibold text-gray-400 border-b border-gray-700 pb-2">
            {weekDays.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>
          <EventCalendar currentDate={currentDate} />
        </div>
      </div>
    </div>
  );
}
