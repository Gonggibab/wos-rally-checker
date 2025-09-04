// src/hooks/useFireCrystalCalculator.ts
"use client";

import { useState, useMemo } from "react";
import { buildingUpgradeData } from "@/data/fire-crystal-data";

export interface BuildingLevelState {
  current: number;
  target: number;
  progress: number; // 0 to 5, 현재 레벨에서 진행한 단계
}

export interface BuildingLevels {
  [key: string]: BuildingLevelState;
}

export function useFireCrystalCalculator() {
  const initialLevels: BuildingLevels = Object.keys(buildingUpgradeData).reduce(
    (acc, key) => {
      acc[key] = { current: 0, target: 0, progress: 0 };
      return acc;
    },
    {} as BuildingLevels
  );

  const [levels, setLevels] = useState<BuildingLevels>(initialLevels);

  const setLevel = (
    buildingKey: string,
    type: "current" | "target" | "progress",
    value: number
  ) => {
    setLevels((prev) => {
      const newBuildingState = { ...prev[buildingKey], [type]: value };

      // 현재 레벨이 바뀌면 진행 단계는 0으로 초기화
      if (type === "current" && prev[buildingKey].current !== value) {
        newBuildingState.progress = 0;
      }

      return {
        ...prev,
        [buildingKey]: newBuildingState,
      };
    });
  };

  const getCostPerStep = (cost: number) => {
    if (cost === 0) return 0;
    return Math.round((cost / 5) * 100) / 100;
  };

  const totalCost = useMemo(() => {
    let totalFc = 0;
    let totalRfc = 0;

    for (const key in levels) {
      const { current, target, progress } = levels[key];
      const building = buildingUpgradeData[key];

      if (target > current) {
        // 1. 현재 레벨에서 남은 단계 비용 계산
        if (current < 10) {
          // FC10 (인덱스 9) 이후는 업그레이드 없으므로
          const currentLevelCost = building.costs[current];
          const remainingSteps = 5 - progress;
          totalFc += getCostPerStep(currentLevelCost.fc) * remainingSteps;
          totalRfc += getCostPerStep(currentLevelCost.rfc) * remainingSteps;
        }

        // 2. 현재 레벨과 목표 레벨 사이의 전체 레벨 비용 계산
        for (let i = current + 1; i < target; i++) {
          totalFc += building.costs[i].fc;
          totalRfc += building.costs[i].rfc;
        }
      }
    }

    // 소수점 오차 방지를 위해 최종 결과 반올림
    return {
      totalFc: Math.round(totalFc),
      totalRfc: Math.round(totalRfc),
    };
  }, [levels]);

  return { levels, setLevel, totalCost, getCostPerStep, buildingUpgradeData };
}
