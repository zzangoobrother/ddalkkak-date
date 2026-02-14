package com.ddalkkak.date.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 피드백 제출 요청 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "피드백 제출 요청")
public class FeedbackRequest {

    /**
     * 전체 평점 (1~5)
     */
    @NotNull(message = "전체 평점은 필수입니다")
    @Min(value = 1, message = "평점은 1 이상이어야 합니다")
    @Max(value = 5, message = "평점은 5 이하여야 합니다")
    @Schema(description = "전체 평점 (1~5)", example = "4")
    private Integer overallRating;

    /**
     * 좋았던 점 옵션 ID 목록
     */
    @Schema(description = "좋았던 점 옵션 ID 목록", example = "[\"good_route\", \"good_places\"]")
    private List<String> positiveOptions;

    /**
     * 아쉬운 점 옵션 ID 목록
     */
    @Schema(description = "아쉬운 점 옵션 ID 목록", example = "[\"bad_price\"]")
    private List<String> negativeOptions;

    /**
     * 장소별 평가 목록
     */
    @Schema(description = "장소별 평가 목록")
    private List<PlaceRatingRequest> placeRatings;

    /**
     * 자유 텍스트 피드백
     */
    @Size(max = 100, message = "자유 텍스트는 100자 이내여야 합니다")
    @Schema(description = "자유 텍스트 피드백", example = "전반적으로 좋은 코스였어요!")
    private String freeText;

    /**
     * 장소별 평가 요청 DTO
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @Schema(description = "장소별 평가")
    public static class PlaceRatingRequest {

        @NotNull(message = "장소 ID는 필수입니다")
        @Schema(description = "장소 ID", example = "1")
        private Long placeId;

        @NotNull(message = "추천 여부는 필수입니다")
        @Schema(description = "추천 여부 (recommend / not_recommend)", example = "recommend")
        private String recommendation;
    }
}
