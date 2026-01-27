package com.ddalkkak.date.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 코스 수정 요청 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "코스 수정 요청")
public class CourseUpdateRequest {

    /**
     * 수정할 장소 목록 (순서대로)
     */
    @NotEmpty(message = "최소 2개 이상의 장소가 필요합니다")
    @Schema(description = "장소 목록 (최소 2개, 최대 5개)")
    @Valid
    private List<PlaceUpdateDto> places;

    /**
     * 장소 수정 DTO
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "장소 수정 정보")
    public static class PlaceUpdateDto {

        /**
         * 장소 ID
         */
        @NotNull(message = "장소 ID는 필수입니다")
        @Schema(description = "장소 ID", example = "1")
        private Long placeId;

        /**
         * 순서 (1부터 시작)
         */
        @NotNull(message = "순서는 필수입니다")
        @Schema(description = "순서", example = "1")
        private Integer sequence;

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
         * 다음 장소까지 이동 방법
         */
        @Schema(description = "다음 장소까지 이동 방법", example = "도보 10분")
        private String transportToNext;
    }
}
