// src/components/calendar/EventCalendar.tsx
"use client";

import { useMemo } from "react";
import Image from "next/image";
import { processEventsForWeek } from "./calendar-helpers";
import { Event } from "@/data/event-data";

interface EventCalendarProps {
  viewDate: Date;
  onEventClick: (event: Event) => void;
}

export default function EventCalendar({
  viewDate,
  onEventClick,
}: EventCalendarProps) {
  const week = useMemo(() => {
    const startDate = new Date(viewDate);
    const currentWeek = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      currentWeek.push(day);
    }
    return currentWeek;
  }, [viewDate]);

  const processedEvents = processEventsForWeek(week);
  const maxLane = Math.max(-1, ...processedEvents.map((e) => e.lane));
  // 각 이벤트의 높이(36px)와 상하 간격(6px)을 고려하여 계산합니다.
  const requiredHeight = 12 + (maxLane + 1) * 42;

  return (
    <div className="border-l border-r border-b border-gray-700">
      <div
        className="relative grid grid-cols-7"
        style={{ minHeight: `${requiredHeight}px` }}
      >
        {/* 날짜 표시는 page.tsx로 이동했으므로, 여기서는 각 요일의 배경 셀만 렌더링합니다. */}
        {week.map((_, dayIndex) => (
          <div
            key={dayIndex}
            className={`border-r border-gray-700 ${
              dayIndex === 6 ? "border-r-0" : ""
            }`}
          >
            {/* 셀의 최소 높이를 확보하기 위한 빈 div */}
            <div style={{ minHeight: `${requiredHeight}px` }}></div>
          </div>
        ))}

        {/* 이벤트 바를 표시하는 부분은 top 값을 조정합니다. */}
        <div className="absolute top-0 left-0 right-0">
          {processedEvents.map((event) => (
            <div
              key={`${event.name}-${event.startCol}`}
              onClick={() => onEventClick(event)}
              className={`${event.color} absolute flex items-center text-white text-sm font-semibold px-1.5 rounded-lg cursor-pointer hover:opacity-80`}
              style={{
                top: `${event.lane * 42 + 6}px`, // 상단 간격을 6px로 조정
                left: `calc(${(100 / 7) * event.startCol}% + 3px)`,
                width: `calc(${(100 / 7) * event.span}% - 6px)`,
                height: "36px",
              }}
              title={event.name}
            >
              {event.iconUrl && (
                // 아이콘 우측 마진(mr-1)을 제거합니다.
                <div className="relative w-10 h-7 -ml-1 flex-shrink-0 flex items-center justify-center">
                  <div
                    className={`relative ${
                      event.iconFit === "contain" ? "w-full h-7" : "w-7 h-7"
                    }`}
                  >
                    <Image
                      src={event.iconUrl}
                      alt={event.name}
                      fill
                      sizes="40px"
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
    </div>
  );
}
