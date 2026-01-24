package com.ddalkkak.date.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Google Gemini API DTO
 */
public class GeminiDto {

    /**
     * Gemini API 요청
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        private List<Content> contents;
        private GenerationConfig generationConfig;
    }

    /**
     * 메시지 콘텐츠
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Content {
        private String role; // "user", "model"
        private List<Part> parts;
    }

    /**
     * 텍스트 조각
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Part {
        private String text;
    }

    /**
     * 생성 설정
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GenerationConfig {
        private Double temperature;
        private Integer maxOutputTokens;
        private String responseMimeType;
    }

    /**
     * Gemini API 응답
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private List<Candidate> candidates;
        private UsageMetadata usageMetadata;
    }

    /**
     * 응답 후보
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Candidate {
        private Content content;
        private String finishReason;
    }

    /**
     * 토큰 사용량
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UsageMetadata {
        private Integer promptTokenCount;
        private Integer candidatesTokenCount;
        private Integer totalTokenCount;
    }
}
