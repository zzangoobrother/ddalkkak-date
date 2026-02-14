package com.ddalkkak.date.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

/**
 * 피드백 응답 DTO
 */
@Getter
@AllArgsConstructor
@Builder
@Schema(description = "피드백 정보")
public class FeedbackResponse {

    @Schema(description = "피드백 ID", example = "1")
    private Long id;

    @Schema(description = "코스 ID", example = "course-1234567890")
    private String courseId;

    @Schema(description = "전체 평점 (1~5)", example = "4")
    private Integer overallRating;

    @Schema(description = "좋았던 점 옵션 목록")
    private List<String> positiveOptions;

    @Schema(description = "아쉬운 점 옵션 목록")
    private List<String> negativeOptions;

    @Schema(description = "장소별 평가 목록")
    private List<PlaceRatingResponse> placeRatings;

    @Schema(description = "자유 텍스트 피드백")
    private String freeText;

    @Schema(description = "생성 시각 (timestamp)", example = "1642345678000")
    private Long createdAt;

    /**
     * 장소별 평가 응답 DTO
     */
    @Getter
    @AllArgsConstructor
    @Builder
    @Schema(description = "장소별 평가 정보")
    public static class PlaceRatingResponse {

        @Schema(description = "장소 ID", example = "1")
        private Long placeId;

        @Schema(description = "추천 여부", example = "RECOMMEND")
        private String recommendation;
    }
}
