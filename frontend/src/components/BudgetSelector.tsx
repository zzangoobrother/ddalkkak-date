"use client";

import { useState, useCallback } from "react";
import type { BudgetPreset, BudgetSelection } from "@/types/course";
import { BUDGET_PRESETS, BUDGET_SLIDER_CONFIG } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";

interface BudgetSelectorProps {
  selectedRegionName: string; // 선택된 지역명
  selectedDateTypeName: string; // 선택된 데이트 유형명
  onBudgetSelect?: (budget: BudgetSelection) => void;
  onSubmit?: (budget: BudgetSelection) => void;
  onBack?: () => void;
}

// 금액 포맷팅 함수
function formatAmount(amount: number): string {
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(0)}만원`;
  }
  return `${amount.toLocaleString()}원`;
}

export default function BudgetSelector({
  selectedRegionName,
  selectedDateTypeName,
  onBudgetSelect,
  onSubmit,
  onBack,
}: BudgetSelectorProps) {
  const [selectedPreset, setSelectedPreset] = useState<BudgetPreset | null>(null);
  const [customAmount, setCustomAmount] = useState<number>(BUDGET_SLIDER_CONFIG.defaultValue);

  // 예산 프리셋 선택 핸들러
  const handlePresetSelect = useCallback(
    (preset: BudgetPreset) => {
      setSelectedPreset(preset);

      const budgetSelection: BudgetSelection = {
        presetId: preset.id,
        customAmount: preset.id === "custom" ? customAmount : undefined,
      };

      // Analytics 이벤트 전송
      trackEvent("budget_selected", {
        budget_preset_id: preset.id,
        budget_preset_label: preset.label,
        custom_amount: preset.id === "custom" ? customAmount : undefined,
      });

      onBudgetSelect?.(budgetSelection);
    },
    [customAmount, onBudgetSelect]
  );

  // 슬라이더 변경 핸들러
  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newAmount = parseInt(e.target.value, 10);
      setCustomAmount(newAmount);

      if (selectedPreset?.id === "custom") {
        const budgetSelection: BudgetSelection = {
          presetId: "custom",
          customAmount: newAmount,
        };
        onBudgetSelect?.(budgetSelection);
      }
    },
    [selectedPreset, onBudgetSelect]
  );

  // 코스 생성하기 버튼 핸들러
  const handleSubmit = () => {
    if (selectedPreset) {
      const budgetSelection: BudgetSelection = {
        presetId: selectedPreset.id,
        customAmount: selectedPreset.id === "custom" ? customAmount : undefined,
      };

      trackEvent("course_generation_requested", {
        budget_preset_id: selectedPreset.id,
        budget_amount: selectedPreset.id === "custom" ? customAmount : selectedPreset.maxAmount,
        region_name: selectedRegionName,
        date_type_name: selectedDateTypeName,
      });

      onSubmit?.(budgetSelection);
    }
  };

  // 이전 단계로 이동
  const handleBack = () => {
    trackEvent("back_step_clicked", {
      current_step: 3,
    });
    onBack?.();
  };

  // 현재 선택된 예산 금액 표시
  const getSelectedBudgetDisplay = (): string => {
    if (!selectedPreset) return "";
    if (selectedPreset.id === "custom") {
      return formatAmount(customAmount);
    }
    return selectedPreset.label;
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
          예산을 선택해주세요
        </h1>
        <p className="text-sm text-text-secondary">
          <span className="font-semibold text-primary">{selectedRegionName}</span>
          에서{" "}
          <span className="font-semibold text-primary">{selectedDateTypeName}</span>
        </p>
      </div>

      {/* 스텝 인디케이터 */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <span className="w-8 h-1 rounded-full bg-primary" />
        <span className="w-8 h-1 rounded-full bg-primary" />
        <span className="w-8 h-1 rounded-full bg-primary" />
      </div>

      {/* 예산 프리셋 버튼들 */}
      <div className="space-y-2 mb-4" role="radiogroup" aria-label="예산 선택">
        {BUDGET_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => handlePresetSelect(preset)}
            role="radio"
            aria-checked={selectedPreset?.id === preset.id}
            className={`
              w-full flex items-center justify-between px-4 py-4
              rounded-xl border-2 transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              ${
                selectedPreset?.id === preset.id
                  ? "border-primary bg-card-selected"
                  : "border-transparent bg-card hover:bg-card-hover shadow-card"
              }
            `}
          >
            <div className="flex items-center gap-3">
              {/* 라디오 인디케이터 */}
              <span
                className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center
                  transition-colors duration-200
                  ${
                    selectedPreset?.id === preset.id
                      ? "border-primary bg-primary"
                      : "border-gray-300"
                  }
                `}
              >
                {selectedPreset?.id === preset.id && (
                  <span className="w-2 h-2 rounded-full bg-white" />
                )}
              </span>
              <span className="font-semibold text-text-primary">
                {preset.label}
              </span>
            </div>
            <span className="text-sm text-text-secondary">{preset.tagline}</span>
          </button>
        ))}
      </div>

      {/* 직접 입력 슬라이더 (직접 입력 선택 시만 표시) */}
      <div
        className={`
          bg-gray-50 rounded-xl p-4 mb-4 transition-all duration-300
          ${selectedPreset?.id === "custom" ? "opacity-100 max-h-40" : "opacity-0 max-h-0 overflow-hidden"}
        `}
      >
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-text-secondary">직접 입력</span>
          <span className="text-lg font-bold text-primary">
            {formatAmount(customAmount)}
          </span>
        </div>
        <input
          type="range"
          min={BUDGET_SLIDER_CONFIG.min}
          max={BUDGET_SLIDER_CONFIG.max}
          step={BUDGET_SLIDER_CONFIG.step}
          value={customAmount}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:bg-primary
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:shadow-md
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:bg-primary
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:cursor-pointer
            [&::-moz-range-thumb]:border-0"
          aria-label="예산 금액 슬라이더"
        />
        <div className="flex justify-between text-xs text-text-muted mt-1">
          <span>{formatAmount(BUDGET_SLIDER_CONFIG.min)}</span>
          <span>{formatAmount(BUDGET_SLIDER_CONFIG.max)}</span>
        </div>
      </div>

      {/* 안내 문구 */}
      <div className="flex flex-col gap-1 text-xs text-text-muted text-center mb-6">
        <p>💡 1인 기준 예상 금액입니다</p>
        <p>🚕 교통비는 미포함이에요</p>
      </div>

      {/* 선택된 예산 정보 */}
      <div
        className={`
          p-4 rounded-xl bg-primary-light mb-4 transition-all duration-300
          ${selectedPreset ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}
        `}
        aria-live="polite"
      >
        {selectedPreset && (
          <p className="text-sm text-text-primary text-center">
            <span className="font-semibold">💰 {getSelectedBudgetDisplay()}</span>
            {" "}예산으로 코스를 추천해드릴게요!
          </p>
        )}
      </div>

      {/* 코스 생성하기 버튼 */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!selectedPreset}
        className={`
          w-full py-4 rounded-xl font-semibold text-white transition-all duration-200
          ${
            selectedPreset
              ? "bg-primary hover:bg-primary-hover shadow-lg hover:shadow-xl"
              : "bg-gray-300 cursor-not-allowed"
          }
        `}
        aria-label={
          selectedPreset
            ? "코스 생성하기"
            : "예산을 선택해주세요"
        }
      >
        {selectedPreset ? "코스 생성하기 ✨" : "예산을 선택해주세요"}
      </button>
    </div>
  );
}
