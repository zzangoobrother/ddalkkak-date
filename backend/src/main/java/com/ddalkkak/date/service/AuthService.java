package com.ddalkkak.date.service;

import com.ddalkkak.date.config.JwtTokenProvider;
import com.ddalkkak.date.dto.KakaoAuthResponse;
import com.ddalkkak.date.dto.KakaoOAuth2UserInfo;
import com.ddalkkak.date.dto.TokenResponse;
import com.ddalkkak.date.dto.UserResponse;
import com.ddalkkak.date.entity.User;
import com.ddalkkak.date.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

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
    private final KakaoApiService kakaoApiService;

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
     * 카카오 Access Token으로 JWT 토큰 발급
     * 프론트엔드에서 카카오 SDK로 받은 access token을 백엔드 JWT로 교환
     *
     * @param kakaoAccessToken 카카오 Access Token
     * @return 사용자 정보 및 JWT 토큰
     */
    @Transactional
    public KakaoAuthResponse exchangeKakaoToken(String kakaoAccessToken) {
        // 1. 카카오 API로 사용자 정보 조회
        KakaoOAuth2UserInfo kakaoUserInfo = kakaoApiService.getUserInfo(kakaoAccessToken);
        String kakaoId = kakaoUserInfo.getKakaoId();

        log.info("카카오 토큰 교환 시작: kakaoId={}", kakaoId);

        // 2. 사용자 정보 저장 또는 업데이트
        User user = userRepository.findByKakaoId(kakaoId)
                .map(existingUser -> {
                    // 기존 사용자: 프로필 정보 업데이트
                    existingUser.updateProfile(
                            kakaoUserInfo.getNickname(),
                            kakaoUserInfo.getEmail(),
                            kakaoUserInfo.getProfileImageUrl()
                    );
                    existingUser.updateLastLoginAt();
                    log.info("기존 사용자 정보 업데이트: kakaoId={}", kakaoId);
                    return existingUser;
                })
                .orElseGet(() -> {
                    // 신규 사용자: 회원가입
                    User newUser = User.builder()
                            .kakaoId(kakaoId)
                            .email(kakaoUserInfo.getEmail())
                            .nickname(kakaoUserInfo.getNickname())
                            .profileImageUrl(kakaoUserInfo.getProfileImageUrl())
                            .build();
                    newUser.updateLastLoginAt();
                    log.info("신규 사용자 등록: kakaoId={}", kakaoId);
                    return newUser;
                });

        User savedUser = userRepository.save(user);

        // 3. JWT 토큰 생성
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                kakaoId,
                null,
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER"))
        );

        String accessToken = jwtTokenProvider.createAccessToken(authentication);
        String refreshToken = jwtTokenProvider.createRefreshToken(authentication);

        // 4. 응답 생성
        UserResponse userResponse = UserResponse.from(savedUser);
        TokenResponse tokenResponse = TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(3600L)  // 1시간 (초 단위)
                .build();

        log.info("카카오 토큰 교환 완료: kakaoId={}, userId={}", kakaoId, savedUser.getId());

        return KakaoAuthResponse.builder()
                .user(userResponse)
                .tokens(tokenResponse)
                .build();
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
