package com.ddalkkak.date.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Claude API 장소 큐레이션 DTO
 */
public class PlaceCurationDto {

    /**
     * Claude API 요청
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        private String model;
        @JsonProperty("max_tokens")
        private Integer maxTokens;
        private List<Message> messages;
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
     * Claude API 응답
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private String id;
        private String type;
        private String role;
        private List<Content> content;
        private String model;
        @JsonProperty("stop_reason")
        private String stopReason;
        @JsonProperty("stop_sequence")
        private String stopSequence;
        private Usage usage;
    }

    /**
     * 응답 컨텐츠
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Content {
        private String type;
        private String text;
    }

    /**
     * 토큰 사용량
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Usage {
        @JsonProperty("input_tokens")
        private Integer inputTokens;
        @JsonProperty("output_tokens")
        private Integer outputTokens;
    }

    /**
     * 큐레이션 결과 (Claude가 반환하는 JSON 구조)
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
