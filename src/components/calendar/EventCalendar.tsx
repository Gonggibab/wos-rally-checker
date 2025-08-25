// src/components/calendar/EventCalendar.tsx
"use client";

import { useMemo } from "react";
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
    let currentDatePointer = new Date(startDate);

    for (let i = 0; i < 4; i++) {
      const currentWeek = [];
      for (let j = 0; j < 7; j++) {
        currentWeek.push(new Date(currentDatePointer));
        currentDatePointer.setDate(currentDatePointer.getDate() + 1);
      }
      weeks.push(currentWeek);
    }
    return weeks;
  }, [currentDate]);

  return (
    // 요일 표시는 page.tsx로 이동했으므로 여기서는 제거합니다.
    <div className="border-l border-r border-b border-gray-700">
      {weeksInMonth.map((week, weekIndex) => {
        const processedEvents = processEventsForWeek(week);
        const maxLane = Math.max(-1, ...processedEvents.map((e) => e.lane));
        // 이벤트 높이(24) + 간격(4) = 28px 기준으로 최소 높이 계산
        const requiredHeight = 40 + (maxLane + 1) * 28;

        return (
          // 주차별 박스에 상하 마진(my-2)을 추가하여 간격 생성
          <div
            key={weekIndex}
            className="relative grid grid-cols-7 border-t border-gray-700 my-2"
            style={{ minHeight: `${requiredHeight}px` }}
          >
            {/* 날짜 셀들 */}
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

            {/* 이벤트 막대들 */}
            <div className="absolute top-8 left-0 right-0">
              {processedEvents.map((event) => (
                <div
                  key={`${event.name}-${event.startCol}`}
                  className={`${event.color} absolute text-white text-xs font-semibold px-2 flex items-center rounded-md truncate cursor-pointer hover:opacity-80`}
                  style={{
                    top: `${event.lane * 28 + 2}px`, // 이벤트 간 세로 간격 조정
                    left: `calc(${(100 / 7) * event.startCol}% + 2px)`,
                    width: `calc(${(100 / 7) * event.span}% - 4px)`,
                    height: "24px", // 이벤트 막대 높이 증가
                  }}
                  title={event.name}
                >
                  {event.name}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
