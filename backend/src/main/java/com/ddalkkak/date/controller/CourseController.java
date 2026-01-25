package com.ddalkkak.date.controller;

import com.ddalkkak.date.dto.CourseGenerationRequest;
import com.ddalkkak.date.dto.CourseResponse;
import com.ddalkkak.date.service.CourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
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
     * 임시: 헤더로 userId를 받음 (SCRUM-10에서 인증 구현 예정)
     */
    @Operation(summary = "코스 저장", description = "생성된 코스를 사용자에게 저장합니다")
    @PostMapping("/{courseId}/save")
    public ResponseEntity<Void> saveCourse(
            @PathVariable String courseId,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {

        // 임시: userId가 없으면 에러 반환
        if (userId == null || userId.isBlank()) {
            log.warn("코스 저장 실패 - userId 없음");
            return ResponseEntity.badRequest().build();
        }

        log.info("코스 저장 요청 - 코스 ID: {}, 사용자 ID: {}", courseId, userId);

        courseService.saveCourseForUser(courseId, userId);

        log.info("코스 저장 완료 - 코스 ID: {}, 사용자 ID: {}", courseId, userId);

        return ResponseEntity.ok().build();
    }

    /**
     * 저장된 코스 목록 조회
     * 임시: 헤더로 userId를 받음 (SCRUM-10에서 인증 구현 예정)
     */
    @Operation(summary = "저장된 코스 조회", description = "사용자가 저장한 코스 목록을 조회합니다")
    @GetMapping("/saved")
    public ResponseEntity<List<CourseResponse>> getSavedCourses(
            @RequestHeader(value = "X-User-Id", required = false) String userId) {

        // 임시: userId가 없으면 빈 리스트 반환
        if (userId == null || userId.isBlank()) {
            log.warn("저장된 코스 조회 실패 - userId 없음");
            return ResponseEntity.ok(List.of());
        }

        log.info("저장된 코스 조회 요청 - 사용자 ID: {}", userId);

        List<CourseResponse> courses = courseService.getSavedCourses(userId);

        log.info("저장된 코스 조회 완료 - 사용자 ID: {}, 코스 수: {}", userId, courses.size());

        return ResponseEntity.ok(courses);
    }
}
