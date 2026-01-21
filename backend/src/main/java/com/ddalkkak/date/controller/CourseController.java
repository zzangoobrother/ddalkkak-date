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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
