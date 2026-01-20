package com.ddalkkak.date.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * OpenAI API 장소 큐레이션 DTO
 */
public class PlaceCurationDto {

    /**
     * OpenAI API 요청
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
        private String role;
        private String content;
    }

    /**
     * OpenAI API 응답
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
     * 큐레이션 결과 (OpenAI가 반환하는 JSON 구조)
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CurationResult {
        /**
         * 데이트 적합도 점수 (1-10)
         */
        @JsonProperty("date_score")
        private Integer dateScore;

        /**
         * 무드 태그 (최대 3개)
         */
        @JsonProperty("mood_tags")
        private List<String> moodTags;

        /**
         * 1인당 예상 가격대
         */
        @JsonProperty("price_range")
        private String priceRange;

        /**
         * 추천 시간대
         */
        @JsonProperty("best_time")
        private String bestTime;

        /**
         * 한 줄 추천 이유
         */
        private String recommendation;
    }
}
