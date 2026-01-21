package com.ddalkkak.date.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

/**
 * 에러 응답 DTO
 */
@Getter
@AllArgsConstructor
@Builder
@Schema(description = "에러 응답")
public class ErrorResponse {

    /**
     * 에러 코드
     */
    @Schema(description = "에러 코드", example = "INVALID_REQUEST")
    private String code;

    /**
     * 에러 메시지
     */
    @Schema(description = "에러 메시지", example = "유효하지 않은 요청입니다")
    private String message;

    /**
     * 상세 정보 (선택적)
     */
    @Schema(description = "상세 정보", example = "지역 ID는 필수입니다")
    private String detail;

    /**
     * 타임스탬프
     */
    @Schema(description = "타임스탬프", example = "1642345678000")
    private Long timestamp;
}
