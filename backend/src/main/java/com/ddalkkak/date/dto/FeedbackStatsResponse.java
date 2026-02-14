package com.ddalkkak.date.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.Map;

/**
 * 피드백 통계 응답 DTO
 */
@Getter
@AllArgsConstructor
@Builder
@Schema(description = "피드백 통계 정보")
public class FeedbackStatsResponse {

    @Schema(description = "코스 ID", example = "course-1234567890")
    private String courseId;

    @Schema(description = "총 피드백 수", example = "10")
    private Long totalCount;

    @Schema(description = "평균 평점", example = "4.2")
    private Double averageRating;

    @Schema(description = "평점 분포 (1~5별 개수)")
    private Map<Integer, Long> ratingDistribution;

    @Schema(description = "TOP 좋았던 점 옵션 (최대 5개)")
    private List<OptionCount> topPositiveOptions;

    @Schema(description = "TOP 아쉬운 점 옵션 (최대 5개)")
    private List<OptionCount> topNegativeOptions;

    @Schema(description = "장소별 추천 통계")
    private List<PlaceRecommendationStats> placeStats;

    /**
     * 옵션별 선택 횟수
     */
    @Getter
    @AllArgsConstructor
    @Builder
    @Schema(description = "옵션별 선택 횟수")
    public static class OptionCount {

        @Schema(description = "옵션 ID", example = "good_route")
        private String optionId;

        @Schema(description = "선택 횟수", example = "7")
        private Long count;
    }

    /**
     * 장소별 추천 통계
     */
    @Getter
    @AllArgsConstructor
    @Builder
    @Schema(description = "장소별 추천 통계")
    public static class PlaceRecommendationStats {

        @Schema(description = "장소 ID", example = "1")
        private Long placeId;

        @Schema(description = "추천 수", example = "8")
        private Long recommendCount;

        @Schema(description = "비추천 수", example = "2")
        private Long notRecommendCount;
    }
}
