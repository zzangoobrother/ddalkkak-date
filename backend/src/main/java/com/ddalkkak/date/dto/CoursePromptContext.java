package com.ddalkkak.date.dto;

import com.ddalkkak.date.entity.Place;
import com.ddalkkak.date.entity.Region;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

/**
 * LLM 프롬프트 생성을 위한 컨텍스트 데이터
 */
@Getter
@Builder
public class CoursePromptContext {
    /**
     * 지역 정보
     */
    private Region region;

    /**
     * 데이트 유형
     */
    private DateType dateType;

    /**
     * 최소 예산
     */
    private int minBudget;

    /**
     * 최대 예산
     */
    private int maxBudget;

    /**
     * 후보 장소 목록 (필터링된 상위 20개)
     */
    private List<Place> candidatePlaces;
}
