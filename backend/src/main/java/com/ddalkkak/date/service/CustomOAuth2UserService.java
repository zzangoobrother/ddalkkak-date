package com.ddalkkak.date.service;

import com.ddalkkak.date.dto.KakaoOAuth2UserInfo;
import com.ddalkkak.date.entity.User;
import com.ddalkkak.date.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

/**
 * OAuth2 사용자 정보 처리 서비스
 * 카카오 OAuth2 로그인 시 사용자 정보를 처리하고 DB에 저장
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    /**
     * OAuth2 사용자 정보 로드 및 처리
     */
    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // 1. OAuth2 사용자 정보 로드
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // 2. 카카오 사용자 정보 추출
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        log.info("OAuth2 로그인 시도: {}", registrationId);

        if (!"kakao".equals(registrationId)) {
            throw new OAuth2AuthenticationException("지원하지 않는 OAuth2 제공자입니다: " + registrationId);
        }

        KakaoOAuth2UserInfo kakaoUserInfo = new KakaoOAuth2UserInfo(oAuth2User.getAttributes());

        // 3. 사용자 정보 저장 또는 업데이트
        User user = saveOrUpdateUser(kakaoUserInfo);

        // 4. OAuth2User 객체 반환
        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                oAuth2User.getAttributes(),
                "id"  // 카카오는 id를 key로 사용
        );
    }

    /**
     * 사용자 정보 저장 또는 업데이트
     */
    private User saveOrUpdateUser(KakaoOAuth2UserInfo kakaoUserInfo) {
        String kakaoId = kakaoUserInfo.getKakaoId();

        User user = userRepository.findByKakaoId(kakaoId)
                .map(existingUser -> {
                    // 기존 사용자: 프로필 정보 업데이트
                    existingUser.updateProfile(
                            kakaoUserInfo.getNickname(),
                            kakaoUserInfo.getEmail(),
                            kakaoUserInfo.getProfileImageUrl()
                    );
                    existingUser.updateLastLoginAt();
                    log.info("기존 사용자 정보 업데이트: kakaoId={}", kakaoId);
                    return existingUser;
                })
                .orElseGet(() -> {
                    // 신규 사용자: 회원가입
                    User newUser = User.builder()
                            .kakaoId(kakaoId)
                            .email(kakaoUserInfo.getEmail())
                            .nickname(kakaoUserInfo.getNickname())
                            .profileImageUrl(kakaoUserInfo.getProfileImageUrl())
                            .build();
                    newUser.updateLastLoginAt();
                    log.info("신규 사용자 등록: kakaoId={}", kakaoId);
                    return newUser;
                });

        return userRepository.save(user);
    }
}
