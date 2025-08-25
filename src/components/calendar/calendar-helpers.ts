// src/components/calendar/calendar-helpers.ts
import {
  EVENTS,
  CYCLE_ANCHOR_DATE,
  Event,
  EventSchedule,
} from "@/data/event-data";

export interface ProcessedEvent {
  name: string;
  color: string;
  startCol: number;
  span: number;
  lane: number;
  groupId?: string;
}

// 헬퍼 함수들은 변경 없이 그대로 사용
const getCycleWeek = (date: Date): number => {
  const startOfWeek = new Date(date);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(date.getDate() - ((date.getDay() + 6) % 7));

  const diffTime = startOfWeek.getTime() - CYCLE_ANCHOR_DATE.getTime();
  const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));

  return ((diffWeeks % 4) + 4) % 4;
};

// 이벤트 배치 로직 전체를 수정
export const processEventsForWeek = (week: Date[]): ProcessedEvent[] => {
  if (!week || week.length === 0) return [];

  const cycleWeek = getCycleWeek(week[0]);

  // 1. 해당 주에 활성화된 이벤트들을 가져와 기본 정보 계산
  const activeEvents = EVENTS.map((event, index) => {
    const schedule = event.schedule[cycleWeek];
    if (schedule === null) return null;
    return {
      ...event,
      startCol: schedule.start,
      endCol: schedule.end,
      span: schedule.end - schedule.start + 1,
      uniqueId: event.groupId || `event-${index}`, // 그룹 ID가 없으면 고유 ID 생성
    };
  }).filter((e): e is NonNullable<typeof e> => e !== null);

  // 2. 이벤트들을 그룹 ID(uniqueId)로 묶음
  const eventGroups = activeEvents.reduce((acc, event) => {
    acc[event.uniqueId] = acc[event.uniqueId] || [];
    acc[event.uniqueId].push(event);
    return acc;
  }, {} as Record<string, typeof activeEvents>);

  // 3. 그룹들을 정렬 (가장 긴 이벤트를 가진 그룹이 먼저 오도록)
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

  const lanes: (string | null)[][] = []; // 각 레인의 슬롯이 어떤 그룹에 의해 점유되었는지 추적
  const processedEvents: ProcessedEvent[] = [];

  // 4. 정렬된 그룹을 순서대로 레인에 배치
  sortedGroups.forEach((group) => {
    let targetLane = -1;

    // 이 그룹 전체가 들어갈 수 있는 가장 빠른 레인을 찾음
    for (let i = 0; ; i++) {
      lanes[i] = lanes[i] || Array(7).fill(null);
      const lane = lanes[i];
      let canPlaceGroup = true;
      for (const event of group) {
        for (let j = event.startCol; j <= event.endCol; j++) {
          // 다른 그룹이 이미 점유한 경우
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

    // 찾은 레인에 그룹의 모든 이벤트를 배치
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
      });
    });
  });

  return processedEvents;
};
