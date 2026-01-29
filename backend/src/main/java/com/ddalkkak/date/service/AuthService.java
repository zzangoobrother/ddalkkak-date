package com.ddalkkak.date.service;

import com.ddalkkak.date.config.JwtTokenProvider;
import com.ddalkkak.date.dto.TokenResponse;
import com.ddalkkak.date.dto.UserResponse;
import com.ddalkkak.date.entity.User;
import com.ddalkkak.date.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 인증 서비스
 * JWT 토큰 발급, 갱신, 사용자 정보 조회 등의 인증 관련 비즈니스 로직 처리
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * 현재 로그인한 사용자 정보 조회
     *
     * @param authentication Spring Security Authentication 객체
     * @return 사용자 정보
     */
    public UserResponse getCurrentUser(Authentication authentication) {
        String kakaoId = authentication.getName();
        User user = userRepository.findByKakaoId(kakaoId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + kakaoId));

        return UserResponse.from(user);
    }

    /**
     * Refresh Token으로 Access Token 갱신
     *
     * @param refreshToken Refresh Token
     * @return 새로운 Access Token 및 Refresh Token
     */
    public TokenResponse refreshAccessToken(String refreshToken) {
        // 1. Refresh Token 유효성 검증
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new IllegalArgumentException("유효하지 않은 Refresh Token입니다.");
        }

        // 2. Refresh Token에서 사용자 정보 추출
        Authentication authentication = jwtTokenProvider.getAuthentication(refreshToken);

        // 3. 새로운 Access Token 및 Refresh Token 생성
        String newAccessToken = jwtTokenProvider.createAccessToken(authentication);
        String newRefreshToken = jwtTokenProvider.createRefreshToken(authentication);

        return TokenResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .expiresIn(3600L)  // 1시간 (초 단위)
                .build();
    }
}
