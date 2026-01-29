package com.ddalkkak.date.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * 약관 동의 엔티티
 * 사용자의 약관 동의 이력을 저장
 */
@Entity
@Table(name = "term_agreements", indexes = {
        @Index(name = "idx_term_agreement_user_id", columnList = "user_id"),
        @Index(name = "idx_term_agreement_term_id", columnList = "term_id")
})
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TermAgreement {

    /**
     * 약관 동의 Primary Key
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 사용자
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * 약관
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "term_id", nullable = false)
    private Term term;

    /**
     * 동의 여부
     */
    @Column(name = "agreed", nullable = false)
    private Boolean agreed;

    /**
     * 동의 일시
     */
    @CreationTimestamp
    @Column(name = "agreed_at", nullable = false, updatable = false)
    private LocalDateTime agreedAt;
}
