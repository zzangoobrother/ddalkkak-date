package com.ddalkkak.date.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

/**
 * 코스 생성 응답 DTO
 */
@Getter
@AllArgsConstructor
@Builder
@Schema(description = "생성된 코스 정보")
public class CourseResponse {

    /**
     * 코스 ID (생성 시각 기반 임시 ID)
     */
    @Schema(description = "코스 ID", example = "course-1234567890")
    private String courseId;

    /**
     * 코스 이름
     */
    @Schema(description = "코스 이름", example = "연남동 로맨틱 디너 코스")
    private String courseName;

    /**
     * 지역 ID
     */
    @Schema(description = "지역 ID", example = "mapo")
    private String regionId;

    /**
     * 지역 이름
     */
    @Schema(description = "지역 이름", example = "마포·홍대")
    private String regionName;

    /**
     * 데이트 유형 ID
     */
    @Schema(description = "데이트 유형 ID", example = "dinner")
    private String dateTypeId;

    /**
     * 데이트 유형 이름
     */
    @Schema(description = "데이트 유형 이름", example = "저녁 식사 데이트")
    private String dateTypeName;

    /**
     * 총 소요 시간 (분)
     */
    @Schema(description = "총 소요 시간 (분)", example = "180")
    private Integer totalDurationMinutes;

    /**
     * 총 예산 (원)
     */
    @Schema(description = "총 예산 (원)", example = "85000")
    private Integer totalBudget;

    /**
     * 코스 설명
     */
    @Schema(description = "코스 설명", example = "연남동의 감성 넘치는 레스토랑에서 로맨틱한 저녁 식사를 즐긴 후, 루프탑 바에서 야경을 감상하는 코스입니다.")
    private String description;

    /**
     * 장소 목록 (순서대로)
     */
    @Schema(description = "장소 목록")
    private List<PlaceInCourseDto> places;

    /**
     * 생성 시각 (timestamp)
     */
    @Schema(description = "생성 시각", example = "1642345678000")
    private Long createdAt;
}
