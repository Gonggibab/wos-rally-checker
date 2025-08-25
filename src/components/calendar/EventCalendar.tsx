// src/components/calendar/EventCalendar.tsx
"use client";

import { useMemo } from "react";
import Image from "next/image";
import { processEventsForWeek } from "./calendar-helpers";

interface EventCalendarProps {
  currentDate: Date;
}

export default function EventCalendar({ currentDate }: EventCalendarProps) {
  const weeksInMonth = useMemo(() => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - ((today.getDay() + 6) % 7));

    const weeks = [];
    const currentDatePointer = new Date(startDate); // let -> const

    for (let i = 0; i < 4; i++) {
      const currentWeek = [];
      for (let j = 0; j < 7; j++) {
        currentWeek.push(new Date(currentDatePointer));
        currentDatePointer.setDate(currentDatePointer.getDate() + 1);
      }
      weeks.push(currentWeek);
    }
    return weeks;
  }, []); // 불필요한 currentDate 의존성 제거

  return (
    <div className="border-l border-r border-b border-gray-700">
      {weeksInMonth.map((week, weekIndex) => {
        const processedEvents = processEventsForWeek(week);
        const maxLane = Math.max(-1, ...processedEvents.map((e) => e.lane));
        const requiredHeight = 40 + (maxLane + 1) * 28;

        return (
          <div
            key={weekIndex}
            className="relative grid grid-cols-7 border-t border-gray-700 my-2"
            style={{ minHeight: `${requiredHeight}px` }}
          >
            {week.map((date, dayIndex) => {
              const isCurrentMonth = date.getMonth() === currentDate.getMonth();
              const today = new Date();
              const isToday = today.toDateString() === date.toDateString();

              return (
                <div
                  key={dayIndex}
                  className={`border-r border-gray-700 p-1.5 ${
                    dayIndex === 6 ? "border-r-0" : ""
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-6 rounded-md text-xs font-semibold ${
                      isToday
                        ? "bg-blue-500 text-white"
                        : isCurrentMonth
                        ? "text-gray-200"
                        : "text-gray-600"
                    }`}
                  >
                    {date.getMonth() + 1}/{date.getDate()}
                  </div>
                </div>
              );
            })}
            <div className="absolute top-8 left-0 right-0">
              {processedEvents.map((event) => (
                <div
                  key={`${event.name}-${event.startCol}`}
                  className={`${event.color} absolute flex items-center text-white text-xs font-semibold px-2 rounded-md truncate cursor-pointer hover:opacity-80`}
                  style={{
                    top: `${event.lane * 28 + 2}px`,
                    left: `calc(${(100 / 7) * event.startCol}% + 2px)`,
                    width: `calc(${(100 / 7) * event.span}% - 4px)`,
                    height: "24px",
                  }}
                  title={event.name}
                >
                  {event.iconUrl && (
                    <div className="relative w-4 h-4 mr-1.5 flex-shrink-0">
                      <Image
                        src={event.iconUrl}
                        alt={event.name}
                        width={16}
                        height={16}
                        className="rounded-sm"
                      />
                    </div>
                  )}
                  <span>{event.name}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
