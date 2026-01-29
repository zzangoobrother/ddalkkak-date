package com.ddalkkak.date.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 카카오 토큰 교환 응답 DTO
 * 사용자 정보와 JWT 토큰을 함께 반환
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KakaoAuthResponse {

    /**
     * 사용자 정보
     */
    private UserResponse user;

    /**
     * JWT 토큰 정보
     */
    private TokenResponse tokens;
}
