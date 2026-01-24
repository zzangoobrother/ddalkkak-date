package com.ddalkkak.date.service;

import com.ddalkkak.date.dto.CoursePromptContext;
import com.ddalkkak.date.dto.GeminiDto;
import com.ddalkkak.date.dto.LlmCourseGenerationDto;
import com.ddalkkak.date.entity.Place;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Google Gemini 기반 코스 생성 서비스
 */
@Slf4j
@Service
public class GeminiCourseService {

    private final WebClient webClient;
    private final String model;
    private final String apiKey;
    private final int timeoutSeconds;
    private final ObjectMapper objectMapper;

    public GeminiCourseService(
            @Value("${external.gemini.api-key}") String apiKey,
            @Value("${external.gemini.api-url}") String baseUrl,
            @Value("${external.gemini.model:gemini-1.5-flash}") String model,
            @Value("${external.gemini.timeout-seconds:10}") int timeoutSeconds
    ) {
        this.apiKey = apiKey;
        this.model = model;
        this.timeoutSeconds = timeoutSeconds;
        this.objectMapper = new ObjectMapper();
        this.webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("Content-Type", "application/json")
                .build();

        log.info("GeminiCourseService initialized - model: {}", model);
    }

    /**
     * Google Gemini를 통한 코스 생성
     *
     * @param context 프롬프트 컨텍스트
     * @return 코스 생성 결과
     */
    public LlmCourseGenerationDto.CourseGenerationResult generateCourse(CoursePromptContext context) {
        log.info("Gemini 코스 생성 시작 - 지역: {}, 데이트 유형: {}, 후보 장소 수: {}",
                context.getRegion().getName(),
                context.getDateType().getName(),
                context.getCandidatePlaces().size());

        long startTime = System.currentTimeMillis();

        try {
            // 시스템 + 사용자 프롬프트 통합 (Gemini는 하나의 프롬프트로 전달)
            String combinedPrompt = buildSystemPrompt() + "\n\n" + buildCoursePrompt(context);

            // Gemini API 요청 생성
            GeminiDto.Request request = new GeminiDto.Request(
                    List.of(new GeminiDto.Content(
                            "user",
                            List.of(new GeminiDto.Part(combinedPrompt))
                    )),
                    new GeminiDto.GenerationConfig(0.7, 2000, "application/json")
            );

            // API 키를 URI에 포함
            String uri = String.format("/v1beta/models/%s:generateContent?key=%s", model, apiKey);

            // Gemini API 호출
            GeminiDto.Response response = webClient.post()
                    .uri(uri)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(GeminiDto.Response.class)
                    .timeout(Duration.ofSeconds(timeoutSeconds))
                    .doOnError(error -> log.error("Gemini API 호출 실패: {}", error.getMessage()))
                    .onErrorResume(error -> Mono.empty())
                    .block();

            if (response != null && response.getCandidates() != null && !response.getCandidates().isEmpty()) {
                GeminiDto.Candidate candidate = response.getCandidates().get(0);

                // MAX_TOKENS 에러 체크
                if ("MAX_TOKENS".equals(candidate.getFinishReason())) {
                    log.error("응답이 토큰 제한으로 잘렸음");
                    return null;
                }

                String jsonResponse = candidate.getContent().getParts().get(0).getText();
                log.debug("Gemini API 응답: {}", jsonResponse);

                // 토큰 사용량 로그
                if (response.getUsageMetadata() != null) {
                    log.info("토큰 사용량 - Prompt: {}, Candidates: {}, Total: {}",
                            response.getUsageMetadata().getPromptTokenCount(),
                            response.getUsageMetadata().getCandidatesTokenCount(),
                            response.getUsageMetadata().getTotalTokenCount());
                }

                // JSON 추출 (Gemini가 JSON 외 텍스트를 포함할 수 있음)
                String cleanedJson = extractJsonFromResponse(jsonResponse);

                // JSON 파싱
                LlmCourseGenerationDto.CourseGenerationResult result = parseJsonResponse(cleanedJson);

                long duration = System.currentTimeMillis() - startTime;
                log.info("Gemini 코스 생성 성공 - 소요 시간: {}ms", duration);

                return result;
            }

            log.warn("Gemini API 응답이 비어있음");
            return null;

        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("Gemini 코스 생성 실패 - 소요 시간: {}ms, 에러: {}", duration, e.getMessage(), e);
            return null;
        }
    }

    /**
     * 응답에서 JSON 추출 (안전장치)
     */
    private String extractJsonFromResponse(String response) {
        int start = response.indexOf('{');
        int end = response.lastIndexOf('}');
        if (start >= 0 && end >= 0 && end > start) {
            return response.substring(start, end + 1);
        }
        return response;
    }

    /**
     * 시스템 프롬프트 생성
     */
    private String buildSystemPrompt() {
        return """
                당신은 서울 지역 Z세대 커플을 위한 데이트 코스 추천 전문가입니다.
                사용자가 선택한 지역, 데이트 유형, 예산에 맞춰 2-3개 장소로 구성된 최적의 코스를 추천합니다.

                핵심 원칙:
                1. 반드시 제공된 후보 장소 목록에서만 선택
                2. 동선 최적화: 이동 거리/시간 최소화
                3. 예산 준수: 총 예산 범위 내 (±10% 허용)
                4. 데이트 유형에 맞는 분위기 및 순서
                5. 총 소요 시간: 2-4시간 권장

                응답 형식: 반드시 JSON 형식만 사용
                """;
    }

    /**
     * 사용자 프롬프트 생성
     */
    private String buildCoursePrompt(CoursePromptContext context) {
        // 후보 장소 정보를 JSON 배열 형태로 변환
        String candidatePlacesJson = context.getCandidatePlaces().stream()
                .map(this::placeToJsonString)
                .collect(Collectors.joining(",\n  "));

        return String.format("""
                지역: %s
                데이트 유형: %s (%s)
                예산 범위: %,d원 - %,d원

                후보 장소 목록 (%d곳):
                [
                  %s
                ]

                요구사항:
                - 위 후보 장소 중 2-3개 선택 (place_id를 정확히 사용)
                - 각 장소의 예상 소요 시간과 비용 제시
                - 추천 메뉴/활동을 구체적으로 작성
                - 이동 수단과 시간 안내 (도보, 택시, 대중교통 등)
                - 동선을 고려한 순서 배치 (위도/경도 정보 활용)

                JSON 응답 스키마:
                {
                  "course_name": "코스 이름 (예: 홍대 감성 카페 데이트)",
                  "description": "코스 설명 (2-3 문장, 전체적인 분위기와 특징)",
                  "total_duration_minutes": 180,
                  "total_budget": 75000,
                  "places": [
                    {
                      "place_id": "장소 ID (반드시 후보 목록의 id 사용)",
                      "sequence": 1,
                      "duration_minutes": 90,
                      "estimated_cost": 40000,
                      "recommended_menu": "추천 메뉴 또는 활동",
                      "recommendation_reason": "이 장소를 선택한 이유 (1-2 문장)",
                      "transport_to_next": "다음 장소로 이동 방법 (예: 도보 5분)"
                    }
                  ]
                }
                """,
                context.getRegion().getName(),
                context.getDateType().getName(),
                context.getDateType().getDescription(),
                context.getMinBudget(),
                context.getMaxBudget(),
                context.getCandidatePlaces().size(),
                candidatePlacesJson
        );
    }

    /**
     * Place 엔티티를 JSON 문자열로 변환
     */
    private String placeToJsonString(Place place) {
        return String.format(
                "{ \"id\": \"%s\", \"name\": \"%s\", \"category\": \"%s\", \"rating\": %.1f, \"review_count\": %d, \"price_range\": \"%s\", \"address\": \"%s\", \"latitude\": %.6f, \"longitude\": %.6f }",
                place.getId(),
                escapeJson(place.getName()),
                escapeJson(place.getCategory()),
                place.getRating() != null ? place.getRating() : 0.0,
                place.getReviewCount() != null ? place.getReviewCount() : 0,
                escapeJson(place.getPriceRange() != null ? place.getPriceRange() : "정보 없음"),
                escapeJson(place.getAddress()),
                place.getLatitude() != null ? place.getLatitude() : 0.0,
                place.getLongitude() != null ? place.getLongitude() : 0.0
        );
    }

    /**
     * JSON 문자열 이스케이프
     */
    private String escapeJson(String str) {
        if (str == null) {
            return "";
        }
        return str.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }

    /**
     * Gemini 응답 JSON 파싱
     */
    private LlmCourseGenerationDto.CourseGenerationResult parseJsonResponse(String jsonResponse) {
        try {
            return objectMapper.readValue(jsonResponse, LlmCourseGenerationDto.CourseGenerationResult.class);
        } catch (JsonProcessingException e) {
            log.error("JSON 파싱 실패: {}", e.getMessage());
            log.debug("원본 JSON: {}", jsonResponse);
            return null;
        }
    }
}
