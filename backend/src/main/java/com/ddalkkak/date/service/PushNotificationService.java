package com.ddalkkak.date.service;

import com.ddalkkak.date.entity.*;
import com.ddalkkak.date.repository.PushNotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

/**
 * 푸시 알림 서비스
 * 알림 스케줄링, 취소, 발송 처리
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PushNotificationService {

    private final PushNotificationRepository pushNotificationRepository;

    private static final ZoneId KST = ZoneId.of("Asia/Seoul");

    @Value("${notification.feedback-request.delay-hours-min:48}")
    private int delayHoursMin;

    @Value("${notification.feedback-request.delay-hours-max:72}")
    private int delayHoursMax;

    @Value("${notification.feedback-request.preferred-hour:20}")
    private int preferredHour;

    /**
     * 코스 확정 후 피드백 요청 알림 스케줄링
     * confirmedAt 기준 48-72시간 윈도우 내에서 최적 발송 시간(KST 20:00)에 예약
     */
    @Transactional
    public void scheduleFeedbackNotification(Course course) {
        if (course.getUserId() == null) {
            log.warn("사용자 ID가 없는 코스는 알림을 스케줄링할 수 없음 - 코스: {}", course.getCourseId());
            return;
        }

        // 중복 알림 체크
        Optional<PushNotification> existing = pushNotificationRepository
                .findByCourse_IdAndUserIdAndNotificationType(
                        course.getId(), course.getUserId(), NotificationType.FEEDBACK_REQUEST);

        if (existing.isPresent()) {
            log.info("이미 스케줄링된 피드백 알림이 존재 - 코스: {}, 사용자: {}",
                    course.getCourseId(), course.getUserId());
            return;
        }

        // 메시지 템플릿 적용
        NotificationTemplate template = NotificationTemplate.FEEDBACK_REQUEST;
        LocalDateTime confirmedAt = course.getConfirmedAt() != null
                ? course.getConfirmedAt() : LocalDateTime.now();

        // 최적 발송 시간 계산
        LocalDateTime scheduledAt = calculateOptimalSendTime(confirmedAt);

        PushNotification notification = PushNotification.builder()
                .course(course)
                .userId(course.getUserId())
                .notificationType(NotificationType.FEEDBACK_REQUEST)
                .title(template.getTitle())
                .body(template.formatBody(course.getCourseName()))
                .scheduledAt(scheduledAt)
                .build();

        pushNotificationRepository.save(notification);
        log.info("피드백 알림 스케줄링 완료 - 코스: {}, 사용자: {}, 예약 시각: {}",
                course.getCourseId(), course.getUserId(), scheduledAt);
    }

    /**
     * 코스 삭제 시 대기 중인 알림 취소
     */
    @Transactional
    public void cancelPendingNotifications(Long courseId) {
        List<PushNotification> pendingNotifications =
                pushNotificationRepository.findByCourse_IdAndStatus(courseId, NotificationStatus.PENDING);

        if (pendingNotifications.isEmpty()) {
            return;
        }

        for (PushNotification notification : pendingNotifications) {
            notification.cancel();
        }

        pushNotificationRepository.saveAll(pendingNotifications);
        log.info("대기 중인 알림 {} 건 취소 완료 - 코스 ID: {}", pendingNotifications.size(), courseId);
    }

    /**
     * 최적 발송 시간 계산
     * confirmedAt 기준 48-72시간 윈도우 내에서 KST 기준 preferredHour(20시)에 가장 가까운 시간 선택
     */
    LocalDateTime calculateOptimalSendTime(LocalDateTime confirmedAt) {
        LocalDateTime windowStart = confirmedAt.plusHours(delayHoursMin);
        LocalDateTime windowEnd = confirmedAt.plusHours(delayHoursMax);

        // 윈도우 시작일부터 종료일까지 preferredHour(20:00 KST)에 해당하는 시각 탐색
        LocalDate startDate = windowStart.toLocalDate();
        LocalDate endDate = windowEnd.toLocalDate();

        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            LocalDateTime candidate = LocalDateTime.of(date, LocalTime.of(preferredHour, 0));
            if (!candidate.isBefore(windowStart) && !candidate.isAfter(windowEnd)) {
                return candidate;
            }
        }

        // preferredHour 시각이 윈도우에 없으면 윈도우 시작 시각 사용
        return windowStart;
    }
}
