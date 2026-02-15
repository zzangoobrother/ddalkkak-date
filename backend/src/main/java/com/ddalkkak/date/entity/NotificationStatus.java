package com.ddalkkak.date.entity;

/**
 * 푸시 알림 상태
 */
public enum NotificationStatus {
    PENDING,    // 발송 대기
    SENT,       // 발송 완료
    FAILED,     // 발송 실패
    CANCELLED   // 취소됨
}
