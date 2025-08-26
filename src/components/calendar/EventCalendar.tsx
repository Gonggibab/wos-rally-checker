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
  const requiredHeight = 52 + (maxLane + 1) * 42;

  return (
    <div className="border-l border-r border-b border-gray-700">
      <div
        className="relative grid grid-cols-7 border-t border-gray-700"
        style={{ minHeight: `${requiredHeight}px` }}
      >
        {week.map((date, dayIndex) => {
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
                  isToday ? "bg-blue-500 text-white" : "text-gray-200"
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
              onClick={() => onEventClick(event)}
              className={`${event.color} absolute flex items-center text-white text-sm font-semibold px-1.5 rounded-lg cursor-pointer hover:opacity-80`}
              style={{
                top: `${event.lane * 42 + 2}px`,
                left: `calc(${(100 / 7) * event.startCol}% + 3px)`,
                width: `calc(${(100 / 7) * event.span}% - 6px)`,
                height: "36px",
              }}
              title={event.name}
            >
              {event.iconUrl && (
                <div className="relative w-10 h-7 -ml-1 mr-1 flex-shrink-0 flex items-center justify-center">
                  <div
                    className={`relative ${
                      event.iconFit === "contain" ? "w-full h-7" : "w-7 h-7"
                    }`}
                  >
                    <Image
                      src={event.iconUrl}
                      alt={event.name}
                      fill
                      // sizes 속성을 추가하여 경고를 해결합니다.
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
