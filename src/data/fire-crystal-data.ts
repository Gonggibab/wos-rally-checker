// src/data/fire-crystal-data.ts

export interface UpgradeCost {
  fc: number; // Fire Crystals
  rfc: number; // Refined Fire Crystals
}

export interface BuildingData {
  name: string;
  costs: UpgradeCost[]; // index 0 = FC1, index 1 = FC2, ...
}

// '불멸의 수정' -> '불의 수정'으로 변경하고, 건물 이름을 수정합니다.
export const buildingUpgradeData: Record<string, BuildingData> = {
  furnace: {
    name: "용광로",
    costs: [
      { fc: 660, rfc: 0 },
      { fc: 790, rfc: 0 },
      { fc: 1190, rfc: 0 },
      { fc: 1400, rfc: 0 },
      { fc: 1675, rfc: 0 },
      { fc: 900, rfc: 60 },
      { fc: 1080, rfc: 90 },
      { fc: 1080, rfc: 120 },
      { fc: 1260, rfc: 180 },
      { fc: 1575, rfc: 420 },
    ],
  },
  commandCenter: {
    name: "지휘부", // 이름 변경
    costs: [
      { fc: 130, rfc: 0 },
      { fc: 155, rfc: 0 },
      { fc: 235, rfc: 0 },
      { fc: 280, rfc: 0 },
      { fc: 335, rfc: 0 },
      { fc: 180, rfc: 12 },
      { fc: 216, rfc: 18 },
      { fc: 216, rfc: 24 },
      { fc: 252, rfc: 36 },
      { fc: 315, rfc: 87 },
    ],
  },
  embassy: {
    name: "대사관",
    costs: [
      { fc: 165, rfc: 0 },
      { fc: 195, rfc: 0 },
      { fc: 295, rfc: 0 },
      { fc: 350, rfc: 0 },
      { fc: 415, rfc: 0 },
      { fc: 225, rfc: 13 },
      { fc: 270, rfc: 19 },
      { fc: 270, rfc: 31 },
      { fc: 315, rfc: 42 },
      { fc: 392, rfc: 103 },
    ],
  },
  troopBuilding: {
    name: "병영건물", // 이름 변경
    costs: [
      { fc: 295, rfc: 0 },
      { fc: 355, rfc: 0 },
      { fc: 535, rfc: 0 },
      { fc: 630, rfc: 0 },
      { fc: 750, rfc: 0 },
      { fc: 405, rfc: 25 },
      { fc: 486, rfc: 37 },
      { fc: 486, rfc: 55 },
      { fc: 567, rfc: 78 },
      { fc: 706, rfc: 186 },
    ],
  },
  infirmary: {
    name: "의무실",
    costs: [
      { fc: 130, rfc: 0 },
      { fc: 155, rfc: 0 },
      { fc: 235, rfc: 0 },
      { fc: 280, rfc: 0 },
      { fc: 335, rfc: 0 },
      { fc: 180, rfc: 12 },
      { fc: 216, rfc: 18 },
      { fc: 216, rfc: 24 },
      { fc: 252, rfc: 36 },
      { fc: 315, rfc: 87 },
    ],
  },
  warAcademy: {
    name: "전쟁 아카데미", // 이름 변경
    costs: [
      { fc: 0, rfc: 0 },
      { fc: 355, rfc: 0 },
      { fc: 535, rfc: 0 },
      { fc: 630, rfc: 0 },
      { fc: 750, rfc: 0 },
      { fc: 405, rfc: 25 },
      { fc: 486, rfc: 37 },
      { fc: 486, rfc: 55 },
      { fc: 567, rfc: 78 },
      { fc: 706, rfc: 186 },
    ],
  },
};

// 카드 순서를 정의하는 배열을 추가합니다.
export const buildingOrder: string[] = [
  "furnace",
  "troopBuilding",
  "embassy",
  "warAcademy",
  "commandCenter",
  "infirmary",
];
