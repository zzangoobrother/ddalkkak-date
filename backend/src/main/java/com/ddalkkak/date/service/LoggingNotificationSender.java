package com.ddalkkak.date.service;

import com.ddalkkak.date.entity.PushNotification;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * 로깅 기반 알림 발송 구현체 (임시)
 * 실제 발송 대신 로그로 출력하며, 향후 FCM/카카오 알림톡 구현체로 교체 예정
 */
@Slf4j
@Component
public class LoggingNotificationSender implements NotificationSender {

    @Override
    public boolean send(PushNotification notification) {
        log.info("=== 푸시 알림 발송 (로깅) ===");
        log.info("수신자: {}", notification.getUserId());
        log.info("유형: {}", notification.getNotificationType());
        log.info("제목: {}", notification.getTitle());
        log.info("본문: {}", notification.getBody());
        log.info("코스 ID: {}", notification.getCourse().getCourseId());
        log.info("============================");
        return true;
    }
}
