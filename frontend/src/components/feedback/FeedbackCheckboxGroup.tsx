"use client";

import type { FeedbackOption } from "@/types/feedback";

interface FeedbackCheckboxGroupProps {
  title: string;
  options: FeedbackOption[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
}

/**
 * 칩 형태의 복수선택 체크박스 그룹
 */
export default function FeedbackCheckboxGroup({
  title,
  options,
  selectedIds,
  onToggle,
}: FeedbackCheckboxGroupProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-card">
      <h3 className="text-base font-bold text-text-primary mb-4">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selectedIds.has(option.id);
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onToggle(option.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isSelected
                  ? "border-2 border-primary bg-primary-light text-primary"
                  : "border-2 border-gray-200 bg-white text-text-secondary hover:border-gray-300"
              }`}
            >
              {option.emoji} {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
