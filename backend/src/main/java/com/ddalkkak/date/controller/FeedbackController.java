package com.ddalkkak.date.controller;

import com.ddalkkak.date.dto.FeedbackRequest;
import com.ddalkkak.date.dto.FeedbackResponse;
import com.ddalkkak.date.dto.FeedbackStatsResponse;
import com.ddalkkak.date.service.FeedbackService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * 피드백 API 컨트롤러
 */
@Slf4j
@Tag(name = "Feedback", description = "피드백 수집 API")
@RestController
@RequestMapping("/courses/{courseId}/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    /**
     * 피드백 제출
     */
    @Operation(summary = "피드백 제출", description = "코스에 대한 피드백을 제출합니다 (로그인 필요)")
    @PostMapping
    public ResponseEntity<FeedbackResponse> submitFeedback(
            @PathVariable String courseId,
            @Valid @RequestBody FeedbackRequest request,
            @Parameter(hidden = true) Authentication authentication) {

        String kakaoId = authentication.getName();
        log.info("피드백 제출 요청 - 코스 ID: {}, 카카오 ID: {}", courseId, kakaoId);

        FeedbackResponse response = feedbackService.submitFeedback(courseId, kakaoId, request);

        log.info("피드백 제출 완료 - 피드백 ID: {}", response.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 본인 피드백 조회
     */
    @Operation(summary = "피드백 조회", description = "본인이 제출한 피드백을 조회합니다 (로그인 필요)")
    @GetMapping
    public ResponseEntity<FeedbackResponse> getFeedback(
            @PathVariable String courseId,
            @Parameter(hidden = true) Authentication authentication) {

        String kakaoId = authentication.getName();
        log.info("피드백 조회 요청 - 코스 ID: {}, 카카오 ID: {}", courseId, kakaoId);

        FeedbackResponse response = feedbackService.getFeedback(courseId, kakaoId);
        return ResponseEntity.ok(response);
    }

    /**
     * 피드백 통계 조회 (공개)
     */
    @Operation(summary = "피드백 통계 조회", description = "코스의 피드백 통계를 조회합니다 (인증 불필요)")
    @GetMapping("/stats")
    public ResponseEntity<FeedbackStatsResponse> getFeedbackStats(
            @PathVariable String courseId) {

        log.info("피드백 통계 조회 요청 - 코스 ID: {}", courseId);

        FeedbackStatsResponse response = feedbackService.getFeedbackStats(courseId);
        return ResponseEntity.ok(response);
    }
}
