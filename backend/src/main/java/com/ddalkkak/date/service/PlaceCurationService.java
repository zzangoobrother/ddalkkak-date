package com.ddalkkak.date.service;

import com.ddalkkak.date.dto.KakaoPlaceDto;
import com.ddalkkak.date.dto.PlaceCurationDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

/**
 * AI 큐레이터 서비스 (OpenAI API 연동)
 */
@Slf4j
@Service
public class PlaceCurationService {

    private final WebClient webClient;
    private final String apiKey;
    private final ObjectMapper objectMapper;

    public PlaceCurationService(
            @Value("${external.openai.api-key}") String apiKey,
            @Value("${external.openai.api-url}") String baseUrl
    ) {
        this.apiKey = apiKey;
        this.objectMapper = new ObjectMapper();
        this.webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    /**
     * 장소 정보를 기반으로 AI 큐레이션 수행
     *
     * @param placeDocument Kakao API에서 받은 장소 정보
     * @return 큐레이션 결과
     */
    public PlaceCurationDto.CurationResult curatePlaceInfo(KakaoPlaceDto.Document placeDocument) {
        log.debug("AI 큐레이션 시작: placeName={}, category={}",
                placeDocument.getPlaceName(), placeDocument.getCategoryName());

        String prompt = buildCurationPrompt(placeDocument);

        PlaceCurationDto.Request request = new PlaceCurationDto.Request(
                "gpt-4o-mini",
                List.of(new PlaceCurationDto.Message("user", prompt)),
                0.7,
                new PlaceCurationDto.ResponseFormat("json_object")
        );

        try {
            PlaceCurationDto.Response response = webClient.post()
                    .uri("/chat/completions")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(PlaceCurationDto.Response.class)
                    .doOnError(error -> log.error("OpenAI API 호출 실패: {}", error.getMessage()))
                    .onErrorResume(error -> Mono.empty())
                    .block();

            if (response != null && response.getChoices() != null && !response.getChoices().isEmpty()) {
                String jsonResponse = response.getChoices().get(0).getMessage().getContent();
                log.debug("OpenAI API 응답: {}", jsonResponse);

                // JSON 파싱
                return parseJsonResponse(jsonResponse);
            }
        } catch (Exception e) {
            log.error("AI 큐레이션 실패: {}", e.getMessage(), e);
        }

        return null;
    }

    /**
     * 큐레이션 프롬프트 생성
     */
    private String buildCurationPrompt(KakaoPlaceDto.Document place) {
        return String.format("""
                당신은 데이트 장소 추천 전문가입니다. 다음 장소 정보를 분석하여 데이트 장소로서의 적합도를 JSON 형식으로 평가해주세요.

                **장소 정보:**
                - 이름: %s
                - 카테고리: %s
                - 주소: %s

                **분석 요청 사항:**
                아래 5가지 항목을 JSON 형식으로 분석해주세요. 반드시 JSON 형식으로만 응답해주세요.

                1. date_score: 데이트 장소로서의 적합도 점수 (1-10점)
                   - 분위기, 활동성, 접근성, 비용 등을 종합 고려

                2. mood_tags: 장소의 무드를 나타내는 해시태그 (최대 3개)
                   - 예시: ["로맨틱", "활기찬", "조용한", "아늑한", "트렌디"]

                3. price_range: 1인당 예상 가격대
                   - 예시: "10,000-20,000원", "20,000-30,000원", "30,000원 이상"

                4. best_time: 추천 시간대
                   - 예시: "점심", "오후", "저녁", "야간"

                5. recommendation: 한 줄 추천 이유 (50자 이내)
                   - 커플들에게 이 장소를 추천하는 핵심 이유

                **응답 형식 (반드시 이 형식으로만 응답):**
                {
                  "date_score": 8,
                  "mood_tags": ["로맨틱", "아늑한"],
                  "price_range": "15,000-25,000원",
                  "best_time": "저녁",
                  "recommendation": "감성적인 분위기에서 여유로운 대화를 나누기 좋은 곳"
                }
                """,
                place.getPlaceName(),
                place.getCategoryName(),
                place.getAddressName()
        );
    }

    /**
     * OpenAI 응답 JSON 파싱
     */
    private PlaceCurationDto.CurationResult parseJsonResponse(String jsonResponse) {
        try {
            // OpenAI는 이미 순수 JSON을 반환하므로 바로 파싱
            return objectMapper.readValue(jsonResponse, PlaceCurationDto.CurationResult.class);
        } catch (JsonProcessingException e) {
            log.error("JSON 파싱 실패: {}", e.getMessage());
            return null;
        }
    }
}
