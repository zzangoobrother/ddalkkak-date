package com.ddalkkak.date.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Map;

/**
 * 카카오 OAuth2 사용자 정보 DTO
 */
@Getter
@AllArgsConstructor
public class KakaoOAuth2UserInfo {

    private Map<String, Object> attributes;

    /**
     * 카카오 고유 ID
     */
    public String getKakaoId() {
        return String.valueOf(attributes.get("id"));
    }

    /**
     * 이메일
     */
    public String getEmail() {
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        if (kakaoAccount == null) {
            return null;
        }
        return (String) kakaoAccount.get("email");
    }

    /**
     * 닉네임
     */
    public String getNickname() {
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        if (kakaoAccount == null) {
            return null;
        }
        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
        if (profile == null) {
            return null;
        }
        return (String) profile.get("nickname");
    }

    /**
     * 프로필 이미지 URL
     */
    public String getProfileImageUrl() {
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        if (kakaoAccount == null) {
            return null;
        }
        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
        if (profile == null) {
            return null;
        }
        return (String) profile.get("profile_image_url");
    }
}
