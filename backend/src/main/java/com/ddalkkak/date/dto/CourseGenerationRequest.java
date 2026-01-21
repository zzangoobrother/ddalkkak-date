package com.ddalkkak.date.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 코스 생성 요청 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "코스 생성 요청")
public class CourseGenerationRequest {

    /**
     * 지역 ID
     */
    @NotBlank(message = "지역 ID는 필수입니다")
    @Schema(description = "지역 ID", example = "mapo")
    private String regionId;

    /**
     * 데이트 유형 ID
     */
    @NotBlank(message = "데이트 유형은 필수입니다")
    @Schema(description = "데이트 유형 ID", example = "dinner")
    private String dateTypeId;

    /**
     * 예산 프리셋 ID
     */
    @NotBlank(message = "예산 프리셋은 필수입니다")
    @Schema(description = "예산 프리셋 ID", example = "30k-50k")
    private String budgetPresetId;

    /**
     * 직접 입력 금액 (프리셋이 custom인 경우)
     */
    @Min(value = 10000, message = "최소 금액은 10,000원입니다")
    @Schema(description = "직접 입력 금액 (원)", example = "50000")
    private Integer customAmount;

    /**
     * 실제 사용할 예산 범위 계산
     */
    public int getMinBudget() {
        BudgetPreset preset = BudgetPreset.fromId(budgetPresetId);
        if (preset == BudgetPreset.CUSTOM && customAmount != null) {
            return (int) (customAmount * 0.8); // ±20% 허용
        }
        return preset.getMinAmount();
    }

    public int getMaxBudget() {
        BudgetPreset preset = BudgetPreset.fromId(budgetPresetId);
        if (preset == BudgetPreset.CUSTOM && customAmount != null) {
            return (int) (customAmount * 1.2); // ±20% 허용
        }
        return preset.getMaxAmount();
    }
}
