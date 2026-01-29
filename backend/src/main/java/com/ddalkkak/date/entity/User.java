package com.ddalkkak.date.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * 사용자 엔티티
 * 카카오 OAuth 2.0으로 로그인한 사용자 정보를 저장
 */
@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_user_kakao_id", columnList = "kakao_id", unique = true),
        @Index(name = "idx_user_email", columnList = "email")
})
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    /**
     * 사용자 Primary Key
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 카카오 고유 ID
     */
    @Column(name = "kakao_id", nullable = false, unique = true, length = 100)
    private String kakaoId;

    /**
     * 이메일 (카카오 계정 이메일)
     */
    @Column(name = "email", length = 255)
    private String email;

    /**
     * 닉네임 (카카오 닉네임)
     */
    @Column(name = "nickname", nullable = false, length = 100)
    private String nickname;

    /**
     * 프로필 이미지 URL
     */
    @Column(name = "profile_image_url", length = 500)
    private String profileImageUrl;

    /**
     * 생성일시
     */
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * 수정일시
     */
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * 마지막 로그인 일시
     */
    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    /**
     * 마지막 로그인 일시 업데이트
     */
    public void updateLastLoginAt() {
        this.lastLoginAt = LocalDateTime.now();
    }

    /**
     * 프로필 정보 업데이트 (닉네임, 이메일, 프로필 이미지)
     */
    public void updateProfile(String nickname, String email, String profileImageUrl) {
        this.nickname = nickname;
        this.email = email;
        this.profileImageUrl = profileImageUrl;
    }
}
