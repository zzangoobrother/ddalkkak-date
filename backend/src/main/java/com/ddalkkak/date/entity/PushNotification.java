package com.ddalkkak.date.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * 푸시 알림 엔티티
 * 스케줄링된 알림 정보를 저장
 */
@Entity
@Table(name = "push_notifications", indexes = {
        @Index(name = "idx_push_notification_status_scheduled", columnList = "status, scheduled_at"),
        @Index(name = "idx_push_notification_course_id", columnList = "course_id"),
        @Index(name = "idx_push_notification_user_id", columnList = "user_id")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uq_push_notification", columnNames = {"course_id", "user_id", "notification_type"})
})
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PushNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 알림 대상 코스
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    /**
     * 알림 수신자 ID (카카오 ID)
     */
    @Column(name = "user_id", nullable = false, length = 100)
    private String userId;

    /**
     * 알림 유형
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "notification_type", nullable = false, length = 50)
    private NotificationType notificationType;

    /**
     * 알림 제목
     */
    @Column(name = "title", nullable = false, length = 200)
    private String title;

    /**
     * 알림 본문
     */
    @Column(name = "body", nullable = false, length = 500)
    private String body;

    /**
     * 알림 상태
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private NotificationStatus status = NotificationStatus.PENDING;

    /**
     * 예약 발송 시각
     */
    @Column(name = "scheduled_at", nullable = false)
    private LocalDateTime scheduledAt;

    /**
     * 실제 발송 시각
     */
    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    /**
     * 재시도 횟수
     */
    @Column(name = "retry_count", nullable = false)
    @Builder.Default
    private Integer retryCount = 0;

    /**
     * 에러 메시지
     */
    @Column(name = "error_message", length = 500)
    private String errorMessage;

    /**
     * 생성일시
     */
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * 발송 성공 처리
     */
    public void markAsSent() {
        this.status = NotificationStatus.SENT;
        this.sentAt = LocalDateTime.now();
    }

    /**
     * 발송 실패 처리
     */
    public void markAsFailed(String errorMessage) {
        this.status = NotificationStatus.FAILED;
        this.retryCount++;
        this.errorMessage = errorMessage;
    }

    /**
     * 취소 처리
     */
    public void cancel() {
        this.status = NotificationStatus.CANCELLED;
    }
}
