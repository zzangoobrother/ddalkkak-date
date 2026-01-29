package com.ddalkkak.date.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 카카오 토큰 교환 요청 DTO
 * 프론트엔드에서 카카오 SDK로 받은 access token을 전달받음
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class KakaoTokenRequest {

    /**
     * 카카오 Access Token
     */
    @NotBlank(message = "카카오 Access Token은 필수입니다.")
    private String accessToken;
}
