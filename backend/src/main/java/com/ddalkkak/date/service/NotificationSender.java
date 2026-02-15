package com.ddalkkak.date.service;

import com.ddalkkak.date.entity.PushNotification;

/**
 * 알림 발송 인터페이스
 * 향후 FCM, 카카오 알림톡 등 실제 발송 구현체로 교체 가능
 */
public interface NotificationSender {

    /**
     * 알림 발송
     *
     * @param notification 발송할 알림 정보
     * @return 발송 성공 여부
     */
    boolean send(PushNotification notification);
}
