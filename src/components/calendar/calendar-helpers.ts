// src/components/calendar/calendar-helpers.ts
import { EVENTS, CYCLE_ANCHOR_DATE, Event } from "@/data/event-data";

export interface ProcessedEvent extends Event {
  startCol: number;
  span: number;
  lane: number;
}

const getCycleWeek = (date: Date): number => {
  const targetDate = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
  const dayOfWeek = targetDate.getUTCDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  targetDate.setUTCDate(targetDate.getUTCDate() + diffToMonday);

  const anchorDate = new Date(
    Date.UTC(
      CYCLE_ANCHOR_DATE.getUTCFullYear(),
      CYCLE_ANCHOR_DATE.getUTCMonth(),
      CYCLE_ANCHOR_DATE.getUTCDate()
    )
  );

  const diffTime = targetDate.getTime() - anchorDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);

  return ((diffWeeks % 4) + 4) % 4;
};

export const processEventsForWeek = (week: Date[]): ProcessedEvent[] => {
  if (!week || week.length === 0) return [];

  const cycleWeek = getCycleWeek(week[0]);

  const activeEvents = EVENTS.map((event, index) => {
    const schedule = event.schedule[cycleWeek];
    if (schedule === null) return null;
    return {
      ...event,
      startCol: schedule.start,
      endCol: schedule.end,
      span: schedule.end - schedule.start + 1,
      uniqueId: event.groupId || `event-${index}`,
    };
  }).filter((e): e is NonNullable<typeof e> => e !== null);

  const eventGroups = activeEvents.reduce((acc, event) => {
    acc[event.uniqueId] = acc[event.uniqueId] || [];
    acc[event.uniqueId].push(event);
    return acc;
  }, {} as Record<string, typeof activeEvents>);

  const sortedGroups = Object.values(eventGroups).sort((a, b) => {
    const maxSpanA = Math.max(...a.map((e) => e.span));
    const maxSpanB = Math.max(...b.map((e) => e.span));
    if (maxSpanB !== maxSpanA) {
      return maxSpanB - maxSpanA;
    }
    const minStartA = Math.min(...a.map((e) => e.startCol));
    const minStartB = Math.min(...b.map((e) => e.startCol));
    return minStartA - minStartB;
  });

  const processedEvents: ProcessedEvent[] = [];

  // 수정된 로직: 각 그룹이 고유한 lane을 갖도록 함
  sortedGroups.forEach((group, index) => {
    const laneIndex = index; // 그룹의 순서가 그대로 lane 번호가 됨
    group.forEach((event) => {
      processedEvents.push({
        ...event,
        lane: laneIndex,
      });
    });
  });

  return processedEvents;
};
