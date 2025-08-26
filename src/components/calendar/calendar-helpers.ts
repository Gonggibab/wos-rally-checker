// src/components/calendar/calendar-helpers.ts
import {
  EVENTS,
  CYCLE_ANCHOR_DATE,
  Event,
  EventSchedule,
} from "@/data/event-data";

// ProcessedEvent가 Event의 모든 속성을 상속받도록 수정합니다.
export interface ProcessedEvent extends Event {
  startCol: number;
  span: number;
  lane: number;
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
      // 원본 event의 모든 정보를 유지하면서 lane 정보만 추가하도록 수정합니다.
      processedEvents.push({
        ...event,
        lane: targetLane,
      });
    });
  });

  return processedEvents;
};
