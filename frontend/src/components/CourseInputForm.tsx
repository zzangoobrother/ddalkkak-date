"use client";

import { useState, useCallback } from "react";
import type { Region } from "@/types/region";
import type {
  DateType,
  BudgetSelection,
  CourseInputStep,
  CourseInputData,
} from "@/types/course";
import DateMap from "@/components/DateMap";
import DateTypeSelector from "@/components/DateTypeSelector";
import BudgetSelector from "@/components/BudgetSelector";
import { trackEvent } from "@/lib/analytics";

interface CourseInputFormProps {
  onComplete?: (data: CourseInputData) => void;
}

export default function CourseInputForm({ onComplete }: CourseInputFormProps) {
  // 현재 스텝
  const [currentStep, setCurrentStep] = useState<CourseInputStep>(1);

  // 각 스텝의 선택 데이터
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedDateType, setSelectedDateType] = useState<DateType | null>(null);

  // Step 1: 지역 선택 완료
  const handleRegionNext = useCallback((region: Region) => {
    setSelectedRegion(region);
    setCurrentStep(2);
    trackEvent("step_completed", {
      step: 1,
      region_id: region.id,
      region_name: region.name,
    });
  }, []);

  // Step 2: 데이트 유형 선택 완료
  const handleDateTypeNext = useCallback((dateType: DateType) => {
    setSelectedDateType(dateType);
    setCurrentStep(3);
    trackEvent("step_completed", {
      step: 2,
      date_type_id: dateType.id,
      date_type_name: dateType.name,
    });
  }, []);

  // Step 2: 뒤로가기
  const handleDateTypeBack = useCallback(() => {
    setCurrentStep(1);
  }, []);

  // Step 3: 예산 선택 완료 및 제출
  const handleBudgetSubmit = useCallback(
    (budget: BudgetSelection) => {
      if (selectedRegion && selectedDateType) {
        const inputData: CourseInputData = {
          regionId: selectedRegion.id,
          dateTypeId: selectedDateType.id,
          budget,
        };

        trackEvent("course_input_completed", {
          region_id: selectedRegion.id,
          region_name: selectedRegion.name,
          date_type_id: selectedDateType.id,
          date_type_name: selectedDateType.name,
          budget_preset_id: budget.presetId,
          budget_custom_amount: budget.customAmount,
        });

        onComplete?.(inputData);
      }
    },
    [selectedRegion, selectedDateType, onComplete]
  );

  // Step 3: 뒤로가기
  const handleBudgetBack = useCallback(() => {
    setCurrentStep(2);
  }, []);

  // 현재 스텝에 따라 컴포넌트 렌더링
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <DateMap onNext={handleRegionNext} />;
      case 2:
        return (
          <DateTypeSelector
            selectedRegionName={selectedRegion?.name || ""}
            onNext={handleDateTypeNext}
            onBack={handleDateTypeBack}
          />
        );
      case 3:
        return (
          <BudgetSelector
            selectedRegionName={selectedRegion?.name || ""}
            selectedDateTypeName={selectedDateType?.name || ""}
            onSubmit={handleBudgetSubmit}
            onBack={handleBudgetBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 애니메이션을 위한 컨테이너 */}
      <div
        key={currentStep}
        className="animate-fade-in"
      >
        {renderCurrentStep()}
      </div>
    </div>
  );
}
