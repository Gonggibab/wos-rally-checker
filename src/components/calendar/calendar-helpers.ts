// src/components/calendar/calendar-helpers.ts
import { EVENTS, CYCLE_ANCHOR_DATE, EventSchedule } from "@/data/event-data";

export interface ProcessedEvent {
  name: string;
  color: string;
  startCol: number;
  span: number;
  lane: number;
  groupId?: string;
  iconUrl?: string;
  iconFit?: "cover" | "contain"; // 여기에 iconFit 속성 추가
}

const getCycleWeek = (date: Date): number => {
  const startOfWeek = new Date(date);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(date.getDate() - ((date.getDay() + 6) % 7));

  const diffTime = startOfWeek.getTime() - CYCLE_ANCHOR_DATE.getTime();
  const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));

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

  const lanes: (string | null)[][] = [];
  const processedEvents: ProcessedEvent[] = [];

  sortedGroups.forEach((group) => {
    let targetLane = -1;

    for (let i = 0; ; i++) {
      lanes[i] = lanes[i] || Array(7).fill(null);
      const lane = lanes[i];
      let canPlaceGroup = true;
      for (const event of group) {
        for (let j = event.startCol; j <= event.endCol; j++) {
          if (lane[j] !== null && lane[j] !== event.uniqueId) {
            canPlaceGroup = false;
            break;
          }
        }
        if (!canPlaceGroup) break;
      }
      if (canPlaceGroup) {
        targetLane = i;
        break;
      }
    }

    group.forEach((event) => {
      for (let j = event.startCol; j <= event.endCol; j++) {
        lanes[targetLane][j] = event.uniqueId;
      }
      processedEvents.push({
        name: event.name,
        color: event.color,
        startCol: event.startCol,
        span: event.span,
        lane: targetLane,
        groupId: event.groupId,
        iconUrl: event.iconUrl,
        iconFit: event.iconFit, // iconFit 값 전달 추가
      });
    });
  });

  return processedEvents;
};
