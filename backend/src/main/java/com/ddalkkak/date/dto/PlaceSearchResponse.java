package com.ddalkkak.date.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

/**
 * 장소 검색 응답 DTO
 */
@Getter
@AllArgsConstructor
@Builder
@Schema(description = "장소 검색 응답")
public class PlaceSearchResponse {

    /**
     * 장소 ID
     */
    @Schema(description = "장소 ID", example = "1")
    private Long id;

    /**
     * 장소 이름
     */
    @Schema(description = "장소 이름", example = "연남동 파스타 맛집")
    private String name;

    /**
     * 카테고리
     */
    @Schema(description = "카테고리", example = "이탈리안 레스토랑")
    private String category;

    /**
     * 주소
     */
    @Schema(description = "주소", example = "서울 마포구 연남동 123-45")
    private String address;

    /**
     * 위도
     */
    @Schema(description = "위도", example = "37.5665")
    private Double latitude;

    /**
     * 경도
     */
    @Schema(description = "경도", example = "126.9780")
    private Double longitude;

    /**
     * 지역 ID
     */
    @Schema(description = "지역 ID", example = "mapo")
    private String regionId;

    /**
     * 데이트 적합도 점수 (1-10)
     */
    @Schema(description = "데이트 적합도 점수 (1-10)", example = "8")
    private Integer dateScore;

    /**
     * 무드 태그 목록
     */
    @Schema(description = "무드 태그 목록", example = "[\"로맨틱\", \"조용한\", \"아늑한\"]")
    private List<String> moodTags;

    /**
     * 가격대
     */
    @Schema(description = "가격대", example = "30,000-50,000원")
    private String priceRange;

    /**
     * 추천 시간대
     */
    @Schema(description = "추천 시간대", example = "저녁")
    private String bestTime;

    /**
     * 평점 (0.0 ~ 5.0)
     */
    @Schema(description = "평점 (0.0 ~ 5.0)", example = "4.5")
    private Double rating;

    /**
     * 리뷰 수
     */
    @Schema(description = "리뷰 수", example = "128")
    private Integer reviewCount;

    /**
     * 추천 이유
     */
    @Schema(description = "추천 이유", example = "로맨틱한 분위기와 훌륭한 음식으로 데이트에 완벽합니다")
    private String recommendation;

    /**
     * 거리 (미터, 현재 위치 기준 검색 시에만)
     */
    @Schema(description = "거리 (미터)", example = "350")
    private Double distance;
}
