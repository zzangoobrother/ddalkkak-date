package com.ddalkkak.date.repository;

import com.ddalkkak.date.entity.NotificationStatus;
import com.ddalkkak.date.entity.NotificationType;
import com.ddalkkak.date.entity.PushNotification;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PushNotificationRepository extends JpaRepository<PushNotification, Long> {

    /**
     * 발송 대기 중인 알림 배치 조회
     * status가 PENDING이고, 예약 시각이 현재 이전이며, 재시도 횟수가 최대값 미만인 알림
     */
    @Query("SELECT pn FROM PushNotification pn " +
            "WHERE pn.status = :status " +
            "AND pn.scheduledAt <= :now " +
            "AND pn.retryCount < :maxRetry " +
            "ORDER BY pn.scheduledAt ASC")
    List<PushNotification> findPendingNotifications(
            @Param("status") NotificationStatus status,
            @Param("now") LocalDateTime now,
            @Param("maxRetry") int maxRetry,
            Pageable pageable);

    /**
     * 중복 알림 체크
     */
    Optional<PushNotification> findByCourse_IdAndUserIdAndNotificationType(
            Long courseId, String userId, NotificationType notificationType);

    /**
     * 특정 코스의 대기 중인 알림 조회 (취소용)
     */
    List<PushNotification> findByCourse_IdAndStatus(Long courseId, NotificationStatus status);
}
