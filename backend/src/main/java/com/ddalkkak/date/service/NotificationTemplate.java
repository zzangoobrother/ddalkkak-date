package com.ddalkkak.date.service;

import com.ddalkkak.date.entity.NotificationType;
import lombok.Getter;

/**
 * 알림 메시지 템플릿
 * 알림 유형별 제목과 본문 템플릿 정의
 */
@Getter
public enum NotificationTemplate {

    FEEDBACK_REQUEST(
            NotificationType.FEEDBACK_REQUEST,
            "데이트는 어떠셨나요? \uD83D\uDC95",
            "%s 코스는 만족스러우셨나요? 간단한 피드백을 남겨주시면 더 좋은 코스를 추천해 드릴게요!"
    );

    private final NotificationType notificationType;
    private final String title;
    private final String bodyTemplate;

    NotificationTemplate(NotificationType notificationType, String title, String bodyTemplate) {
        this.notificationType = notificationType;
        this.title = title;
        this.bodyTemplate = bodyTemplate;
    }

    /**
     * 코스명을 적용한 본문 생성
     */
    public String formatBody(String courseName) {
        return String.format(bodyTemplate, courseName);
    }

    /**
     * 알림 유형으로 템플릿 조회
     */
    public static NotificationTemplate fromType(NotificationType type) {
        for (NotificationTemplate template : values()) {
            if (template.notificationType == type) {
                return template;
            }
        }
        throw new IllegalArgumentException("지원하지 않는 알림 유형: " + type);
    }
}
