package com.ddalkkak.date.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * 약관 엔티티
 * 서비스 이용약관, 개인정보 처리방침, 마케팅 정보 수신 동의 등
 */
@Entity
@Table(name = "terms", indexes = {
        @Index(name = "idx_term_type", columnList = "term_type"),
        @Index(name = "idx_term_version", columnList = "version")
})
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Term {

    /**
     * 약관 Primary Key
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 약관 종류 (TERMS_OF_SERVICE, PRIVACY_POLICY, MARKETING)
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "term_type", nullable = false, length = 50)
    private TermType termType;

    /**
     * 약관 제목
     */
    @Column(name = "title", nullable = false, length = 200)
    private String title;

    /**
     * 약관 내용
     */
    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;

    /**
     * 약관 버전
     */
    @Column(name = "version", nullable = false, length = 20)
    private String version;

    /**
     * 필수 동의 여부
     */
    @Column(name = "required", nullable = false)
    private Boolean required;

    /**
     * 생성일시
     */
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
