// src/app/(main)/fire-crystal-calculator/page.tsx
"use client";

import Image from "next/image";
import BuildingCard from "@/components/FireCrystal/BuildingCard";
import { useFireCrystalCalculator } from "@/hooks/useFireCrystalCalculator";
import { buildingOrder } from "@/data/fire-crystal-data"; // 순서 배열 import

export default function FireCrystalCalculatorPage() {
  const { levels, setLevel, totalCost, buildingUpgradeData } =
    useFireCrystalCalculator();

  // 새로운 이미지 URL로 교체했습니다.
  const fireCrystalImageUrl =
    "https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/07/item_icon_100081.png";
  const refinedFireCrystalImageUrl =
    "https://gom-s3-user-avatar.s3.us-west-2.amazonaws.com/wp-content/uploads/2023/07/item_icon_100083.png";

  return (
    <div className="h-full flex flex-col">
      {/* 상단 결과 표시 영역 (고정) */}
      <div className="sticky top-0 z-10 bg-[var(--background)]/80 backdrop-blur-sm p-4 border-b border-[var(--card-border)]">
        <div className="max-w-4xl mx-auto">
          <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <h2 className="text-lg font-semibold text-center text-white mb-3">
              총 필요 재료
            </h2>
            <div className="flex justify-around items-center text-center">
              {/* 불의 수정 */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <Image
                    src={fireCrystalImageUrl}
                    alt="불의 수정"
                    width={24}
                    height={24}
                  />
                  <p className="text-sm text-yellow-400">불의 수정</p>
                </div>
                <p className="text-2xl font-bold font-mono text-white">
                  {totalCost.totalFc.toLocaleString()}
                </p>
              </div>
              {/* 정제된 불의 수정 */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <Image
                    src={refinedFireCrystalImageUrl}
                    alt="정제된 불의 수정"
                    width={24}
                    height={24}
                  />
                  <p className="text-sm text-sky-400">정제된 불의 수정</p>
                </div>
                <p className="text-2xl font-bold font-mono text-white">
                  {totalCost.totalRfc.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 건물 카드 스크롤 영역 */}
      <div className="flex-grow overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {buildingOrder.map((key) => (
            <BuildingCard
              key={key}
              buildingKey={key}
              building={buildingUpgradeData[key]}
              currentLevel={levels[key].current}
              targetLevel={levels[key].target}
              progress={levels[key].progress}
              onLevelChange={setLevel}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
