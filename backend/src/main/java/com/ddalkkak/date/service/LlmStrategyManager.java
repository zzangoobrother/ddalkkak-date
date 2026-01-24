package com.ddalkkak.date.service;

import com.ddalkkak.date.dto.CoursePromptContext;
import com.ddalkkak.date.dto.LlmCourseGenerationDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * LLM 전략 관리자
 * Primary (OpenAI) → Fallback 1 (Claude) → Fallback 2 (Template)
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class LlmStrategyManager {

    private final OpenAiCourseService openAiCourseService;
    private final ClaudeLlmService claudeLlmService;

    /**
     * LLM을 통한 코스 생성 (Fallback 전략 적용)
     *
     * @param context 프롬프트 컨텍스트
     * @return 코스 생성 결과 (null이면 모든 LLM 실패)
     */
    public LlmCourseGenerationDto.CourseGenerationResult generateCourseWithFallback(
            CoursePromptContext context
    ) {
        // 1. Primary: OpenAI GPT-4
        log.info("Primary LLM 시도: OpenAI GPT-4");
        try {
            LlmCourseGenerationDto.CourseGenerationResult result =
                    openAiCourseService.generateCourse(context);

            if (result != null) {
                log.info("OpenAI 코스 생성 성공");
                return result;
            }

            log.warn("OpenAI 응답이 null, Fallback으로 전환");
        } catch (Exception e) {
            log.warn("OpenAI 코스 생성 실패, Fallback으로 전환: {}", e.getMessage());
        }

        // 2. Fallback 1: Claude
        log.info("Fallback 1 시도: Claude");
        try {
            LlmCourseGenerationDto.CourseGenerationResult result =
                    claudeLlmService.generateCourse(context);

            if (result != null) {
                log.info("Claude 코스 생성 성공");
                return result;
            }

            log.warn("Claude 응답이 null, 템플릿으로 전환");
        } catch (Exception e) {
            log.warn("Claude 코스 생성 실패, 템플릿으로 전환: {}", e.getMessage());
        }

        // 3. Fallback 2: Template (CourseService에서 처리)
        log.warn("모든 LLM 실패, 템플릿 사용 필요");
        return null;
    }

    /**
     * 검증을 포함한 코스 생성 (검증 실패 시 다음 LLM으로 Fallback)
     *
     * @param context 프롬프트 컨텍스트
     * @param validator 검증 함수 (결과를 받아 검증, 통과하면 true)
     * @return 검증을 통과한 코스 생성 결과 (null이면 모든 LLM 실패 또는 검증 실패)
     */
    public LlmCourseGenerationDto.CourseGenerationResult generateCourseWithValidation(
            CoursePromptContext context,
            java.util.function.Predicate<LlmCourseGenerationDto.CourseGenerationResult> validator
    ) {
        // 1. Primary: OpenAI GPT-4
        log.info("Primary LLM 시도: OpenAI GPT-4");
        try {
            LlmCourseGenerationDto.CourseGenerationResult result =
                    openAiCourseService.generateCourse(context);

            if (result != null && validator.test(result)) {
                log.info("OpenAI 코스 생성 성공 및 검증 통과");
                return result;
            }

            log.warn("OpenAI 응답 검증 실패, Fallback으로 전환");
        } catch (Exception e) {
            log.warn("OpenAI 코스 생성 실패, Fallback으로 전환: {}", e.getMessage());
        }

        // 2. Fallback 1: Claude
        log.info("Fallback 1 시도: Claude");
        try {
            LlmCourseGenerationDto.CourseGenerationResult result =
                    claudeLlmService.generateCourse(context);

            if (result != null && validator.test(result)) {
                log.info("Claude 코스 생성 성공 및 검증 통과");
                return result;
            }

            log.warn("Claude 응답 검증 실패, 템플릿으로 전환");
        } catch (Exception e) {
            log.warn("Claude 코스 생성 실패, 템플릿으로 전환: {}", e.getMessage());
        }

        // 3. Fallback 2: Template (CourseService에서 처리)
        log.warn("모든 LLM 실패 또는 검증 실패, 템플릿 사용 필요");
        return null;
    }
}
