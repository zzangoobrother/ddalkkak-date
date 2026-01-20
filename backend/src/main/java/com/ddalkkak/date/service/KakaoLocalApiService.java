package com.ddalkkak.date.service;

import com.ddalkkak.date.dto.KakaoPlaceDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

/**
 * Kakao Local API 연동 서비스
 */
@Slf4j
@Service
public class KakaoLocalApiService {

    private final WebClient webClient;
    private final String apiKey;

    public KakaoLocalApiService(
            @Value("${external.kakao.api-key}") String apiKey,
            @Value("${external.kakao.local-api-url}") String baseUrl
    ) {
        this.apiKey = apiKey;
        this.webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("Authorization", "KakaoAK " + apiKey)
                .build();
    }

    /**
     * 카테고리로 장소 검색
     *
     * @param categoryGroupCode 카테고리 그룹 코드 (CE7: 카페, FD6: 음식점, etc.)
     * @param x                 중심 X 좌표 (경도)
     * @param y                 중심 Y 좌표 (위도)
     * @param radius            반경 (미터 단위, 최대 20000)
     * @param page              페이지 번호 (1~45)
     * @param size              한 페이지에 보여질 문서의 개수 (1~15)
     * @return 장소 검색 결과
     */
    public KakaoPlaceDto.Response searchPlacesByCategory(
            String categoryGroupCode,
            String x,
            String y,
            Integer radius,
            Integer page,
            Integer size
    ) {
        log.debug("Kakao Local API - 카테고리 검색: category={}, x={}, y={}, radius={}, page={}, size={}",
                categoryGroupCode, x, y, radius, page, size);

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search/category.json")
                        .queryParam("category_group_code", categoryGroupCode)
                        .queryParam("x", x)
                        .queryParam("y", y)
                        .queryParam("radius", radius)
                        .queryParam("page", page)
                        .queryParam("size", size)
                        .build())
                .retrieve()
                .bodyToMono(KakaoPlaceDto.Response.class)
                .doOnError(error -> log.error("Kakao Local API 호출 실패: {}", error.getMessage()))
                .onErrorResume(error -> Mono.empty())
                .block();
    }

    /**
     * 키워드로 장소 검색
     *
     * @param query    검색 키워드
     * @param x        중심 X 좌표 (경도)
     * @param y        중심 Y 좌표 (위도)
     * @param radius   반경 (미터 단위)
     * @param page     페이지 번호
     * @param size     한 페이지 크기
     * @return 장소 검색 결과
     */
    public KakaoPlaceDto.Response searchPlacesByKeyword(
            String query,
            String x,
            String y,
            Integer radius,
            Integer page,
            Integer size
    ) {
        log.debug("Kakao Local API - 키워드 검색: query={}, x={}, y={}, radius={}, page={}, size={}",
                query, x, y, radius, page, size);

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search/keyword.json")
                        .queryParam("query", query)
                        .queryParam("x", x)
                        .queryParam("y", y)
                        .queryParam("radius", radius)
                        .queryParam("page", page)
                        .queryParam("size", size)
                        .build())
                .retrieve()
                .bodyToMono(KakaoPlaceDto.Response.class)
                .doOnError(error -> log.error("Kakao Local API 호출 실패: {}", error.getMessage()))
                .onErrorResume(error -> Mono.empty())
                .block();
    }
}
