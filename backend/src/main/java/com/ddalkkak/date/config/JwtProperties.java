package com.ddalkkak.date.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * JWT 설정값
 * application.yml의 jwt 설정을 바인딩
 */
@Configuration
@ConfigurationProperties(prefix = "jwt")
@Getter
@Setter
public class JwtProperties {

    /**
     * JWT 시크릿 키
     */
    private String secret;

    /**
     * Access Token 유효 시간 (밀리초)
     */
    private Long accessTokenValidity;

    /**
     * Refresh Token 유효 시간 (밀리초)
     */
    private Long refreshTokenValidity;
}
