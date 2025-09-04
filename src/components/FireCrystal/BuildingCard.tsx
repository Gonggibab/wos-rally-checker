// src/components/FireCrystal/BuildingCard.tsx
"use client";

import { useMemo, useState } from "react";
import { BuildingData } from "@/data/fire-crystal-data";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { Transition } from "@headlessui/react";

interface BuildingCardProps {
  buildingKey: string;
  building: BuildingData;
  currentLevel: number;
  targetLevel: number;
  progress: number;
  onLevelChange: (
    buildingKey: string,
    type: "current" | "target" | "progress",
    value: number
  ) => void;
}

export default function BuildingCard({
  buildingKey,
  building,
  currentLevel,
  targetLevel,
  progress,
  onLevelChange,
}: BuildingCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const getCostPerStep = (cost: number) => {
    if (cost === 0) return 0;
    return Math.round((cost / 5) * 100) / 100;
  };

  const costForRange = useMemo(() => {
    let totalFc = 0;
    let totalRfc = 0;

    if (targetLevel > currentLevel) {
      if (currentLevel < 10) {
        const currentLevelCost = building.costs[currentLevel];
        const remainingSteps = 5 - progress;
        totalFc += getCostPerStep(currentLevelCost.fc) * remainingSteps;
        totalRfc += getCostPerStep(currentLevelCost.rfc) * remainingSteps;
      }

      for (let i = currentLevel + 1; i < targetLevel; i++) {
        if (i < 10) {
          totalFc += building.costs[i].fc;
          totalRfc += building.costs[i].rfc;
        }
      }
    }
    return { totalFc: Math.round(totalFc), totalRfc: Math.round(totalRfc) };
  }, [currentLevel, targetLevel, progress, building.costs]);

  return (
    <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-lg p-4 relative">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-white">{building.name}</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 text-gray-500 hover:text-white transition-colors duration-200"
        >
          {isExpanded ? (
            <ChevronUpIcon className="w-5 h-5" />
          ) : (
            <ChevronDownIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      <Transition
        show={isExpanded}
        enter="transition-all ease-out duration-300 overflow-hidden"
        enterFrom="opacity-0 max-h-0"
        enterTo="opacity-100 max-h-[500px]"
        leave="transition-all ease-in duration-200 overflow-hidden"
        leaveFrom="opacity-100 max-h-[500px]"
        leaveTo="opacity-0 max-h-0"
      >
        <div className="mt-4">
          <div className="space-y-4">
            {/* 현재 레벨 슬라이더 */}
            <div>
              <div className="flex justify-between items-center text-sm mb-1">
                <label
                  htmlFor={`${buildingKey}-current`}
                  className="text-gray-400"
                >
                  현재 FC 레벨
                </label>
                <span className="font-semibold text-white">{currentLevel}</span>
              </div>
              <input
                type="range"
                id={`${buildingKey}-current`}
                min="0"
                max="10"
                step="1"
                value={currentLevel}
                onChange={(e) =>
                  onLevelChange(
                    buildingKey,
                    "current",
                    parseInt(e.target.value)
                  )
                }
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* 목표 레벨 슬라이더 */}
            <div>
              <div className="flex justify-between items-center text-sm mb-1">
                <label
                  htmlFor={`${buildingKey}-target`}
                  className="text-gray-400"
                >
                  목표 FC 레벨
                </label>
                <span className="font-semibold text-blue-400">
                  {targetLevel}
                </span>
              </div>
              <input
                type="range"
                id={`${buildingKey}-target`}
                min="0"
                max="10"
                step="1"
                value={targetLevel}
                onChange={(e) =>
                  onLevelChange(buildingKey, "target", parseInt(e.target.value))
                }
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* 현재 진행 단계 슬라이더 (위치를 여기로 이동) */}
            {currentLevel < 10 && currentLevel < targetLevel && (
              <div>
                <div className="flex justify-between items-center text-sm mb-1">
                  <label
                    htmlFor={`${buildingKey}-progress`}
                    className="text-gray-400"
                  >
                    현재 진행 단계 (FC {currentLevel})
                  </label>
                  <span className="font-semibold text-white">
                    {progress} / 5
                  </span>
                </div>
                <input
                  type="range"
                  id={`${buildingKey}-progress`}
                  min="0"
                  max="5"
                  step="1"
                  value={progress}
                  onChange={(e) =>
                    onLevelChange(
                      buildingKey,
                      "progress",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* 총 필요량 표시 */}
          {targetLevel > currentLevel && (
            <div className="mt-4 pt-3 border-t border-white/10 text-xs text-gray-400">
              <p className="font-semibold mb-1">
                FC {currentLevel} ({progress}/5단계) → FC {targetLevel} 필요량:
              </p>
              <p>
                - 불의 수정:{" "}
                <span className="font-mono text-yellow-400">
                  {costForRange.totalFc.toLocaleString()}
                </span>
                개
              </p>
              <p>
                - 정제된 불의 수정:{" "}
                <span className="font-mono text-sky-400">
                  {costForRange.totalRfc.toLocaleString()}
                </span>
                개
              </p>
            </div>
          )}
        </div>
      </Transition>
    </div>
  );
}
