// src/data/event-data.ts

export interface EventSchedule {
  start: number; // 0: Mon, 1: Tue, ..., 6: Sun
  end: number;
}

export interface Event {
  name: string;
  color: string;
  schedule: (EventSchedule | null)[];
  groupId?: string;
  iconUrl?: string;
  iconFit?: "cover" | "contain";
  detailId: string;
}

export const CYCLE_ANCHOR_DATE = new Date("2025-08-25T00:00:00Z");

export const EVENTS: Event[] = [
  {
    name: "빙원의 왕",
    color: "bg-yellow-500",
    detailId: "bingwon-wang",
    iconUrl:
      "https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2025/05/21151925/jump_icon_40115.png",
    schedule: [{ start: 0, end: 6 }, null, null, null],
  },
  {
    name: "행운의 룰렛",
    color: "bg-yellow-500",
    detailId: "lucky-wheel",
    iconUrl:
      "https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/10/16082444/%E5%BF%83%E6%84%BF%E5%B0%8F%E7%AD%91jhu.png",
    schedule: [{ start: 1, end: 3 }, null, { start: 1, end: 3 }, null],
  },
  {
    name: "내부 캐슬전투",
    color: "bg-blue-500",
    detailId: "solar-fight",
    iconUrl:
      "https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2025/05/22083813/%E7%8E%8B%E5%9F%8E%E4%BA%89%E5%A4%BA%E6%88%98.png",
    schedule: [{ start: 5, end: 5 }, null, null, null],
  },
  {
    name: "미치광이 조이",
    color: "bg-green-500",
    detailId: "crazy-zoe",
    iconUrl:
      "https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2025/05/21144421/jump_icon_40086.png",
    schedule: [{ start: 1, end: 3 }, null, { start: 1, end: 3 }, null],
  },
  {
    name: "프로스트 광산",
    color: "bg-yellow-500",
    detailId: "frost-mountain",
    iconUrl:
      "https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/10/jump_icon_40191.png",
    schedule: [{ start: 1, end: 1 }, null, { start: 1, end: 1 }, null],
  },
  {
    name: "전군참전",
    color: "bg-blue-500",
    detailId: "geon-cham",
    iconUrl:
      "https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2025/05/22082953/%E5%85%A8%E5%86%9B%E5%8F%82%E6%88%98.png",
    schedule: [{ start: 4, end: 5 }, null, null, null],
  },
  {
    name: "연맹 챔피언쉽",
    color: "bg-green-500",
    detailId: "championship",
    iconUrl:
      "https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2025/05/21145630/jump_icon_40091.png",
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
    detailId: "castle",
    iconUrl:
      "https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/04/堡垒争夺战.png",
    iconFit: "contain",
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
    detailId: "hallof-hero",
    groupId: "yeongjeon",
    iconUrl:
      "https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2025/05/21155058/item_icon_620501.png",
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
    detailId: "hallof-hero",
    groupId: "yeongjeon",
    iconUrl:
      "https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2025/05/21155058/item_icon_620501.png",
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
    detailId: "flame-teeth",
    iconUrl:
      "https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/10/16082352/%E7%83%88%E7%84%B0%E4%B8%8E%E7%8D%A0%E7%89%99.png",
    schedule: [{ start: 0, end: 1 }, null, { start: 0, end: 1 }, null],
  },
  {
    name: "야수처치",
    color: "bg-blue-500",
    detailId: "monster-hunt",
    iconUrl:
      "https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2025/08/%E6%B8%85%E7%90%86%E9%87%8E%E5%85%BD.png",
    schedule: [{ start: 1, end: 2 }, null, { start: 1, end: 2 }, null],
  },
  {
    name: "용병 명예",
    color: "bg-red-500",
    groupId: "yongmyeong",
    detailId: "yong-myeong",
    iconUrl:
      "https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2025/05/21150513/jump_icon_40280.png",
    schedule: [null, null, null, { start: 5, end: 6 }],
  },
  {
    name: "용병 명예",
    color: "bg-red-500",
    groupId: "yongmyeong",
    detailId: "yong-myeong",
    iconUrl:
      "https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2025/05/21150513/jump_icon_40280.png",
    schedule: [{ start: 0, end: 0 }, null, null, null],
  },
  {
    name: "협곡전투",
    color: "bg-yellow-500",
    detailId: "canyon",
    iconUrl:
      "https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2024/04/15094032/%E5%B3%A1%E8%B0%B7%E4%BC%9A%E6%88%98.png",
    schedule: [null, { start: 0, end: 5 }, null, null],
  },
  {
    name: "연맹총동원",
    color: "bg-blue-500",
    detailId: "yeon-chong",
    iconUrl:
      "https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2025/05/22084100/%E8%81%94%E7%9B%9F%E6%80%BB%E5%8A%A8%E5%91%98.png",
    schedule: [null, { start: 0, end: 5 }, null, null],
  },
  {
    name: "최강 왕국 매칭",
    color: "bg-yellow-500",
    detailId: "svs-matching",
    iconUrl:
      "https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2025/05/21145433/jump_icon_40117.png",
    schedule: [null, { start: 5, end: 6 }, null, null],
  },
  {
    name: "무기공장 쟁탈전",
    color: "bg-yellow-500",
    detailId: "mu-gong",
    iconUrl:
      "https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2025/05/22083013/%E5%85%B5%E5%B7%A5%E5%8E%82.png",
    schedule: [null, { start: 0, end: 6 }, null, { start: 0, end: 6 }],
  },
  {
    name: "지나의 복수",
    color: "bg-blue-500",
    detailId: "gina",
    iconUrl:
      "https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/09/16082829/jump_icon_40067.png",
    schedule: [null, { start: 2, end: 4 }, null, { start: 2, end: 4 }],
  },
  {
    name: "낚시선수권 대회",
    color: "bg-green-500",
    detailId: "fishing",
    iconUrl:
      "https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2025/05/21123327/jump_icon_40179.png",
    schedule: [null, { start: 1, end: 4 }, null, { start: 1, end: 4 }],
  },
  {
    name: "서버전 최강왕국",
    color: "bg-blue-500",
    detailId: "svs",
    iconUrl:
      "https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2025/05/21145433/jump_icon_40117.png",
    schedule: [null, null, { start: 5, end: 5 }, null],
  },
  {
    name: "서버전 준비단계",
    color: "bg-yellow-500",
    detailId: "svs-ready",
    iconUrl:
      "https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2025/05/21145433/jump_icon_40117.png",
    schedule: [null, null, { start: 0, end: 4 }, null],
  },
  {
    name: "새벽의 희망",
    color: "bg-green-500",
    detailId: "hope",
    iconUrl:
      "https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2025/05/22083815/%E9%BB%8E%E6%98%8E%E7%9A%84%E6%84%BF%E6%99%AF.png",
    schedule: [null, null, { start: 1, end: 3 }, null],
  },
  {
    name: "미야의 점집",
    color: "bg-blue-500",
    detailId: "mia",
    iconUrl:
      "https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/10/16082554/%E7%B1%B3%E5%A8%85%E7%9A%84%E8%AE%B8%E6%84%BF%E5%B0%8F%E5%B1%8B.png",
    schedule: [null, null, { start: 4, end: 5 }, null],
  },
  {
    name: "설원장삿길",
    color: "bg-yellow-500",
    detailId: "trading-route",
    iconUrl:
      "https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2025/06/19094753/%E9%9B%AA%E5%8E%9F%E5%95%86%E8%B7%AF.png",
    schedule: [null, null, null, { start: 0, end: 5 }],
  },
  {
    name: "연맹 대작전",
    color: "bg-blue-500",
    detailId: "yeon-dae",
    iconUrl:
      "https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2025/06/19094752/%E8%81%94%E7%9B%9F%E5%A4%A7%E4%BD%9C%E6%88%98.png",
    schedule: [null, null, null, { start: 0, end: 5 }],
  },
  {
    name: "설원 거래소",
    color: "bg-yellow-500",
    detailId: "trading-chong",
    iconUrl:
      "https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2025/05/21152458/jump_icon_40160.png",
    schedule: [null, null, null, { start: 0, end: 1 }],
  },
  {
    name: "사관의계획1",
    color: "bg-yellow-500",
    groupId: "sagwan",
    detailId: "sa-gwan1",
    iconUrl:
      "https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2025/05/22083303/%E5%A3%AB%E5%AE%98%E8%AE%A1%E5%88%92.png",
    schedule: [null, { start: 2, end: 3 }, null, { start: 2, end: 3 }],
  },
  {
    name: "사관의계획2",
    color: "bg-yellow-500",
    groupId: "sagwan",
    detailId: "sa-gwan2",
    iconUrl:
      "https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2025/05/22083303/%E5%A3%AB%E5%AE%98%E8%AE%A1%E5%88%92.png",
    schedule: [
      { start: 6, end: 6 },
      { start: 0, end: 0 },
      { start: 6, end: 6 },
      { start: 0, end: 0 },
    ],
  },
  {
    name: "군비경쟁1",
    color: "bg-yellow-500",
    groupId: "gunbi",
    detailId: "gun-bi1",
    iconUrl:
      "https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2025/05/22083308/%E5%86%9B%E5%A4%87%E7%AB%9E%E6%BC%94.png",
    schedule: [null, { start: 0, end: 1 }, null, { start: 0, end: 1 }],
  },
  {
    name: "군비경쟁2",
    color: "bg-yellow-500",
    groupId: "gunbi",
    detailId: "gun-bi2",
    iconUrl:
      "https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2025/05/22083308/%E5%86%9B%E5%A4%87%E7%AB%9E%E6%BC%94.png",
    schedule: [null, { start: 4, end: 5 }, null, { start: 4, end: 5 }],
  },
];
