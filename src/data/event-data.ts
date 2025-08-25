// src/data/event-data.ts

export interface EventSchedule {
  start: number; // 0: Mon, 1: Tue, ..., 6: Sun
  end: number;
}

export interface Event {
  name: string;
  color: string; // Tailwind CSS background color class
  schedule: (EventSchedule | null)[]; // 4주(Part 1~4)의 스케줄
  groupId?: string;
}

// 기준점을 현재 주간의 월요일(2025-08-25)으로 변경합니다.
export const CYCLE_ANCHOR_DATE = new Date("2025-08-25T00:00:00Z");

export const EVENTS: Event[] = [
  {
    name: "빙원의 왕",
    color: "bg-yellow-500",
    schedule: [{ start: 0, end: 6 }, null, null, null],
  },
  {
    name: "행운의 룰렛",
    color: "bg-yellow-500",
    schedule: [{ start: 1, end: 3 }, null, { start: 1, end: 3 }, null],
  },
  {
    name: "내부 캐슬전투",
    color: "bg-blue-500",
    schedule: [{ start: 5, end: 5 }, null, null, null],
  },
  {
    name: "미치광이 조이",
    color: "bg-green-500",
    schedule: [{ start: 1, end: 3 }, null, { start: 1, end: 3 }, null],
  },
  {
    name: "프로스트 광산",
    color: "bg-yellow-500",
    schedule: [{ start: 1, end: 1 }, null, { start: 1, end: 1 }, null],
  },
  {
    name: "전군참전",
    color: "bg-blue-500",
    schedule: [{ start: 4, end: 5 }, null, null, null],
  },
  {
    name: "연맹 챔피언쉽",
    color: "bg-green-500",
    schedule: [
      { start: 0, end: 6 },
      { start: 0, end: 6 },
      { start: 0, end: 6 },
      { start: 0, end: 6 },
    ],
  },
  {
    name: "요새쟁탈",
    color: "bg-yellow-500",
    schedule: [
      { start: 1, end: 4 },
      { start: 1, end: 4 },
      { start: 1, end: 4 },
      { start: 1, end: 4 },
    ],
  },
  {
    name: "영웅의 전당",
    color: "bg-yellow-500",
    groupId: "yeongjeon",
    schedule: [
      { start: 0, end: 1 },
      { start: 0, end: 1 },
      { start: 0, end: 1 },
      { start: 0, end: 1 },
    ],
  },
  {
    name: "영웅의 전당",
    color: "bg-yellow-500",
    groupId: "yeongjeon",
    schedule: [
      { start: 6, end: 6 },
      { start: 6, end: 6 },
      { start: 6, end: 6 },
      { start: 6, end: 6 },
    ],
  },
  {
    name: "불꽃과 송곳니",
    color: "bg-red-500",
    schedule: [{ start: 0, end: 1 }, null, { start: 0, end: 1 }, null],
  },
  {
    name: "야수처치",
    color: "bg-blue-500",
    schedule: [{ start: 1, end: 2 }, null, { start: 1, end: 2 }, null],
  },
  {
    name: "용병 명예",
    color: "bg-red-500",
    groupId: "yongmyeong",
    schedule: [{ start: 5, end: 6 }, null, null, null],
  },
  {
    name: "용병 명예",
    color: "bg-red-500",
    groupId: "yongmyeong",
    schedule: [null, { start: 0, end: 0 }, null, null],
  },
  {
    name: "협곡전투",
    color: "bg-yellow-500",
    schedule: [null, { start: 0, end: 5 }, null, null],
  },
  {
    name: "연맹총동원",
    color: "bg-blue-500",
    schedule: [null, { start: 0, end: 5 }, null, null],
  },
  {
    name: "최강 왕국 매칭",
    color: "bg-yellow-500",
    schedule: [null, { start: 5, end: 6 }, null, null],
  },
  {
    name: "무기공장 쟁탈전",
    color: "bg-yellow-500",
    schedule: [null, { start: 0, end: 6 }, null, { start: 0, end: 6 }],
  },
  {
    name: "지나의 복수",
    color: "bg-blue-500",
    schedule: [null, { start: 2, end: 4 }, null, { start: 2, end: 4 }],
  },
  {
    name: "낚시선수권 대회",
    color: "bg-green-500",
    schedule: [null, { start: 1, end: 4 }, null, { start: 1, end: 4 }],
  },
  {
    name: "캐슬전투",
    color: "bg-blue-500",
    schedule: [null, null, { start: 5, end: 5 }, null],
  },
  {
    name: "서버전 준비단계",
    color: "bg-yellow-500",
    schedule: [null, null, { start: 0, end: 4 }, null],
  },
  {
    name: "새벽의 희망",
    color: "bg-green-500",
    schedule: [null, null, { start: 1, end: 3 }, null],
  },
  {
    name: "미야의 점집",
    color: "bg-blue-500",
    schedule: [null, null, { start: 4, end: 5 }, null],
  },
  {
    name: "설원장삿길",
    color: "bg-yellow-500",
    schedule: [null, null, null, { start: 0, end: 5 }],
  },
  {
    name: "연맹 대작전",
    color: "bg-blue-500",
    schedule: [null, null, null, { start: 0, end: 5 }],
  },
  {
    name: "설원 거래소",
    color: "bg-yellow-500",
    schedule: [null, null, null, { start: 0, end: 1 }],
  },
];
