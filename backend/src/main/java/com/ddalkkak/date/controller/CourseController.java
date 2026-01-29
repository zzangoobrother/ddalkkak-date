package com.ddalkkak.date.controller;

import com.ddalkkak.date.dto.CourseGenerationRequest;
import com.ddalkkak.date.dto.CourseResponse;
import com.ddalkkak.date.dto.CourseUpdateRequest;
import com.ddalkkak.date.service.CourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 코스 생성 API 컨트롤러
 */
@Slf4j
@Tag(name = "Course", description = "코스 생성 API")
@RestController
@RequestMapping("/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    /**
     * 코스 생성 (AI 추천)
     */
    @Operation(summary = "코스 생성", description = "사용자 입력(지역, 데이트 유형, 예산)을 기반으로 AI가 최적화된 데이트 코스를 생성합니다")
    @PostMapping("/generate")
    public ResponseEntity<CourseResponse> generateCourse(
            @Valid @RequestBody CourseGenerationRequest request) {

        long startTime = System.currentTimeMillis();

        log.info("코스 생성 요청 - 지역: {}, 데이트 유형: {}, 예산: {}",
                request.getRegionId(), request.getDateTypeId(), request.getBudgetPresetId());

        CourseResponse response = courseService.generateCourse(request);

        long duration = System.currentTimeMillis() - startTime;
        log.info("코스 생성 완료 - 코스 ID: {}, 소요 시간: {}ms", response.getCourseId(), duration);

        return ResponseEntity.ok(response);
    }

    /**
     * 코스 상세 조회
     */
    @Operation(summary = "코스 조회", description = "코스 ID로 코스 상세 정보를 조회합니다")
    @GetMapping("/{courseId}")
    public ResponseEntity<CourseResponse> getCourse(@PathVariable String courseId) {
        log.info("코스 조회 요청 - 코스 ID: {}", courseId);

        CourseResponse response = courseService.getCourseById(courseId);

        log.info("코스 조회 완료 - 코스 ID: {}, 장소 수: {}", courseId, response.getPlaces().size());

        return ResponseEntity.ok(response);
    }

    /**
     * 코스 저장
     * JWT 인증 필요
     */
    @Operation(summary = "코스 저장", description = "생성된 코스를 사용자에게 저장합니다 (로그인 필요)")
    @PostMapping("/{courseId}/save")
    public ResponseEntity<Void> saveCourse(
            @PathVariable String courseId,
            @Parameter(hidden = true) Authentication authentication) {

        String kakaoId = authentication.getName();
        log.info("코스 저장 요청 - 코스 ID: {}, 카카오 ID: {}", courseId, kakaoId);

        courseService.saveCourseForUser(courseId, kakaoId);

        log.info("코스 저장 완료 - 코스 ID: {}, 카카오 ID: {}", courseId, kakaoId);

        return ResponseEntity.ok().build();
    }

    /**
     * 저장된 코스 목록 조회
     * JWT 인증 필요
     */
    @Operation(summary = "저장된 코스 조회", description = "사용자가 저장한 코스 목록을 조회합니다 (로그인 필요)")
    @GetMapping("/saved")
    public ResponseEntity<List<CourseResponse>> getSavedCourses(
            @Parameter(hidden = true) Authentication authentication,
            @RequestParam(value = "status", required = false) String statusParam) {

        String kakaoId = authentication.getName();
        log.info("저장된 코스 조회 요청 - 카카오 ID: {}, 상태 필터: {}", kakaoId, statusParam);

        // status 파라미터를 CourseStatus로 변환
        com.ddalkkak.date.entity.CourseStatus status = null;
        if (statusParam != null && !statusParam.isBlank()) {
            try {
                status = com.ddalkkak.date.entity.CourseStatus.valueOf(statusParam.toUpperCase());
            } catch (IllegalArgumentException e) {
                log.warn("잘못된 status 값: {}", statusParam);
                return ResponseEntity.badRequest().build();
            }
        }

        List<CourseResponse> courses = courseService.getSavedCourses(kakaoId, status);

        log.info("저장된 코스 조회 완료 - 카카오 ID: {}, 코스 수: {}", kakaoId, courses.size());

        return ResponseEntity.ok(courses);
    }

    /**
     * 코스 확정
     * JWT 인증 필요
     */
    @Operation(summary = "코스 확정", description = "생성된 코스를 최종 확정합니다 (로그인 필요)")
    @PostMapping("/{courseId}/confirm")
    public ResponseEntity<Void> confirmCourse(
            @PathVariable String courseId,
            @Parameter(hidden = true) Authentication authentication) {

        String kakaoId = authentication.getName();
        log.info("코스 확정 요청 - 코스 ID: {}, 카카오 ID: {}", courseId, kakaoId);

        courseService.confirmCourse(courseId, kakaoId);

        log.info("코스 확정 완료 - 코스 ID: {}, 카카오 ID: {}", courseId, kakaoId);

        return ResponseEntity.ok().build();
    }

    /**
     * 코스 수정 (SCRUM-26)
     * 장소 순서 변경, 교체, 추가, 삭제 지원
     */
    @Operation(summary = "코스 수정", description = "코스의 장소 순서를 변경하거나 장소를 교체/추가/삭제합니다 (최소 2개, 최대 5개)")
    @PutMapping("/{courseId}")
    public ResponseEntity<CourseResponse> updateCourse(
            @PathVariable String courseId,
            @Valid @RequestBody CourseUpdateRequest request) {

        log.info("코스 수정 요청 - 코스 ID: {}, 장소 수: {}", courseId, request.getPlaces().size());

        CourseResponse response = courseService.updateCourse(courseId, request);

        log.info("코스 수정 완료 - 코스 ID: {}, 장소 수: {}", courseId, response.getPlaces().size());

        return ResponseEntity.ok(response);
    }
}
