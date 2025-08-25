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
    const currentDatePointer = new Date(startDate);

    for (let i = 0; i < 4; i++) {
      const currentWeek = [];
      for (let j = 0; j < 7; j++) {
        currentWeek.push(new Date(currentDatePointer));
        currentDatePointer.setDate(currentDatePointer.getDate() + 1);
      }
      weeks.push(currentWeek);
    }
    return weeks;
  }, []);

  return (
    <div className="border-l border-r border-b border-gray-700">
      {weeksInMonth.map((week, weekIndex) => {
        const processedEvents = processEventsForWeek(week);
        const maxLane = Math.max(-1, ...processedEvents.map((e) => e.lane));
        const requiredHeight = 48 + (maxLane + 1) * 38;

        return (
          <div
            key={weekIndex}
            className="relative grid grid-cols-7 border-t border-gray-700"
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
                    className={`w-full flex justify-center items-center h-6 rounded-md text-sm font-semibold ${
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

            <div className="absolute top-10 left-0 right-0">
              {processedEvents.map((event) => (
                <div
                  key={`${event.name}-${event.startCol}`}
                  // 좌우 패딩을 px-1.5로 수정
                  className={`${event.color} absolute flex items-center text-white text-sm font-semibold px-1.5 rounded-lg cursor-pointer hover:opacity-80`}
                  style={{
                    top: `${event.lane * 38 + 2}px`,
                    left: `calc(${(100 / 7) * event.startCol}% + 3px)`,
                    width: `calc(${(100 / 7) * event.span}% - 6px)`,
                    height: "32px",
                  }}
                  title={event.name}
                >
                  {event.iconUrl && (
                    <div className="relative w-10 h-7 -ml-1 mr-1 flex-shrink-0 flex items-center justify-center">
                      {/* 제안해주신 코드로 수정 */}
                      <div
                        className={`relative ${
                          event.iconFit === "contain" ? "w-full h-7" : "w-7 h-7"
                        }`}
                      >
                        <Image
                          src={event.iconUrl}
                          alt={event.name}
                          fill
                          className={`rounded-md ${
                            event.iconFit === "contain"
                              ? "object-contain"
                              : "object-cover"
                          }`}
                        />
                      </div>
                    </div>
                  )}
                  <span className="whitespace-nowrap">{event.name}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
