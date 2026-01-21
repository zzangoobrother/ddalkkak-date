package com.ddalkkak.date.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 데이트 유형
 */
@Getter
@RequiredArgsConstructor
public enum DateType {
    DINNER("dinner", "저녁 식사 데이트", "로맨틱한 분위기의 레스토랑과 야경 중심"),
    CAFE("cafe", "카페&디저트 데이트", "감성 카페와 디저트 맛집 투어"),
    CULTURE("culture", "문화·전시 데이트", "갤러리, 박물관, 공연장 중심"),
    ACTIVITY("activity", "액티비티·체험 데이트", "특별한 경험과 추억 만들기"),
    NIGHT("night", "야경·산책 데이트", "야경 명소와 로맨틱한 산책"),
    SPECIAL("special", "특별한 날 데이트", "기념일, 생일 등 특별한 날");

    private final String id;
    private final String name;
    private final String description;

    /**
     * ID로 DateType 찾기
     */
    public static DateType fromId(String id) {
        for (DateType type : values()) {
            if (type.getId().equals(id)) {
                return type;
            }
        }
        throw new IllegalArgumentException("유효하지 않은 데이트 유형 ID: " + id);
    }
}
