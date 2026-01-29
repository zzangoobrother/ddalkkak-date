package com.ddalkkak.date.service;

import com.ddalkkak.date.dto.KakaoOAuth2UserInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.Map;

/**
 * 카카오 사용자 정보 API 연동 서비스
 * 카카오 access token으로 사용자 정보를 조회
 */
@Slf4j
@Service
public class KakaoApiService {

    private static final String KAKAO_USER_INFO_URL = "https://kapi.kakao.com/v2/user/me";
    private final WebClient webClient;

    public KakaoApiService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://kapi.kakao.com")
                .build();
    }

    /**
     * 카카오 Access Token으로 사용자 정보 조회
     *
     * @param accessToken 카카오 Access Token
     * @return 카카오 사용자 정보
     * @throws IllegalArgumentException 유효하지 않은 토큰
     */
    public KakaoOAuth2UserInfo getUserInfo(String accessToken) {
        try {
            log.debug("카카오 사용자 정보 조회 시작");

            Map<String, Object> attributes = webClient.get()
                    .uri("/v2/user/me")
                    .header("Authorization", "Bearer " + accessToken)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (attributes == null) {
                throw new IllegalArgumentException("카카오 사용자 정보를 가져올 수 없습니다.");
            }

            log.info("카카오 사용자 정보 조회 성공: id={}", attributes.get("id"));
            return new KakaoOAuth2UserInfo(attributes);

        } catch (WebClientResponseException.Unauthorized e) {
            log.error("카카오 토큰 인증 실패: {}", e.getMessage());
            throw new IllegalArgumentException("유효하지 않은 카카오 Access Token입니다.", e);
        } catch (WebClientResponseException e) {
            log.error("카카오 API 호출 실패: status={}, body={}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new IllegalArgumentException("카카오 사용자 정보 조회 실패: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("카카오 사용자 정보 조회 중 오류 발생", e);
            throw new IllegalArgumentException("카카오 사용자 정보 조회 중 오류가 발생했습니다.", e);
        }
    }
}
