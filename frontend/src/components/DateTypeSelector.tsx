"use client";

import { useState, useCallback } from "react";
import type { DateType } from "@/types/course";
import { DATE_TYPES } from "@/lib/constants";
import DateTypeCard from "@/components/DateTypeCard";
import { trackEvent } from "@/lib/analytics";

interface DateTypeSelectorProps {
  selectedRegionName: string; // 선택된 지역명 (헤더 표시용)
  onDateTypeSelect?: (dateType: DateType) => void;
  onNext?: (dateType: DateType) => void;
  onBack?: () => void;
}

export default function DateTypeSelector({
  selectedRegionName,
  onDateTypeSelect,
  onNext,
  onBack,
}: DateTypeSelectorProps) {
  const [selectedDateType, setSelectedDateType] = useState<DateType | null>(
    null
  );

  // 데이트 유형 선택 핸들러
  const handleDateTypeSelect = useCallback(
    (dateType: DateType) => {
      // 이미 선택된 유형을 다시 클릭하면 선택 해제
      if (selectedDateType?.id === dateType.id) {
        setSelectedDateType(null);
        return;
      }

      setSelectedDateType(dateType);

      // Analytics 이벤트 전송
      trackEvent("date_type_selected", {
        date_type_id: dateType.id,
        date_type_name: dateType.name,
        region_name: selectedRegionName,
      });

      onDateTypeSelect?.(dateType);
    },
    [selectedDateType, selectedRegionName, onDateTypeSelect]
  );

  // 다음 단계로 이동
  const handleNext = () => {
    if (selectedDateType) {
      trackEvent("next_step_clicked", {
        current_step: 2,
        date_type_id: selectedDateType.id,
      });
      onNext?.(selectedDateType);
    }
  };

  // 이전 단계로 이동
  const handleBack = () => {
    trackEvent("back_step_clicked", {
      current_step: 2,
    });
    onBack?.();
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6">
      {/* 헤더 */}
      <div className="mb-6">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary mb-3 transition-colors"
          aria-label="이전 단계로 돌아가기"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          이전
        </button>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          어떤 데이트를 할까요?
        </h1>
        <p className="text-sm text-text-secondary">
          <span className="font-semibold text-primary">{selectedRegionName}</span>
          에서 원하는 데이트 유형을 선택하세요
        </p>
      </div>

      {/* 스텝 인디케이터 */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <span className="w-8 h-1 rounded-full bg-primary" />
        <span className="w-8 h-1 rounded-full bg-primary" />
        <span className="w-8 h-1 rounded-full bg-gray-200" />
      </div>

      {/* 2x3 그리드 */}
      <div
        className="grid grid-cols-2 gap-3 sm:gap-4 mb-4"
        role="listbox"
        aria-label="데이트 유형 선택"
      >
        {DATE_TYPES.map((dateType) => (
          <DateTypeCard
            key={dateType.id}
            dateType={dateType}
            isSelected={selectedDateType?.id === dateType.id}
            isOtherSelected={
              selectedDateType !== null && selectedDateType.id !== dateType.id
            }
            onSelect={handleDateTypeSelect}
          />
        ))}
      </div>

      {/* 선택된 유형 설명 */}
      <div
        className={`
          p-4 rounded-xl bg-primary-light mb-4 transition-all duration-300
          ${selectedDateType ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}
        `}
        aria-live="polite"
      >
        {selectedDateType && (
          <p className="text-sm text-text-primary text-center">
            <span className="font-semibold">{selectedDateType.emoji}</span>{" "}
            {selectedDateType.description}
          </p>
        )}
      </div>

      {/* 다음 버튼 */}
      <button
        type="button"
        onClick={handleNext}
        disabled={!selectedDateType}
        className={`
          w-full py-4 rounded-xl font-semibold text-white transition-all duration-200
          ${
            selectedDateType
              ? "bg-primary hover:bg-primary-hover shadow-lg hover:shadow-xl"
              : "bg-gray-300 cursor-not-allowed"
          }
        `}
        aria-label={
          selectedDateType
            ? `${selectedDateType.name} 선택 후 다음 단계로`
            : "데이트 유형을 선택해주세요"
        }
      >
        {selectedDateType ? "다음" : "데이트 유형을 선택해주세요"}
      </button>
    </div>
  );
}
