package com.ddalkkak.date.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 헬스체크 응답 DTO
 */
@Getter
@AllArgsConstructor
public class HealthCheckResponse {

    /**
     * 서비스 상태
     */
    private String status;

    /**
     * 서비스 이름
     */
    private String service;

    /**
     * 현재 시간
     */
    private LocalDateTime timestamp;

    /**
     * 버전 정보
     */
    private String version;

}
