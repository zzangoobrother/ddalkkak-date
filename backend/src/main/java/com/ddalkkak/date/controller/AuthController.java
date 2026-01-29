package com.ddalkkak.date.controller;

import com.ddalkkak.date.dto.KakaoAuthResponse;
import com.ddalkkak.date.dto.KakaoTokenRequest;
import com.ddalkkak.date.dto.TokenResponse;
import com.ddalkkak.date.dto.UserResponse;
import com.ddalkkak.date.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * 인증 관련 API 컨트롤러
 * OAuth2 로그인, JWT 토큰 관리, 사용자 정보 조회
 */
@Slf4j
@Tag(name = "Auth", description = "인증 API")
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * 카카오 Access Token으로 JWT 토큰 발급
     * 프론트엔드에서 카카오 SDK로 받은 access token을 백엔드 JWT로 교환
     */
    @Operation(
            summary = "카카오 토큰 교환",
            description = "카카오 Access Token을 받아서 백엔드 JWT 토큰을 발급합니다. 신규 사용자는 자동으로 회원가입됩니다."
    )
    @PostMapping("/kakao/token")
    public ResponseEntity<KakaoAuthResponse> exchangeKakaoToken(
            @Valid @RequestBody KakaoTokenRequest request
    ) {
        log.info("카카오 토큰 교환 요청");

        KakaoAuthResponse response = authService.exchangeKakaoToken(request.getAccessToken());

        log.info("카카오 토큰 교환 완료: userId={}", response.getUser().getId());
        return ResponseEntity.ok(response);
    }

    /**
     * 현재 로그인한 사용자 정보 조회
     */
    @Operation(summary = "현재 사용자 정보 조회", description = "JWT 토큰으로 인증된 사용자의 정보를 조회합니다.")
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(
            @Parameter(hidden = true) Authentication authentication
    ) {
        log.info("현재 사용자 정보 조회: user={}", authentication.getName());
        UserResponse userResponse = authService.getCurrentUser(authentication);
        return ResponseEntity.ok(userResponse);
    }

    /**
     * Access Token 갱신
     */
    @Operation(summary = "Access Token 갱신", description = "Refresh Token으로 새로운 Access Token을 발급받습니다.")
    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refreshToken(
            @Parameter(description = "Refresh Token", required = true)
            @RequestHeader("Authorization") String refreshToken
    ) {
        log.info("Access Token 갱신 요청");

        // "Bearer " 제거
        if (refreshToken.startsWith("Bearer ")) {
            refreshToken = refreshToken.substring(7);
        }

        TokenResponse tokenResponse = authService.refreshAccessToken(refreshToken);
        return ResponseEntity.ok(tokenResponse);
    }

    /**
     * 로그아웃
     * 클라이언트 측에서 토큰을 삭제하도록 안내
     */
    @Operation(summary = "로그아웃", description = "로그아웃 처리 (클라이언트 측 토큰 삭제 필요)")
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @Parameter(hidden = true) Authentication authentication
    ) {
        log.info("로그아웃: user={}", authentication.getName());
        // JWT는 Stateless하므로 서버 측에서 별도 처리 없음
        // 클라이언트에서 토큰을 삭제하면 됨
        return ResponseEntity.ok().build();
    }
}
