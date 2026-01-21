package com.ddalkkak.date.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 예산 프리셋
 */
@Getter
@RequiredArgsConstructor
public enum BudgetPreset {
    UNDER_30K("under30k", "3만원 이하", "부담없이", 0, 30000),
    RANGE_30K_50K("30k-50k", "3-5만원", "가볍게", 30000, 50000),
    RANGE_50K_100K("50k-100k", "5-10만원", "여유롭게", 50000, 100000),
    RANGE_100K_150K("100k-150k", "10-15만원", "특별하게", 100000, 150000),
    CUSTOM("custom", "직접 입력", "원하는 만큼", 0, Integer.MAX_VALUE);

    private final String id;
    private final String label;
    private final String tagline;
    private final int minAmount;
    private final int maxAmount;

    /**
     * ID로 BudgetPreset 찾기
     */
    public static BudgetPreset fromId(String id) {
        for (BudgetPreset preset : values()) {
            if (preset.getId().equals(id)) {
                return preset;
            }
        }
        throw new IllegalArgumentException("유효하지 않은 예산 프리셋 ID: " + id);
    }
}
