package com.ddalkkak.date.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * LLM 기반 코스 생성 API DTO
 * OpenAI 및 Claude API 공통 사용
 */
public class LlmCourseGenerationDto {

    /**
     * LLM API 요청
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        private String model;
        private List<Message> messages;
        private Double temperature;
        @JsonProperty("response_format")
        private ResponseFormat responseFormat;
        @JsonProperty("max_tokens")
        private Integer maxTokens;
    }

    /**
     * 응답 형식 지정
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResponseFormat {
        private String type; // "json_object"
    }

    /**
     * 메시지
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Message {
        private String role; // "system", "user", "assistant"
        private String content;
    }

    /**
     * LLM API 응답 (OpenAI)
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private String id;
        private String object;
        private Long created;
        private String model;
        private List<Choice> choices;
        private Usage usage;
    }

    /**
     * 선택지 (응답 옵션)
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Choice {
        private Integer index;
        private Message message;
        @JsonProperty("finish_reason")
        private String finishReason;
    }

    /**
     * 토큰 사용량
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Usage {
        @JsonProperty("prompt_tokens")
        private Integer promptTokens;
        @JsonProperty("completion_tokens")
        private Integer completionTokens;
        @JsonProperty("total_tokens")
        private Integer totalTokens;
    }

    /**
     * 코스 생성 결과 (LLM이 반환하는 JSON 구조)
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CourseGenerationResult {
        /**
         * 코스 이름
         */
        @JsonProperty("course_name")
        private String courseName;

        /**
         * 코스 설명 (2-3 문장)
         */
        private String description;

        /**
         * 총 소요 시간 (분)
         */
        @JsonProperty("total_duration_minutes")
        private Integer totalDurationMinutes;

        /**
         * 총 예산 (원)
         */
        @JsonProperty("total_budget")
        private Integer totalBudget;

        /**
         * 코스에 포함된 장소들
         */
        private List<PlaceInCourse> places;
    }

    /**
     * 코스 내 장소 정보
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PlaceInCourse {
        /**
         * 장소 ID (후보 장소 목록의 ID와 매칭)
         */
        @JsonProperty("place_id")
        private Long placeId;

        /**
         * 방문 순서 (1부터 시작)
         */
        private Integer sequence;

        /**
         * 예상 소요 시간 (분)
         */
        @JsonProperty("duration_minutes")
        private Integer durationMinutes;

        /**
         * 예상 비용 (원)
         */
        @JsonProperty("estimated_cost")
        private Integer estimatedCost;

        /**
         * 추천 메뉴 또는 활동
         */
        @JsonProperty("recommended_menu")
        private String recommendedMenu;

        /**
         * 추천 이유
         */
        @JsonProperty("recommendation_reason")
        private String recommendationReason;

        /**
         * 다음 장소로의 이동 방법 및 시간
         */
        @JsonProperty("transport_to_next")
        private String transportToNext;
    }
}
