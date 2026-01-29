package com.ddalkkak.date.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

/**
 * JWT 토큰 생성 및 검증 유틸리티
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    private final JwtProperties jwtProperties;
    private SecretKey key;

    private static final String AUTHORITIES_KEY = "auth";

    /**
     * JWT 시크릿 키 초기화
     */
    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Access Token 생성
     *
     * @param authentication Spring Security Authentication 객체
     * @return JWT Access Token
     */
    public String createAccessToken(Authentication authentication) {
        String authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        long now = System.currentTimeMillis();
        Date validity = new Date(now + jwtProperties.getAccessTokenValidity());

        return Jwts.builder()
                .subject(authentication.getName())
                .claim(AUTHORITIES_KEY, authorities)
                .issuedAt(new Date(now))
                .expiration(validity)
                .signWith(key, Jwts.SIG.HS256)
                .compact();
    }

    /**
     * Refresh Token 생성
     *
     * @param authentication Spring Security Authentication 객체
     * @return JWT Refresh Token
     */
    public String createRefreshToken(Authentication authentication) {
        long now = System.currentTimeMillis();
        Date validity = new Date(now + jwtProperties.getRefreshTokenValidity());

        return Jwts.builder()
                .subject(authentication.getName())
                .issuedAt(new Date(now))
                .expiration(validity)
                .signWith(key, Jwts.SIG.HS256)
                .compact();
    }

    /**
     * JWT 토큰에서 Authentication 객체 추출
     *
     * @param token JWT 토큰
     * @return Spring Security Authentication 객체
     */
    public Authentication getAuthentication(String token) {
        Claims claims = parseClaims(token);

        Collection<? extends GrantedAuthority> authorities =
                Arrays.stream(claims.get(AUTHORITIES_KEY, String.class).split(","))
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());

        User principal = new User(claims.getSubject(), "", authorities);
        return new UsernamePasswordAuthenticationToken(principal, token, authorities);
    }

    /**
     * JWT 토큰 유효성 검증
     *
     * @param token JWT 토큰
     * @return 유효 여부
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            log.error("잘못된 JWT 서명입니다.");
        } catch (ExpiredJwtException e) {
            log.error("만료된 JWT 토큰입니다.");
        } catch (UnsupportedJwtException e) {
            log.error("지원되지 않는 JWT 토큰입니다.");
        } catch (IllegalArgumentException e) {
            log.error("JWT 토큰이 잘못되었습니다.");
        }
        return false;
    }

    /**
     * JWT 토큰에서 Claims 파싱
     *
     * @param token JWT 토큰
     * @return Claims
     */
    private Claims parseClaims(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }

    /**
     * JWT 토큰에서 사용자 ID 추출
     *
     * @param token JWT 토큰
     * @return 사용자 ID (kakaoId)
     */
    public String getUserIdFromToken(String token) {
        Claims claims = parseClaims(token);
        return claims.getSubject();
    }
}
