package com.ddalkkak.date.service;

import com.ddalkkak.date.entity.NotificationStatus;
import com.ddalkkak.date.entity.PushNotification;
import com.ddalkkak.date.repository.PushNotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 알림 스케줄러
 * 주기적으로 발송 대기 중인 알림을 조회하여 발송 처리
 */
@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "notification.scheduler.enabled", havingValue = "true", matchIfMissing = true)
public class NotificationScheduler {

    private final PushNotificationRepository pushNotificationRepository;
    private final NotificationSender notificationSender;

    @Value("${notification.scheduler.batch-size:100}")
    private int batchSize;

    @Value("${notification.scheduler.max-retry-count:3}")
    private int maxRetryCount;

    /**
     * 주기적으로 발송 대기 중인 알림 처리
     * fixedDelayString으로 application.yml 설정값 사용
     */
    @Scheduled(fixedDelayString = "${notification.scheduler.fixed-delay-ms:300000}")
    @Transactional
    public void processScheduledNotifications() {
        LocalDateTime now = LocalDateTime.now();

        List<PushNotification> pendingNotifications = pushNotificationRepository
                .findPendingNotifications(
                        NotificationStatus.PENDING,
                        now,
                        maxRetryCount,
                        PageRequest.of(0, batchSize));

        if (pendingNotifications.isEmpty()) {
            return;
        }

        log.info("발송 대기 알림 {} 건 처리 시작", pendingNotifications.size());

        int successCount = 0;
        int failCount = 0;

        for (PushNotification notification : pendingNotifications) {
            try {
                boolean sent = notificationSender.send(notification);
                if (sent) {
                    notification.markAsSent();
                    successCount++;
                } else {
                    notification.markAsFailed("발송 실패");
                    failCount++;
                }
            } catch (Exception e) {
                notification.markAsFailed(e.getMessage());
                failCount++;
                log.error("알림 발송 중 오류 발생 - 알림 ID: {}, 에러: {}",
                        notification.getId(), e.getMessage());
            }
        }

        pushNotificationRepository.saveAll(pendingNotifications);
        log.info("알림 처리 완료 - 성공: {}, 실패: {}", successCount, failCount);
    }
}
