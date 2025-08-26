// src/app/(main)/event-schedule/page.tsx
"use client";

import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import EventCalendar from "@/components/calendar/EventCalendar";
import EventDetailModal from "@/components/calendar/EventDetailModal";
import { Event } from "@/data/event-data";

export default function EventSchedulePage() {
  const getStartOfWeek = (date: Date) => {
    const newDate = new Date(date);
    const day = newDate.getDay();
    const diff = newDate.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(newDate.setDate(diff));
  };

  const [viewDate, setViewDate] = useState(getStartOfWeek(new Date()));
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const goToPreviousWeek = () =>
    setViewDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 7);
      return newDate;
    });

  const goToNextWeek = () =>
    setViewDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 7);
      return newDate;
    });

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const formatDate = (date: Date) => `${date.getMonth() + 1}/${date.getDate()}`;
  const weekEnd = new Date(viewDate);
  weekEnd.setDate(weekEnd.getDate() + 6);

  return (
    <>
      <div className="h-full flex flex-col">
        <div className="px-4 pt-6 pb-2 bg-[var(--background)] z-10 flex-shrink-0">
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            이벤트 일정
          </h1>
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={goToPreviousWeek}
              className="p-2 rounded-full hover:bg-gray-700"
            >
              <ChevronLeftIcon className="w-6 h-6 text-white" />
            </button>
            <div className="text-lg font-semibold text-gray-300">
              {formatDate(viewDate)} ~ {formatDate(weekEnd)}
            </div>
            <button
              onClick={goToNextWeek}
              className="p-2 rounded-full hover:bg-gray-700"
            >
              <ChevronRightIcon className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="flex-grow overflow-x-auto px-4 pt-2">
          <div className="min-w-[840px]">
            <div className="grid grid-cols-7 text-center font-semibold text-gray-400 border-b border-gray-700 pb-2">
              {weekDays.map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>
            <EventCalendar
              viewDate={viewDate}
              onEventClick={handleEventClick}
            />
          </div>
        </div>
      </div>

      <EventDetailModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        event={selectedEvent}
      />
    </>
  );
}
