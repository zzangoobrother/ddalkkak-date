"use client";

import type { DateType } from "@/types/course";

interface DateTypeCardProps {
  dateType: DateType;
  isSelected: boolean;
  isOtherSelected: boolean; // 다른 카드가 선택된 상태인지
  onSelect: (dateType: DateType) => void;
}

export default function DateTypeCard({
  dateType,
  isSelected,
  isOtherSelected,
  onSelect,
}: DateTypeCardProps) {
  const handleClick = () => {
    onSelect(dateType);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(dateType);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`${dateType.name} 선택`}
      aria-pressed={isSelected}
      className={`
        relative flex flex-col items-center justify-center
        w-full p-4 sm:p-5
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
      {/* 선택 체크 아이콘 */}
      {isSelected && (
        <span className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center bg-primary rounded-full">
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
      <span className="text-4xl sm:text-5xl mb-2" role="img" aria-hidden="true">
        {dateType.emoji}
      </span>

      {/* 유형명 */}
      <span className="text-sm sm:text-base font-semibold text-text-primary text-center leading-tight">
        {dateType.name}
      </span>

      {/* 설명 - 선택된 경우만 표시 */}
      <span
        className={`
          text-xs text-text-secondary mt-2 text-center leading-snug
          transition-all duration-200
          ${isSelected ? "opacity-100 max-h-10" : "opacity-0 max-h-0 overflow-hidden"}
        `}
      >
        {dateType.description}
      </span>
    </button>
  );
}
