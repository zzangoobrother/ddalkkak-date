package com.ddalkkak.date.controller;

import com.ddalkkak.date.dto.HealthCheckResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

/**
 * 헬스체크 API 컨트롤러
 */
@Tag(name = "Health Check", description = "서비스 상태 확인 API")
@RestController
@RequestMapping("/health")
public class HealthCheckController {

    @Operation(summary = "헬스체크", description = "서비스 상태 및 정보를 확인합니다")
    @GetMapping
    public ResponseEntity<HealthCheckResponse> healthCheck() {
        HealthCheckResponse response = new HealthCheckResponse(
                "UP",
                "date-ddalkkak",
                LocalDateTime.now(),
                "0.0.1-SNAPSHOT"
        );

        return ResponseEntity.ok(response);
    }

}
