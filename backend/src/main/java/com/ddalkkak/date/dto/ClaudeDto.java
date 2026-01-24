package com.ddalkkak.date.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Anthropic Claude API DTO
 */
public class ClaudeDto {

    /**
     * Claude API 요청
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        private String model;
        private List<Message> messages;
        @JsonProperty("max_tokens")
        private Integer maxTokens;
        private Double temperature;
        private String system; // 시스템 프롬프트는 별도 필드
    }

    /**
     * 메시지
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Message {
        private String role; // "user", "assistant"
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
     * 응답 콘텐츠
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Content {
        private String type; // "text"
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
}
