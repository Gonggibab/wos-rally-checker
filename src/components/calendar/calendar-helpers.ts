// src/components/calendar/calendar-helpers.ts
import { EVENTS, CYCLE_ANCHOR_DATE, Event } from "@/data/event-data";

export interface ProcessedEvent extends Event {
  startCol: number;
  span: number;
  lane: number;
}

const getCycleWeek = (date: Date): number => {
  // 1. 입력된 날짜를 UTC 자정으로 표준화
  const targetDate = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );

  // 2. 해당 주의 월요일을 찾음
  const dayOfWeek = targetDate.getUTCDay(); // 0=일, 1=월
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  targetDate.setUTCDate(targetDate.getUTCDate() + diffToMonday);

  // 3. 기준 날짜(ANCHOR)와 날짜 차이를 계산
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

  // 4. 4주 주기로 변환
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
        ...event,
        lane: targetLane,
      });
    });
  });

  return processedEvents;
};
