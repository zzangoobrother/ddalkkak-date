package com.ddalkkak.date.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

/**
 * 코스 내 장소 정보 DTO
 */
@Getter
@AllArgsConstructor
@Builder
@Schema(description = "코스 내 장소 정보")
public class PlaceInCourseDto {

    /**
     * 장소 ID
     */
    @Schema(description = "장소 ID", example = "1")
    private Long placeId;

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
     * 예상 소요 시간 (분)
     */
    @Schema(description = "예상 소요 시간 (분)", example = "90")
    private Integer durationMinutes;

    /**
     * 예상 비용 (원)
     */
    @Schema(description = "예상 비용 (원)", example = "35000")
    private Integer estimatedCost;

    /**
     * 추천 메뉴/활동
     */
    @Schema(description = "추천 메뉴/활동", example = "트러플 크림 파스타")
    private String recommendedMenu;

    /**
     * 순서 (1, 2, 3)
     */
    @Schema(description = "순서", example = "1")
    private Integer sequence;

    /**
     * 다음 장소까지 이동 방법
     */
    @Schema(description = "다음 장소까지 이동 방법", example = "도보 10분")
    private String transportToNext;

    /**
     * 장소 이미지 URL 목록 (최대 3장)
     */
    @Schema(description = "장소 이미지 URL 목록 (최대 3장)",
            example = "[\"https://example.com/image1.jpg\", \"https://example.com/image2.jpg\", \"https://example.com/image3.jpg\"]")
    private List<String> imageUrls;

    /**
     * 영업시간
     */
    @Schema(description = "영업시간", example = "매일 11:00 - 22:00")
    private String openingHours;

    /**
     * 예약 필요 여부
     */
    @Schema(description = "예약 필요 여부", example = "false")
    private Boolean needsReservation;

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
}
