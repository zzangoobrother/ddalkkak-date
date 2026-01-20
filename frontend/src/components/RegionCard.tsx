"use client";

import type { Region } from "@/types/region";

interface RegionCardProps {
  region: Region;
  isSelected: boolean;
  isOtherSelected: boolean; // 다른 카드가 선택된 상태인지
  onSelect: (region: Region) => void;
}

export default function RegionCard({
  region,
  isSelected,
  isOtherSelected,
  onSelect,
}: RegionCardProps) {
  const handleClick = () => {
    onSelect(region);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(region);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`${region.name} 선택, ${region.availableCourses}개 코스 가능${region.hot ? ", 인기 지역" : ""}`}
      aria-pressed={isSelected}
      className={`
        relative flex flex-col items-center justify-center
        w-full aspect-square p-3 sm:p-4
        rounded-card border-2 cursor-pointer
        transition-all duration-200 ease-out
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        ${
          isSelected
            ? "border-primary bg-card-selected shadow-card-selected scale-105 z-10"
            : isOtherSelected
              ? "border-transparent bg-card opacity-50"
              : "border-transparent bg-card shadow-card hover:shadow-card-hover hover:scale-105"
        }
      `}
    >
      {/* Hot 배지 */}
      {region.hot && (
        <span
          className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-bold text-white bg-hot-badge rounded-full"
          aria-label="인기 지역"
        >
          HOT
        </span>
      )}

      {/* 선택 체크 아이콘 */}
      {isSelected && (
        <span className="absolute top-2 left-2 w-5 h-5 flex items-center justify-center bg-primary rounded-full">
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </span>
      )}

      {/* 이모지 */}
      <span className="text-3xl sm:text-4xl mb-1" role="img" aria-hidden="true">
        {region.emoji}
      </span>

      {/* 지역명 */}
      <span className="text-sm sm:text-base font-semibold text-text-primary text-center leading-tight">
        {region.name}
      </span>

      {/* 코스 수 */}
      <span className="text-xs sm:text-sm text-text-secondary mt-0.5">
        {region.availableCourses}개 코스
      </span>

      {/* 태그라인 */}
      <span className="text-xs text-text-muted mt-0.5 hidden sm:block">
        {region.tagline}
      </span>
    </button>
  );
}
